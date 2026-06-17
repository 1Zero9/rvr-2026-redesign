/**
 * DDSL public data scrapers.
 *
 * Three public surfaces are used — all unauthenticated:
 *
 *   1. ddsl.ie/clubprofile/{clubId}
 *      Contains wp-admin/admin-ajax.php URLs with the current season's
 *      competition_id embedded as a query param. Scraping this once per season
 *      flip is all that's needed to keep the sync route working across years.
 *
 *   2. ddsl.ie/wp-admin/admin-ajax.php?action=fixtures|results&club_id=…&competition_id=…
 *      Returns server-rendered HTML for all of a club's upcoming fixtures or
 *      recent results across every competition they are entered in. Each league
 *      section header is an <a href="ddsl.ie/league/{id}"> link — these IDs
 *      drive the standings scrapes without any manual configuration.
 *
 *   3. ddsl.ie/league/{competitionId}/
 *      Server-rendered HTML standings table. GF/GA/GD are not published on the
 *      public page; those fields are set to 0. DDSLTableWidget hides those
 *      columns when all values are zero.
 *
 * All functions return null / empty on any failure so callers can substitute
 * cached or local-seed data without crashing the sync request.
 */

import type { SportLoMoFixture, SportLoMoStandingsTable } from './types';

// ---------------------------------------------------------------------------
// Club constants
// ---------------------------------------------------------------------------

export const RVR_CLUB_ID = 87086;

// Season-umbrella competition ID embedded in the club profile page.
// DDSL issues a new ID each August. The discoverCompetitionId() function reads
// it automatically from the club profile. This value is the fallback if that
// scrape fails.
export const FALLBACK_AJAX_COMPETITION_ID = 211017;

// ---------------------------------------------------------------------------
// Shared fetch headers
// ---------------------------------------------------------------------------

const DDSL_HEADERS: Record<string, string> = {
  'User-Agent':      'Mozilla/5.0 (compatible; RVRBot/1.0; +https://rivervalleyrangers.ie)',
  'Accept':          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-IE,en;q=0.9',
  'Cache-Control':   'no-cache',
};

// ---------------------------------------------------------------------------
// HTML utilities (shared)
// ---------------------------------------------------------------------------

function innerText(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#?\w+;/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractIntParam(html: string, name: string): number {
  const m = html.match(new RegExp(`[?&]${name}=(\\d+)`));
  return m ? parseInt(m[1], 10) : 0;
}

function extractPathId(html: string, prefix: string): number {
  const m = html.match(new RegExp(`${prefix}(\\d+)`));
  return m ? parseInt(m[1], 10) : 0;
}

// ---------------------------------------------------------------------------
// 1. Club profile — season competition ID discovery
// ---------------------------------------------------------------------------

/**
 * Scrapes the RVR club profile page to extract the current season's
 * competition_id from the wp-admin/admin-ajax.php URLs embedded in the HTML.
 *
 * Returns null when the scrape fails — caller should fall back to
 * FALLBACK_AJAX_COMPETITION_ID.
 */
