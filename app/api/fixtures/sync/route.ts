import { NextRequest, NextResponse } from 'next/server';
import {
  fetchAllFixtures,
  fetchAllResults,
  fetchAllStandings,
  SportLoMoApiError,
  SportLoMoConfigError,
} from '@/lib/ddsl/client';
import { cacheGet, cacheSet, TTL_MS } from '@/lib/ddsl/cache';
import { applyDivisionFilter } from '@/lib/ddsl/division-filter';
import { parseAgeGroup } from '@/lib/ddsl/mercy-rule';
import { transformAll, transformStandingsTable } from '@/lib/ddsl/transform';
import type {
  AgeGroup,
  DiscoveredDivision,
  DevelopmentDivision,
  LeagueTable,
  NormalisedMatch,
  SportLoMoFixture,
  SportLoMoStandingsTable,
  SyncResponse,
} from '@/lib/ddsl/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const CACHE_KEY = 'ddsl:sync';

// ---------------------------------------------------------------------------
// Age-tier gate
// ---------------------------------------------------------------------------

// DDSL and FAI policy: league standings must not be published for non-competitive
// development age groups. Fixtures in these divisions are transmitted (dates only
// in the developmentDivisions block); point totals and standings rows are stripped.
const DEVELOPMENT_AGE_GROUPS = new Set<AgeGroup>([
  'U7', 'U8', 'U9', 'U10', 'U11',
]);

const DEVELOPMENT_TIER_REASON =
  'League standings are not published for development age groups (U7–U11) ' +
  'in accordance with DDSL and FAI child welfare guidelines.';

function isDevelopmentTier(ageGroup: AgeGroup): boolean {
  return DEVELOPMENT_AGE_GROUPS.has(ageGroup);
}

// ---------------------------------------------------------------------------
// Division discovery
// ---------------------------------------------------------------------------

