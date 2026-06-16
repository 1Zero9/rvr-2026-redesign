import { NextRequest, NextResponse } from 'next/server';
import { cacheGet, cacheSet, TTL_MS } from '@/lib/ddsl/cache';
import { LOCAL_SEED } from '@/lib/ddsl/local-seed';
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

  // Season complete — serve verified local asset data.
  // SportLoMo outbound fetching permanently decommissioned.
  const rawFixtures:  SportLoMoFixture[]        = [...LOCAL_SEED.fixtures];
  const rawResults:   SportLoMoFixture[]        = [...LOCAL_SEED.results];
  let   rawStandings: SportLoMoStandingsTable[] = [...LOCAL_SEED.standings];
  console.log(
    `[api/fixtures/sync] Local asset loaded — fixtures: ${rawFixtures.length},` +
    ` results: ${rawResults.length}, standings: ${rawStandings.length}`,
  );

  // Transform raw fixtures and results through the shared pipeline.
  // transformAll applies mercy-rule score capping and venue resolution.
  const fixtures = transformAll(rawFixtures);
  const results  = transformAll(rawResults);

  // Strip any standings rows that are not in the registered member list for
  // their competition.
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
      const table = transformStandingsTable(raw, ageGroup);
      console.log(
        `[api/fixtures/sync] Table "${raw.competitionName}" — rows: ${table.rows.length},` +
        ` RVR row present: ${table.rows.some((r) => r.isRvr)}`,
      );
      tables.push(table);
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
    source:         'live',
    syncedAt:       new Date(now).toISOString(),
    cacheExpiresAt: new Date(now + TTL_MS).toISOString(),
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
      'X-Data-Source': 'local-seed',
      'Cache-Control': 'no-store, max-age=0, must-revalidate',
    },
  });
}
