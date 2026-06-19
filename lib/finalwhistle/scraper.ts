import type { SeniorMatch, SeniorSyncResponse } from './types';

const TEAM_PAGE_URL = 'https://www.finalwhistle.ie/soccer/team/rivervalley-rangers-afc/';

const FW_HEADERS: Record<string, string> = {
  'User-Agent':      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  'Accept':          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-IE,en;q=0.9',
  'Cache-Control':   'no-cache',
};

const UPPER_TOKENS = new Set(['AFC', 'FC', 'SC', 'BC', 'UTD', 'FK', 'GFC', 'BFC', 'YFC']);

function slugToName(slug: string): string {
  return slug
    .split('-')
    .map((w) => {
      const up = w.toUpperCase();
      return UPPER_TOKENS.has(up) ? up : w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(' ');
}

function innerText(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#?\w+;/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// SportsPress match rows
const TR_BLOCK_RE = /<tr\b[^>]*\bsp-row\b[^>]*>([\s\S]*?)<\/tr>/gi;

// Match page URLs: /soccer/event/{league}/{competition}/{teams}/{date}/
const EVENT_HREF_RE = /href="((?:https?:\/\/www\.finalwhistle\.ie)?\/soccer\/event\/[a-z0-9-]+\/([a-z0-9-]+)\/([a-z0-9][a-z0-9-]*-v-[a-z0-9][a-z0-9-]*)\/(\d{4}-\d{2}-\d{2})\/?[^"]*)"/i;

// Score spans: <span class="sp-result ">1</span>
const SP_RESULTS_BLOCK_RE = /class="sp-event-results"[^>]*>[\s\S]*?<\/h5>/i;
const SP_RESULT_RE = /class="sp-result[^"]*"[^>]*>(\d+)<\/span>/gi;

// Competition display name from sp-event-league div
const SP_LEAGUE_RE = /class="sp-event-league"[^>]*>[\s\S]*?<a[^>]*>([^<]+)<\/a>/i;

// Venue from first (non-hidden) sp-event-venue block
const SP_VENUE_RE = /class="sp-event-venue"[^>]*>[\s\S]*?itemprop="address"[^>]*>([^<]+)<\/div>/i;


export async function scrapeSeniorMatches(): Promise<SeniorSyncResponse | null> {
  try {
    const res = await fetch(TEAM_PAGE_URL, { headers: FW_HEADERS });
    if (!res.ok) {
      console.warn(`[finalwhistle/scraper] HTTP ${res.status}`);
      return null;
    }
    const html = await res.text();
    if (!html || html.length < 500) {
      console.warn('[finalwhistle/scraper] Empty or too-short response');
      return null;
    }

    const matches: SeniorMatch[] = [];
    const seen = new Set<string>();

    const trRe = new RegExp(TR_BLOCK_RE.source, TR_BLOCK_RE.flags);
    let trm: RegExpExecArray | null;
    while ((trm = trRe.exec(html)) !== null) {
      const block = trm[1];

      // Extract event URL — provides competition slug, teams slug, date
      const hrefMatch = EVENT_HREF_RE.exec(block);
      if (!hrefMatch) continue;
      const [, rawUrl, compSlug, teamsSlug, date] = hrefMatch;

      const matchId = `${date}:${teamsSlug}`;
      if (seen.has(matchId)) continue;
      seen.add(matchId);

      const matchUrl = rawUrl.startsWith('http')
        ? rawUrl
        : `https://www.finalwhistle.ie${rawUrl}`;

      // Team names from slug
      const vIdx = teamsSlug.indexOf('-v-');
      if (vIdx === -1) continue;
      const homeSlug = teamsSlug.slice(0, vIdx);
      const awaySlug = teamsSlug.slice(vIdx + 3);
      const homeTeam  = slugToName(homeSlug);
      const awayTeam  = slugToName(awaySlug);
      const isRvrHome = homeSlug.includes('rivervalley-rangers');

      // Competition display name — prefer what FinalWhistle shows over slug conversion
      const leagueMatch = SP_LEAGUE_RE.exec(block);
      const competition = leagueMatch
        ? innerText(leagueMatch[1])
        : slugToName(compSlug);

      // Score from sp-event-results block
      let score: { home: number; away: number } | null = null;
      let status: 'Result' | 'Postponed' | 'Fixture' = 'Fixture';

      const resultsBlock = SP_RESULTS_BLOCK_RE.exec(block);
      if (resultsBlock) {
        if (/class="sp-result\s+postponed"/i.test(resultsBlock[0])) {
          status = 'Postponed';
        } else {
          const scoreRe = new RegExp(SP_RESULT_RE.source, SP_RESULT_RE.flags);
          const scores: number[] = [];
          let sm: RegExpExecArray | null;
          while ((sm = scoreRe.exec(resultsBlock[0])) !== null) {
            scores.push(parseInt(sm[1], 10));
          }
          if (scores.length >= 2) {
            score  = { home: scores[0], away: scores[1] };
            status = 'Result';
          }
        }
      }

      // Venue — first sp-event-venue block (the hidden N/A duplicate is second)
      const venueMatch = SP_VENUE_RE.exec(block);
      const venue = venueMatch ? innerText(venueMatch[1]) : '';

      matches.push({
        matchId,
        date,
        homeTeam,
        awayTeam,
        score,
        status,
        competition,
        venue,
        matchUrl,
        isRvrHome,
      });
    }

    const results  = matches.filter((match) => match.status === 'Result' || match.status === 'Postponed');
    const fixtures = matches.filter((match) => match.status === 'Fixture');

    console.log(
      `[finalwhistle/scraper] Parsed ${matches.length} matches: ` +
      `${results.length} results, ${fixtures.length} upcoming/postponed`,
    );

    return {
      scrapedAt: new Date().toISOString(),
      source:    'finalwhistle.ie',
      results,
      fixtures,
    };
  } catch (err) {
    console.warn('[finalwhistle/scraper] Error:', err);
    return null;
  }
}