function buildDivisionList(
  competitionMap: Map<string, { id: number; name: string }>,
  fixtures: NormalisedMatch[],
  results: NormalisedMatch[],
): DiscoveredDivision[] {
  return [...competitionMap.values()]
    .map(({ id, name }) => {
      const ageGroup = parseAgeGroup(name);
      return {
        competitionId:   id,
        competitionName: name,
        ageGroup,
        tier: isDevelopmentTier(ageGroup) ? 'development' : 'competitive',
        fixtureCount: fixtures.filter((f) => f.competition === name).length,
        resultCount:  results.filter((r) => r.competition === name).length,
      } satisfies DiscoveredDivision;
    })
    .sort((a, b) => a.competitionName.localeCompare(b.competitionName));
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function GET(_req: NextRequest): Promise<NextResponse> {
  const cached = cacheGet<SyncResponse>(CACHE_KEY);
  if (cached.hit) {
    return NextResponse.json(cached.data, {
      headers: {
        'X-Cache':         'HIT',
        'X-Cache-Expires': cached.expiresAt.toString(),
        'Cache-Control':   'no-store, max-age=0, must-revalidate',
      },
    });
  }

  let rawFixtures:  SportLoMoFixture[]        = [];
  let rawResults:   SportLoMoFixture[]        = [];
  let rawStandings: SportLoMoStandingsTable[] = [];
  let fetchFailed = false;

  try {
    console.log('[api/fixtures/sync] Initiating outbound DDSL connection call...');
    // Fetch all pages in parallel — covers all 29 active RVR squads across
    // every division without being truncated by a single-page size cap.
    [rawFixtures, rawResults, rawStandings] = await Promise.all([
      fetchAllFixtures(),
      fetchAllResults(),
      fetchAllStandings(),
    ]);
    console.log(
      `[api/fixtures/sync] Raw payload received — fixtures: ${rawFixtures.length},` +
      ` results: ${rawResults.length}, standings tables: ${rawStandings.length}`,
    );
  } catch (err) {
    // Missing env vars is a hard server config error — surface it immediately.
    if (err instanceof SportLoMoConfigError) {
      console.error('[api/fixtures/sync] DDSL environment not configured:', err.message);
      return NextResponse.json(
        {
          error: 'DDSL connection not configured — set SPORTLOMO_BASE_URL, ' +
                 'SPORTLOMO_API_KEY, and SPORTLOMO_CLUB_ID in environment variables',
        },
        { status: 503, headers: { 'Cache-Control': 'no-store, max-age=0, must-revalidate' } },
      );
    }
    // For all API errors (including 404) and network failures, log and continue
    // with empty arrays so the frontend renders its "no data" state gracefully
    // instead of an error page.
    if (err instanceof SportLoMoApiError) {
      console.error(
        `[api/fixtures/sync] DDSL feed returned HTTP ${err.status} — serving empty payload:`,
        err.message,
      );
    } else {
      console.error('[api/fixtures/sync] Unexpected error during DDSL fetch — serving empty payload:', err);
    }
    fetchFailed = true;
  }

  // Transform raw fixtures and results through the shared pipeline.
  // transformAll applies mercy-rule score capping and venue resolution.
  const fixtures = transformAll(rawFixtures);
  const results  = transformAll(rawResults);

  // Strip any standings rows that are not in the registered member list for
  // their competition. This catches data contamination caused by incorrect
  // competition IDs in the SportLoMo feed (e.g. a club appearing in a division
  // table due to a mismatched competition ID at source).
  const preFilterCount = rawStandings.length;
  rawStandings = applyDivisionFilter(rawStandings);
  console.log(
    `[api/fixtures/sync] Division integrity filter — tables before: ${preFilterCount},` +
    ` tables after: ${rawStandings.length}`,
  );

  // Build a deduplicated competition map seeded from standings (authoritative
  // source for competitionId) then supplemented by any fixture-only divisions.
  const competitionMap = new Map<string, { id: number; name: string }>();
  for (const table of rawStandings) {
    competitionMap.set(table.competitionName, {
      id:   table.competitionId,
      name: table.competitionName,
    });
  }
  for (const f of [...rawFixtures, ...rawResults]) {
    const cn = f.competition.competitionName;
    if (!competitionMap.has(cn)) {
      competitionMap.set(cn, { id: f.competition.competitionId, name: cn });
    }
  }

  // Apply the age-group safety gate.
  // U7–U11 (development): strip all point/standings rows; surface only upcoming
  // fixture dates so the front-end can display schedules without league tables.
  // U12 and above (competitive): pass the full standings matrix.
  const tables: LeagueTable[] = [];
  const developmentDivisions: DevelopmentDivision[] = [];

  for (const raw of rawStandings) {
    const ageGroup = parseAgeGroup(raw.competitionName);

    if (isDevelopmentTier(ageGroup)) {
      const upcomingDates = [
        ...new Set(
          [...fixtures, ...results]
            .filter(
              (m) =>
                m.competition === raw.competitionName &&
                (m.status === 'upcoming' || m.status === 'live'),
            )
            .map((m) => m.date),
        ),
      ].sort();

      developmentDivisions.push({
        competitionId:   raw.competitionId,
        competitionName: raw.competitionName,
        ageGroup,
        reason:          DEVELOPMENT_TIER_REASON,
        upcomingDates,
      });
    } else {
      tables.push(transformStandingsTable(raw, ageGroup));
    }
  }

  console.log(
    `[api/fixtures/sync] Age-gate complete — competitive tables: ${tables.length},` +
    ` development brackets: ${developmentDivisions.length},` +
    ` discovered divisions: ${competitionMap.size}`,
  );

  const divisions = buildDivisionList(competitionMap, fixtures, results);

  const now = Date.now();
  const body: SyncResponse = {
    source:          fetchFailed ? 'empty' : 'live',
    syncedAt:        new Date(now).toISOString(),
    cacheExpiresAt:  new Date(now + TTL_MS).toISOString(),
    divisions,
    fixtures,
    results,
    tables,
    developmentDivisions,
  };

  cacheSet(CACHE_KEY, body);

  return NextResponse.json(body, {
    headers: {
      'X-Cache':       'MISS',
      'X-Data-Source': 'live',
      'Cache-Control': 'no-store, max-age=0, must-revalidate',
    },
  });
}
