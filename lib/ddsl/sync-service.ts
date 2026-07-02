import { cacheGet, cacheSet, TTL_MS } from '@/lib/ddsl/cache';
import { LOCAL_SEED } from '@/lib/ddsl/local-seed';
import { applyDivisionFilter } from '@/lib/ddsl/division-filter';
import { findKnownDivision, KNOWN_DIVISIONS } from '@/config/ddsl-competitions';
import { parseAgeGroup } from '@/lib/ddsl/mercy-rule';
import {
  RVR_CLUB_ID,
  FALLBACK_AJAX_COMPETITION_ID,
  discoverCompetitionId,
  scrapeClubAjax,
  scrapeDDSLStandings,
} from '@/lib/ddsl/scraper';
import { transformAll, transformStandingsTable } from '@/lib/ddsl/transform';
import { CLUB_SEASON } from '@/config/club-season';
import type {
  AgeGroup,
  DiscoveredDivision,
  DevelopmentDivision,
  LeagueTable,
  NormalisedMatch,
  SportLoMoStandingsTable,
  SyncResponse,
} from '@/lib/ddsl/types';

const CACHE_KEY = 'ddsl:sync';
const CURRENT_SEASON = CLUB_SEASON.currentSeason;

// ---------------------------------------------------------------------------
// Age-tier gate
// ---------------------------------------------------------------------------

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
// Division list builder
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
// Shared server-side data service
// ---------------------------------------------------------------------------

export async function getFixtureSyncData(): Promise<SyncResponse> {
  const cached = cacheGet<SyncResponse>(CACHE_KEY);
  if (cached.hit) {
    return cached.data;
  }

  // ── Step 1: Discover the current season's AJAX competition ID ──────────────
  // The club profile page embeds this in its wp-admin/admin-ajax.php URLs.
  // Falls back to the hardcoded 2025/26 value if the scrape fails.
  const competitionId =
    (await discoverCompetitionId(RVR_CLUB_ID)) ?? FALLBACK_AJAX_COMPETITION_ID;
  console.log(`[api/fixtures/sync] Season competition_id: ${competitionId}`);

  // ── Step 2: Fetch all RVR fixtures and results in parallel ────────────────
  // One AJAX call per action returns data for ALL of RVR's teams this season.
  // Each league section header is an <a href="/league/{id}"> — those IDs drive
  // the standings scrapes below without any manual competition ID config.
  const [fixturesData, resultsData] = await Promise.all([
    scrapeClubAjax(RVR_CLUB_ID, competitionId, 'fixtures'),
    scrapeClubAjax(RVR_CLUB_ID, competitionId, 'results'),
  ]);

  // ── Step 3: Build the union of discovered league IDs ─────────────────────
  // Include seed IDs so that known divisions always get standings even if they
  // have no current fixtures or results in the AJAX window.
  const discoveredIds  = new Set([...fixturesData.leagueIds, ...resultsData.leagueIds]);
  const seedIds        = new Set(LOCAL_SEED.standings.map((s) => s.competitionId));
  const registeredIds  = new Set(KNOWN_DIVISIONS.map((d) => d.sportlomoId));
  // Union all sources so every registered RVR division is always scraped,
  // regardless of whether it has upcoming fixtures in the current AJAX window.
  const allLeagueIds   = new Set([...discoveredIds, ...seedIds, ...registeredIds]);

  // Build a name map from both AJAX responses (discovered) and KNOWN_DIVISIONS
  // (registered). Registered names take precedence.
  const leagueNames = new Map([
    ...fixturesData.leagueNames,
    ...resultsData.leagueNames,
  ]);

  // ── Step 4: Resolve raw fixtures and results ──────────────────────────────
  // Use live AJAX data when successfully parsed; fall back to seed otherwise.
  const rawFixturesSrc = fixturesData.fixtures.length > 0
    ? fixturesData.fixtures
    : LOCAL_SEED.fixtures;
  const rawResultsSrc = resultsData.fixtures.length > 0
    ? resultsData.fixtures
    : LOCAL_SEED.results;

  // ── Step 5: Scrape standings for every league in parallel ─────────────────
  const standingsList = await Promise.all(
    [...allLeagueIds].map(async (leagueId): Promise<SportLoMoStandingsTable | null> => {
      const knownDiv = findKnownDivision(leagueId);

      // Canonical name: registered name > AJAX-discovered name > generic fallback
      const compName =
        knownDiv?.competitionName ??
        leagueNames.get(leagueId) ??
        `League ${leagueId}`;

      const leagueUrl =
        knownDiv?.leagueUrl ?? `https://ddsl.ie/league/${leagueId}/`;

      const fallback = LOCAL_SEED.standings.find((s) => s.competitionId === leagueId) ?? null;
      if (isDevelopmentTier(parseAgeGroup(compName)) || leagueId <= 0) {
        return fallback;
      }

      const live = await scrapeDDSLStandings(leagueId, compName, CURRENT_SEASON, leagueUrl);

      // Fall back to the local seed row for this league if the live scrape fails.
      return live ?? fallback;
    }),
  );

  const rawStandingsPre = standingsList.filter(
    (s): s is SportLoMoStandingsTable => s !== null,
  );

  console.log(
    `[api/fixtures/sync] Raw data — fixtures: ${rawFixturesSrc.length},` +
    ` results: ${rawResultsSrc.length}, standings tables: ${rawStandingsPre.length}`,
  );

  // ── Step 6: Transform fixtures and results through the shared pipeline ────
  const fixtures = transformAll(rawFixturesSrc);
  const results  = transformAll(rawResultsSrc);

  // ── Step 7: Division integrity filter (strips unregistered teams) ─────────
  const rawStandings = applyDivisionFilter(rawStandingsPre);
  console.log(
    `[api/fixtures/sync] Division integrity filter — tables in: ${rawStandingsPre.length},` +
    ` out: ${rawStandings.length}`,
  );

  // ── Step 8: Build competition map ─────────────────────────────────────────
  // Seeded from standings (authoritative competitionId source) then
  // supplemented by fixture-only divisions.
  const competitionMap = new Map<string, { id: number; name: string }>();
  for (const table of rawStandings) {
    competitionMap.set(table.competitionName, {
      id:   table.competitionId,
      name: table.competitionName,
    });
  }
  for (const f of [...rawFixturesSrc, ...rawResultsSrc]) {
    const cn = f.competition.competitionName;
    if (!competitionMap.has(cn)) {
      competitionMap.set(cn, { id: f.competition.competitionId, name: cn });
    }
  }

  // ── Step 9: Age-group safety gate ────────────────────────────────────────
  // U7–U11 (development): no standings published. Upcoming dates surfaced only.
  // U12+  (competitive):  full standings matrix passed through.
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

  const divisions = buildDivisionList(competitionMap, fixtures, results);

  console.log(
    `[api/fixtures/sync] Complete — competitive tables: ${tables.length},` +
    ` development brackets: ${developmentDivisions.length},` +
    ` discovered divisions: ${competitionMap.size}`,
  );

  const now  = Date.now();
  const body: SyncResponse = {
    source:         discoveredIds.size > 0 ? 'live' : 'fallback',
    syncedAt:       new Date(now).toISOString(),
    cacheExpiresAt: new Date(now + TTL_MS).toISOString(),
    divisions,
    fixtures,
    results,
    tables,
    developmentDivisions,
  };

  cacheSet(CACHE_KEY, body);

  return body;
}
