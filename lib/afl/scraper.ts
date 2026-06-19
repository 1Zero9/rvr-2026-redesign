/**
 * AFL public data scraper — Over 35s standings.
 *
 * Scrapes the AFL homepage which server-renders full standings tables
 * (Pos, Club, P, W, D, L, Pts) for all divisions. Individual table
 * pages are avoided — they render stat columns client-side only.
 *
 * Returns null / empty on any failure so callers can fall back to
 * cached data without crashing.
 */

import type { AflDivision } from '@/config/afl-competitions';

export interface AflStandingsRow {
  position: number;
  teamName: string;
  played:   number;
  won:      number;
  drawn:    number;
  lost:     number;
  points:   number;
}

export interface AflStandingsTable {
  division:  AflDivision;
  season:    string;
  standings: AflStandingsRow[];
  scrapedAt: string; // ISO timestamp
}

const AFL_HOME_URL = 'https://www.amateurfootballleague.com/';

const AFL_HEADERS: Record<string, string> = {
  'User-Agent':      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  'Accept':          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-IE,en;q=0.9',
  'Cache-Control':   'no-cache',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

// ─── Parser ───────────────────────────────────────────────────────────────────

/**
 * Parses all division standings tables from the AFL homepage HTML.
 * Returns a Map of division heading text → rows.
 *
 * The AFL homepage structure:
 *   <h1 class="sp-table-name">Premier Division</h1>  (heading variant varies)
 *   <table>
 *     <thead><tr><th>Pos</th><th>Club</th><th>P</th><th>W</th><th>D</th><th>L</th><th>Pts</th></tr></thead>
 *     <tbody>
 *       <tr><td>1</td><td>[img+link]TeamName</td><td>9</td>...</tr>
 *     </tbody>
 *   </table>
 *
 * Strategy: split HTML on each <table occurrence, find the heading
 * immediately before each table block, parse rows from tbody.
 */
function parseAllDivisions(html: string): Map<string, AflStandingsRow[]> {
  const result = new Map<string, AflStandingsRow[]>();

  const chunks = html.split(/<table\b/i);

  for (let i = 1; i < chunks.length; i++) {
    const tableHtml = '<table' + chunks[i];

    // Find the last heading in the chunk preceding this table
    const preceding = chunks[i - 1];
    const headingMatch =
      preceding.match(/[\s\S]*<h[1-6][^>]*>([^<]+)<\/h[1-6]>/i) ??
      preceding.match(/[\s\S]*class="[^"]*(?:sp-table-name|widget-title|sp-table-caption)[^"]*"[^>]*>([^<]+)</i);

    if (!headingMatch) continue;
    const divisionHeading = innerText(headingMatch[1]).trim();
    if (!divisionHeading) continue;

    // Parse tbody rows
    const tbodyMatch = tableHtml.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/i);
    if (!tbodyMatch) continue;

    const rows: AflStandingsRow[] = [];
    const trRe = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    let trMatch: RegExpExecArray | null;

    while ((trMatch = trRe.exec(tbodyMatch[1])) !== null) {
      const cells: string[] = [];
      const tdRe = /<td[^>]*>([\s\S]*?)<\/td>/gi;
      let tdMatch: RegExpExecArray | null;
      while ((tdMatch = tdRe.exec(trMatch[1])) !== null) {
        cells.push(innerText(tdMatch[1]));
      }

      // Expect at least: Pos, Club, P, W, D, L, Pts
      if (cells.length < 7) continue;

      const position = parseInt(cells[0], 10);
      if (!Number.isFinite(position) || position < 1) continue;

      const teamName = cells[1];
      if (!teamName || teamName.length < 2) continue;

      rows.push({
        position,
        teamName,
        played: parseInt(cells[2], 10) || 0,
        won:    parseInt(cells[3], 10) || 0,
        drawn:  parseInt(cells[4], 10) || 0,
        lost:   parseInt(cells[5], 10) || 0,
        points: parseInt(cells[6], 10) || 0,
      });
    }

    if (rows.length > 0) {
      result.set(divisionHeading, rows);
    }
  }

  return result;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Fetches the AFL homepage and returns standings for one division.
 *
 * Matches by checking whether the on-page heading contains
 * `division.officialName` (case-insensitive).
 *
 * Returns null on fetch failure or if the division is not found.
 */
export async function scrapeAflStandings(
  division: AflDivision,
  season: string,
): Promise<AflStandingsTable | null> {
  try {
    const res = await fetch(AFL_HOME_URL, { headers: AFL_HEADERS });
    if (!res.ok) {
      console.warn(`[afl/scraper] HTTP ${res.status} fetching AFL homepage`);
      return null;
    }

    const html = await res.text();
    if (!html || html.length < 500) {
      console.warn('[afl/scraper] Empty or truncated AFL homepage response');
      return null;
    }

    const allDivisions = parseAllDivisions(html);

    let standings: AflStandingsRow[] | undefined;
    for (const [heading, rows] of allDivisions) {
      if (heading.toLowerCase().includes(division.officialName.toLowerCase())) {
        standings = rows;
        break;
      }
    }

    if (!standings || standings.length === 0) {
      console.warn(
        `[afl/scraper] Division "${division.officialName}" not found. ` +
        `Available: ${[...allDivisions.keys()].join(', ')}`,
      );
      return null;
    }

    console.log(
      `[afl/scraper] "${division.competitionName}" — ${standings.length} rows scraped`,
    );

    return { division, season, standings, scrapedAt: new Date().toISOString() };
  } catch (err) {
    console.warn('[afl/scraper] Fetch error:', err);
    return null;
  }
}

/**
 * Scrapes AFL standings for all registered AFL divisions.
 * Fetches the homepage once and parses all divisions from it.
 * Returns only the divisions that matched successfully.
 */
export async function scrapeAllAflStandings(
  divisions: AflDivision[],
  season: string,
): Promise<AflStandingsTable[]> {
  try {
    const res = await fetch(AFL_HOME_URL, { headers: AFL_HEADERS });
    if (!res.ok) {
      console.warn(`[afl/scraper] HTTP ${res.status} fetching AFL homepage`);
      return [];
    }

    const html = await res.text();
    if (!html || html.length < 500) {
      console.warn('[afl/scraper] Empty or truncated response');
      return [];
    }

    const allDivisions = parseAllDivisions(html);
    const results: AflStandingsTable[] = [];

    for (const division of divisions) {
      let standings: AflStandingsRow[] | undefined;
      for (const [heading, rows] of allDivisions) {
        if (heading.toLowerCase().includes(division.officialName.toLowerCase())) {
          standings = rows;
          break;
        }
      }

      if (!standings || standings.length === 0) {
        console.warn(`[afl/scraper] No rows found for "${division.officialName}"`);
        continue;
      }

      console.log(
        `[afl/scraper] "${division.competitionName}" — ${standings.length} rows`,
      );

      results.push({ division, season, standings, scrapedAt: new Date().toISOString() });
    }

    return results;
  } catch (err) {
    console.warn('[afl/scraper] scrapeAllAflStandings error:', err);
    return [];
  }
}