export async function discoverCompetitionId(clubId: number): Promise<number | null> {
  const url = `https://ddsl.ie/clubprofile/${clubId}`;
  try {
    const res = await fetch(url, { headers: DDSL_HEADERS });
    if (!res.ok) {
      console.warn(`[ddsl/scraper] Club profile HTTP ${res.status}`);
      return null;
    }
    const html = await res.text();
    const m = html.match(/admin-ajax\.php[^"']*?competition_id=(\d+)/);
    if (!m) {
      console.warn('[ddsl/scraper] No competition_id found in club profile');
      return null;
    }
    const id = parseInt(m[1], 10);
    console.log(`[ddsl/scraper] Discovered season competition_id: ${id}`);
    return id;
  } catch (err) {
    console.warn('[ddsl/scraper] Club profile fetch error:', err);
    return null;
  }
}

// ---------------------------------------------------------------------------
// 2. AJAX fixtures / results — all RVR teams in one call
// ---------------------------------------------------------------------------

// Converts DDSL short competition names to a canonical form that parseAgeGroup()
// can process. The short names come from the AJAX league-link text.
//
// Examples:
//   "15.5 Boys Sat"  → "DDSL U15 Boys Saturday Division 5"
//   "14.3 Girls Sun" → "DDSL U14 Girls Sunday Division 3"
//   "10.4 Boys Sun"  → "DDSL U10 Boys Sunday Division 4"
//   "12.5 Boys Sun"  → "DDSL U12 Boys Sunday Division 5"
export function ddslShortToCanonical(shortName: string): string {
  const m = shortName.trim().match(/^(\d{1,2})\.(\d+)\s+(Boys|Girls)\s+(Sat|Sun)$/i);
  if (!m) return `DDSL ${shortName}`;
  const [, age, div, gender, day] = m;
  const fullDay = /^sat/i.test(day) ? 'Saturday' : 'Sunday';
  const g = gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
  return `DDSL U${age} ${g} ${fullDay} Division ${div}`;
}

// Parse "Saturday, 20 June 2026" or "Monday 15 June 2026" → "2026-06-20"
function parseDDSLDate(raw: string): string {
  const clean = raw.replace(/^[A-Za-z]+,?\s+/, '').trim();
  try {
    const d = new Date(`${clean} UTC`);
    if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  } catch {}
  return '';
}

// Stable synthetic fixtureId derived from content — avoids collisions without
// requiring a real SportLoMo ID.
function stableFixtureId(leagueId: number, date: string, home: string, away: string): number {
  const s = `${leagueId}|${date}|${home}|${away}`;
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h) ^ s.charCodeAt(i);
  return Math.abs(h % 8_000_000) + 1_000_000;
}

// Extract text content from HTML cells in order. Tries <td> first, then <div>.
function extractOrderedCells(html: string, max = 6): string[] {
  const cells: string[] = [];

  for (const pattern of [
    /<td[^>]*>([\s\S]*?)<\/td>/gi,
    /<li[^>]*>([\s\S]*?)<\/li>/gi,
    /<div[^>]*>([\s\S]*?)<\/div>/gi,
    /<span[^>]*>([\s\S]*?)<\/span>/gi,
  ]) {
    const re = new RegExp(pattern.source, pattern.flags);
    let m;
    while ((m = re.exec(html)) !== null) {
      const t = innerText(m[1]);
      if (t && t.length >= 2 && t.length < 120) cells.push(t);
      if (cells.length >= max) break;
    }
    if (cells.length >= 3) break;
  }

  return cells;
}

// Identifies the score/time cell among ordered cells. Returns its index or -1.
function findScoreOrTimeIndex(cells: string[]): number {
  return cells.findIndex((c) => /^\d{1,2}:\d{2}$/.test(c) || /^\d+\s*[-–]\s*\d+$/.test(c));
}

function parseScoreOrTime(cell: string): {
  fixtureTime?: string;
  score?: { home: number; away: number };
} {
  const timeM = cell.match(/^(\d{1,2}:\d{2})$/);
  if (timeM) return { fixtureTime: timeM[1] };
  const scoreM = cell.match(/^(\d+)\s*[-–]\s*(\d+)$/);
  if (scoreM) return { score: { home: parseInt(scoreM[1]), away: parseInt(scoreM[2]) } };
  return {};
}

/**
 * Parses the HTML fragment immediately following a league link in the AJAX
 * response. Expected cell order: homeTeam | score/time | awayTeam | venue.
 */
function parseMatchBlock(
  blockHtml: string,
  date: string,
  leagueId: number,
  competitionName: string,
  isResult: boolean,
): SportLoMoFixture | null {
  const cells = extractOrderedCells(blockHtml);
  if (cells.length < 3) return null;

  // Locate the score/time cell — it anchors the home/away positions.
  let stIdx = findScoreOrTimeIndex(cells);
  if (stIdx < 0) stIdx = 1; // fall back to positional centre

  const homeTeam = cells[stIdx - 1] ?? cells[0];
  const awayTeam = cells[stIdx + 1] ?? cells[2];
  const venue    = cells[stIdx + 2] ?? cells[3] ?? 'Venue TBC';

  if (!homeTeam || !awayTeam || homeTeam === awayTeam) return null;

  const { fixtureTime, score } = parseScoreOrTime(cells[stIdx] ?? '');

  return {
    fixtureId:   stableFixtureId(leagueId, date, homeTeam, awayTeam),
    fixtureDate: date,
    fixtureTime,
    homeTeam: { teamId: 0, teamName: homeTeam, clubId: 0, clubName: homeTeam },
    awayTeam: { teamId: 0, teamName: awayTeam, clubId: 0, clubName: awayTeam },
    venue:    { venueName: venue },
    competition: { competitionId: leagueId, competitionName },
    status: isResult ? 'Result' : 'Fixture',
    score,
  };
}

// Match date headers like "Saturday, 20 June 2026" / "Monday 15 June 2026"
const DATE_HEADER_RE = /(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)[,]?\s+\d{1,2}\s+\w+\s+\d{4}/gi;
const LEAGUE_LINK_RE = /href="https?:\/\/ddsl\.ie\/league\/(\d+)"[^>]*>([^<]+)<\/a>/gi;

export interface ClubAjaxData {
  /** Parsed fixture or result records ready for the transform pipeline. */
  fixtures: SportLoMoFixture[];
  /** Unique league IDs discovered from the league-name anchor hrefs. */
  leagueIds: number[];
  /**
   * Map of leagueId → canonical competition name (e.g. "DDSL U15 Boys Saturday Division 5").
   * Use this to name newly-discovered leagues that are not in KNOWN_DIVISIONS.
   */
  leagueNames: Map<number, string>;
}

const EMPTY_AJAX: ClubAjaxData = { fixtures: [], leagueIds: [], leagueNames: new Map() };

/**
 * Fetches the wp-admin/admin-ajax.php endpoint for a club and parses the
 * resulting HTML into fixture/result records plus the set of league IDs that
 * can be used to scrape standings.
 */
export async function scrapeClubAjax(
  clubId: number,
  competitionId: number,
  action: 'fixtures' | 'results',
): Promise<ClubAjaxData> {
  const url = new URL('https://ddsl.ie/wp-admin/admin-ajax.php');
  url.searchParams.set('action', action);
  url.searchParams.set('club_id', String(clubId));
  url.searchParams.set('competition_id', String(competitionId));
  url.searchParams.set('displayResults', '1');

  try {
    const res = await fetch(url.toString(), { headers: DDSL_HEADERS });
    if (!res.ok) {
      console.warn(`[ddsl/scraper] HTTP ${res.status} for AJAX ${action}`);
      return EMPTY_AJAX;
    }

    const html = await res.text();
    if (!html || html.length < 50) {
      console.warn(`[ddsl/scraper] Empty AJAX response for ${action}`);
      return EMPTY_AJAX;
    }

    // --- Extract all league links from the full HTML ---
    const leagueMap = new Map<number, string>(); // id → short name
    const leagueRe = new RegExp(LEAGUE_LINK_RE.source, LEAGUE_LINK_RE.flags);
    let lm;
    while ((lm = leagueRe.exec(html)) !== null) {
      leagueMap.set(parseInt(lm[1], 10), lm[2].trim());
    }

    // --- Find date-section boundaries ---
    const dateRe = new RegExp(DATE_HEADER_RE.source, DATE_HEADER_RE.flags);
    const sections: { date: string; idx: number }[] = [];
    let dm;
    while ((dm = dateRe.exec(html)) !== null) {
      const date = parseDDSLDate(dm[0]);
      if (date) sections.push({ date, idx: dm.index });
    }

    // --- Parse matches within each date section ---
    const fixtures: SportLoMoFixture[] = [];
    const isResult = action === 'results';

    for (let i = 0; i < sections.length; i++) {
      const { date, idx } = sections[i];
      const end = i + 1 < sections.length ? sections[i + 1].idx : html.length;
      const sectionHtml = html.slice(idx, end);

      const sectionLeagueRe = new RegExp(LEAGUE_LINK_RE.source, LEAGUE_LINK_RE.flags);
      let slm;
      while ((slm = sectionLeagueRe.exec(sectionHtml)) !== null) {
        const leagueId   = parseInt(slm[1], 10);
        const shortName  = slm[2].trim();
        const compName   = ddslShortToCanonical(shortName);
        const afterLeague = sectionHtml.slice(
          slm.index + slm[0].length,
          slm.index + slm[0].length + 800,
        );

        const match = parseMatchBlock(afterLeague, date, leagueId, compName, isResult);
        if (match) {
          fixtures.push(match);
        } else {
          console.warn(
            `[ddsl/scraper] Could not parse match block — league ${leagueId} ("${shortName}") on ${date}`,
          );
        }
      }
    }

    console.log(
      `[ddsl/scraper] AJAX ${action}: ${fixtures.length} matches, ` +
      `${leagueMap.size} leagues discovered`,
    );

    // Build canonical-name map for use in standings naming
    const leagueNames = new Map<number, string>(
      [...leagueMap.entries()].map(([id, shortName]) => [id, ddslShortToCanonical(shortName)]),
    );

    return { fixtures, leagueIds: [...leagueMap.keys()], leagueNames };
  } catch (err) {
    console.warn(`[ddsl/scraper] Error in AJAX ${action}:`, err);
    return EMPTY_AJAX;
  }
}

// ---------------------------------------------------------------------------
// 3. League standings page — ddsl.ie/league/{id}/
// ---------------------------------------------------------------------------

function parseTdCells(html: string): { rawHtml: string; text: string }[] {
  const cells: { rawHtml: string; text: string }[] = [];
  const re = /<td[^>]*>([\s\S]*?)<\/td>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    cells.push({ rawHtml: m[1], text: innerText(m[1]) });
  }
  return cells;
}

