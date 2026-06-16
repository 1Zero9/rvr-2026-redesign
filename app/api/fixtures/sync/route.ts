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
// Mock dataset — active when SportLoMo environment variables are absent
// ---------------------------------------------------------------------------

// Competition registry keeps IDs consistent across fixtures, results, and standings
const COMPS = {
  U10_BOYS_D1:    { competitionId: 3001, competitionName: 'DDSL U10 Boys Division 1'    },
  U8_BLITZ:       { competitionId: 3002, competitionName: 'DDSL U8 Mixed Blitz'          },
  U12_BOYS_D1:    { competitionId: 3003, competitionName: 'DDSL U12 Boys Major Saturday' },
  U12_GIRLS_D2:   { competitionId: 3004, competitionName: 'DDSL U12 Girls Division 2'    },
  U15_BOYS_D2:    { competitionId: 3005, competitionName: 'DDSL U15 Boys Division 2'     },
  SENIOR_MEN_D1:  { competitionId: 3006, competitionName: 'DDSL Senior Men Division 1'   },
} as const;

const RVR_TEAM = { teamId: 11, teamName: 'Rivervalley Rangers AFC', clubId: 11, clubName: 'Rivervalley Rangers AFC' };
const RVR_HOME_VENUE = { venueName: 'Ward Rivervalley All-Weather Pitch', venueAddress: 'Rivervalley, Swords, Co. Dublin' };

function away(teamId: number, teamName: string, clubId: number): SportLoMoFixture['awayTeam'] {
  return { teamId, teamName, clubId, clubName: teamName };
}

const MOCK_FIXTURES: SportLoMoFixture[] = [
  {
    fixtureId: 1001,
    fixtureDate: '2026-06-21',
    fixtureTime: '10:30',
    homeTeam: RVR_TEAM,
    awayTeam: away(103, 'St. Brendans FC', 12),
    venue: RVR_HOME_VENUE,
    competition: COMPS.U10_BOYS_D1,
    status: 'Fixture',
  },
  {
    fixtureId: 1002,
    fixtureDate: '2026-06-22',
    fixtureTime: '11:00',
    homeTeam: RVR_TEAM,
    awayTeam: away(201, 'Hartstown Huntstown FC', 20),
    venue: RVR_HOME_VENUE,
    competition: COMPS.U8_BLITZ,
    status: 'Fixture',
  },
  {
    fixtureId: 1003,
    fixtureDate: '2026-06-24',
    fixtureTime: '10:00',
    homeTeam: RVR_TEAM,
    awayTeam: away(301, 'Blanchardstown AFC', 30),
    venue: RVR_HOME_VENUE,
    competition: COMPS.U12_BOYS_D1,
    status: 'Fixture',
  },
  {
    fixtureId: 1004,
    fixtureDate: '2026-06-21',
    fixtureTime: '12:00',
    homeTeam: { teamId: 401, teamName: 'Clongriffin FC', clubId: 40, clubName: 'Clongriffin FC' },
    awayTeam: RVR_TEAM,
    venue: { venueName: 'Oscar Traynor Road', venueAddress: 'Oscar Traynor Road, Dublin 17' },
    competition: COMPS.U12_GIRLS_D2,
    status: 'Fixture',
  },
  {
    fixtureId: 1005,
    fixtureDate: '2026-06-28',
    fixtureTime: '10:00',
    homeTeam: RVR_TEAM,
    awayTeam: away(501, 'Swords Celtic FC', 50),
    venue: RVR_HOME_VENUE,
    competition: COMPS.U15_BOYS_D2,
    status: 'Fixture',
  },
  {
    fixtureId: 1006,
    fixtureDate: '2026-06-25',
    fixtureTime: '19:30',
    homeTeam: { teamId: 601, teamName: 'Blanchardstown AFC', clubId: 60, clubName: 'Blanchardstown AFC' },
    awayTeam: RVR_TEAM,
    venue: { venueName: 'Blanchardstown Sports Ground', venueAddress: 'Blanchardstown, Dublin 15' },
    competition: COMPS.SENIOR_MEN_D1,
    status: 'Fixture',
  },
];