function parseStandingsHtml(
  html: string,
  competitionId: number,
  competitionName: string,
  season: string,
): SportLoMoStandingsTable | null {
  const tbodyMatch = html.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/i);
  const scope = tbodyMatch?.[1] ?? html;

  const standings: SportLoMoStandingsTable['standings'] = [];
  const trRe = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let trMatch;

  while ((trMatch = trRe.exec(scope)) !== null) {
    const rowHtml = trMatch[0];
    const cells   = parseTdCells(trMatch[1]);

    if (cells.length < 7) continue;

    const position = parseInt(cells[0].text, 10);
    if (!Number.isFinite(position) || position < 1 || position > 30) continue;

    const teamName = cells[1].text;
    if (!teamName || teamName.length < 2) continue;

    // Extract real SportLoMo IDs from the club-profile link when present.
    const teamId = extractIntParam(rowHtml, 'team_id') || 90100 + position;
    const clubId = extractPathId(rowHtml, '/clubprofile/') || 0;

    standings.push({
      position,
      team: { teamId, teamName, clubId },
      played: parseInt(cells[2].text, 10) || 0,
      won:    parseInt(cells[3].text, 10) || 0,
      drawn:  parseInt(cells[4].text, 10) || 0,
      lost:   parseInt(cells[5].text, 10) || 0,
      goalsFor:       0, // not published on the public DDSL league page
      goalsAgainst:   0,
      goalDifference: 0,
      points: parseInt(cells[6].text, 10) || 0,
    });
  }

  if (standings.length === 0) return null;
  return { competitionId, competitionName, season, standings };
}

/**
 * Fetches and parses the standings table from ddsl.ie/league/{competitionId}/.
 *
 * Returns null when the fetch fails or no table rows are found, so callers can
 * fall back to local seed data.
 */
export async function scrapeDDSLStandings(
  competitionId: number,
  competitionName: string,
  season: string,
  leagueUrl: string,
): Promise<SportLoMoStandingsTable | null> {
  try {
    const res = await fetch(leagueUrl, { headers: DDSL_HEADERS });
    if (!res.ok) {
      console.warn(`[ddsl/scraper] HTTP ${res.status} for standings ${leagueUrl}`);
      return null;
    }

    const html   = await res.text();
    const result = parseStandingsHtml(html, competitionId, competitionName, season);

    if (result) {
      console.log(
        `[ddsl/scraper] Standings "${competitionName}" — ${result.standings.length} rows`,
      );
    } else {
      console.warn(`[ddsl/scraper] No standings rows parsed from ${leagueUrl}`);
    }

    return result;
  } catch (err) {
    console.warn(`[ddsl/scraper] Standings fetch error for ${leagueUrl}:`, err);
    return null;
  }
}