const MOCK_RESULTS: SportLoMoFixture[] = [
  {
    fixtureId: 2001,
    fixtureDate: '2026-06-19',
    fixtureTime: '18:30',
    homeTeam: RVR_TEAM,
    awayTeam: away(104, 'Lucan United FC', 13),
    venue: RVR_HOME_VENUE,
    competition: COMPS.U10_BOYS_D1,
    status: 'Result',
    score: { home: 8, away: 1 }, // mercy rule reduces to 6–1 on output
  },
  {
    fixtureId: 2003,
    fixtureDate: '2026-06-20',
    fixtureTime: '20:00',
    homeTeam: RVR_TEAM,
    awayTeam: away(602, 'Blanchardstown AFC', 60),
    venue: RVR_HOME_VENUE,
    competition: COMPS.SENIOR_MEN_D1,
    status: 'Result',
    score: { home: 4, away: 0 },
  },
];

const MOCK_STANDINGS: SportLoMoStandingsTable[] = [
  // ── Development tiers (U7–U11) — standings rows will be stripped ──────
  {
    ...COMPS.U10_BOYS_D1,
    season: '2025-2026',
    standings: [
      { position: 1, team: { teamId: 101, teamName: 'Hartstown Huntstown FC', clubId: 10 }, played: 9, won: 7, drawn: 0, lost: 2, goalsFor: 30, goalsAgainst: 9,  goalDifference: 21, points: 21 },
      { position: 2, team: { teamId: 11,  teamName: 'Rivervalley Rangers AFC', clubId: 11 }, played: 9, won: 6, drawn: 1, lost: 2, goalsFor: 24, goalsAgainst: 11, goalDifference: 13, points: 19 },
      { position: 3, team: { teamId: 103, teamName: 'St. Brendans FC',         clubId: 12 }, played: 9, won: 4, drawn: 2, lost: 3, goalsFor: 16, goalsAgainst: 13, goalDifference:  3, points: 14 },
      { position: 4, team: { teamId: 104, teamName: 'Lucan United FC',         clubId: 13 }, played: 9, won: 1, drawn: 1, lost: 7, goalsFor:  6, goalsAgainst: 29, goalDifference: -23, points:  4 },
    ],
  },
  {
    ...COMPS.U8_BLITZ,
    season: '2025-2026',
    standings: [
      { position: 1, team: { teamId: 11,  teamName: 'Rivervalley Rangers AFC', clubId: 11 }, played: 4, won: 3, drawn: 0, lost: 1, goalsFor: 14, goalsAgainst: 5, goalDifference:  9, points: 9 },
      { position: 2, team: { teamId: 201, teamName: 'Hartstown Huntstown FC',  clubId: 20 }, played: 4, won: 2, drawn: 1, lost: 1, goalsFor: 10, goalsAgainst: 7, goalDifference:  3, points: 7 },
      { position: 3, team: { teamId: 202, teamName: 'Swords Celtic FC',        clubId: 21 }, played: 4, won: 1, drawn: 0, lost: 3, goalsFor:  5, goalsAgainst: 12, goalDifference: -7, points: 3 },
    ],
  },

  // ── Competitive tiers (U12+) — full standings transmitted ─────────────
  {
    ...COMPS.U12_BOYS_D1,
    season: '2025-2026',
    standings: [
      { position: 1, team: { teamId: 11,  teamName: 'Rivervalley Rangers AFC', clubId: 11 }, played: 10, won: 8, drawn: 1, lost: 1, goalsFor: 27, goalsAgainst: 10, goalDifference: 17, points: 25 },
      { position: 2, team: { teamId: 301, teamName: 'Blanchardstown AFC',      clubId: 30 }, played: 10, won: 7, drawn: 1, lost: 2, goalsFor: 24, goalsAgainst: 12, goalDifference: 12, points: 22 },
      { position: 3, team: { teamId: 303, teamName: 'Lucan United FC',         clubId: 32 }, played: 10, won: 2, drawn: 1, lost: 7, goalsFor:  9, goalsAgainst: 26, goalDifference: -17, points:  7 },
    ],
  },
  {
    ...COMPS.U12_GIRLS_D2,
    season: '2025-2026',
    standings: [
      { position: 1, team: { teamId: 401, teamName: 'Clongriffin FC',          clubId: 40 }, played: 8, won: 6, drawn: 1, lost: 1, goalsFor: 22, goalsAgainst:  8, goalDifference: 14, points: 19 },
      { position: 2, team: { teamId: 11,  teamName: 'Rivervalley Rangers AFC',  clubId: 11 }, played: 8, won: 5, drawn: 2, lost: 1, goalsFor: 18, goalsAgainst:  9, goalDifference:  9, points: 17 },
      { position: 3, team: { teamId: 402, teamName: 'Swords Celtic FC',         clubId: 41 }, played: 8, won: 3, drawn: 0, lost: 5, goalsFor: 11, goalsAgainst: 18, goalDifference: -7, points:  9 },
    ],
  },
  {
    ...COMPS.U15_BOYS_D2,
    season: '2025-2026',
    standings: [
      { position: 1, team: { teamId: 11,  teamName: 'Rivervalley Rangers AFC', clubId: 11 }, played: 11, won: 9, drawn: 1, lost: 1, goalsFor: 33, goalsAgainst: 11, goalDifference: 22, points: 28 },
      { position: 2, team: { teamId: 501, teamName: 'Swords Celtic FC',         clubId: 50 }, played: 11, won: 7, drawn: 2, lost: 2, goalsFor: 26, goalsAgainst: 13, goalDifference: 13, points: 23 },
      { position: 3, team: { teamId: 502, teamName: 'Lucan United FC',          clubId: 51 }, played: 11, won: 5, drawn: 1, lost: 5, goalsFor: 19, goalsAgainst: 19, goalDifference:  0, points: 16 },
    ],
  },
  {
    ...COMPS.SENIOR_MEN_D1,
    season: '2025-2026',
    standings: [
      { position: 1, team: { teamId: 601, teamName: 'Blanchardstown AFC',      clubId: 60 }, played: 12, won: 10, drawn: 1, lost: 1, goalsFor: 38, goalsAgainst: 12, goalDifference: 26, points: 31 },
      { position: 2, team: { teamId: 11,  teamName: 'Rivervalley Rangers AFC', clubId: 11 }, played: 12, won:  9, drawn: 2, lost: 1, goalsFor: 33, goalsAgainst: 14, goalDifference: 19, points: 29 },
      { position: 3, team: { teamId: 602, teamName: 'Clongriffin FC',          clubId: 61 }, played: 12, won:  6, drawn: 2, lost: 4, goalsFor: 22, goalsAgainst: 20, goalDifference:  2, points: 20 },
    ],
  },
];

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function GET(_req: NextRequest): Promise<NextResponse<SyncResponse>> {
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

  let source: 'live' | 'mock';
  let rawFixtures: SportLoMoFixture[];
  let rawResults:  SportLoMoFixture[];
  let rawStandings: SportLoMoStandingsTable[];

  try {
    // Fetch all pages in parallel — covers all 29 active RVR squads across
    // every division without being truncated by a single-page size cap.
    [rawFixtures, rawResults, rawStandings] = await Promise.all([
      fetchAllFixtures(),
      fetchAllResults(),
      fetchAllStandings(),
    ]);
    source = 'live';
  } catch (err) {
    if (err instanceof SportLoMoConfigError) {
      console.info('[api/fixtures/sync] SportLoMo not configured — using mock data');
    } else if (err instanceof SportLoMoApiError) {
      console.error(
        `[api/fixtures/sync] SportLoMo API error ${err.status}:`,
        err.message,
      );
    } else {
      console.error('[api/fixtures/sync] Fetch failed:', err);
    }
    rawFixtures  = MOCK_FIXTURES;
    rawResults   = MOCK_RESULTS;
    rawStandings = MOCK_STANDINGS;
    source = 'mock';
  }

  // Transform raw fixtures and results through the shared pipeline.
  // transformAll applies mercy-rule score capping and venue resolution.
  const fixtures = transformAll(rawFixtures);
  const results  = transformAll(rawResults);

  // Strip any standings rows that are not in the registered member list for
  // their competition. This catches data contamination caused by incorrect
  // competition IDs in the SportLoMo feed (e.g. Coolmine Athletic appearing
  // in the U12 Major Saturday table due to a mismatched ID at source).
  rawStandings = applyDivisionFilter(rawStandings);

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

  const divisions = buildDivisionList(competitionMap, fixtures, results);

  const now = Date.now();
  const body: SyncResponse = {
    source,
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
      'X-Data-Source': source,
      'Cache-Control': 'no-store, max-age=0, must-revalidate',
    },
  });
}
