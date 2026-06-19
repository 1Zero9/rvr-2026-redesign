/**
 * POST /api/cron/ddsl-sync
 *
 * Invoked daily by Vercel Cron (see vercel.json — 07:00 UTC).
 *
 * What this does:
 *   1. Runs the same AJAX discovery as /api/fixtures/sync to find all current
 *      RVR league IDs from the DDSL club profile.
 *   2. Compares discovered IDs against the KNOWN_DIVISIONS registry and reports:
 *        - newDiscoveries: IDs in AJAX but not in the registry (new teams / new season IDs)
 *        - staleRegistrations: registered competitive divisions whose scrape failed
 *          (wrong ID, disbanded team, or DDSL temporarily unavailable)
 *   3. Scrapes standings for every competitive league — both registered and newly
 *      discovered — so new teams appear immediately without a config change.
 *   4. Persists all successful scrapes to HistoricalStanding in Postgres.
 *   5. Invalidates the in-process fixture cache.
 *
 * Auth: Vercel Cron sends `Authorization: Bearer $CRON_SECRET`.
 */

import { NextRequest, NextResponse } from 'next/server';
import { CRON_SECRET } from '@/lib/safeguarding/constants';
import { KNOWN_DIVISIONS } from '@/config/ddsl-competitions';
import { scrapeAllAflStandings } from '@/lib/afl/scraper';
import { AFL_DIVISIONS } from '@/config/afl-competitions';
import { prisma } from '@/lib/prisma';
import {
  RVR_CLUB_ID,
  FALLBACK_AJAX_COMPETITION_ID,
  discoverCompetitionId,
  scrapeClubAjax,
  scrapeDDSLStandings,
  ddslShortToCanonical,
} from '@/lib/ddsl/scraper';
import { transformStandingsTable } from '@/lib/ddsl/transform';
import { applyDivisionFilter } from '@/lib/ddsl/division-filter';
import { parseAgeGroup } from '@/lib/ddsl/mercy-rule';
import { cacheInvalidate } from '@/lib/ddsl/cache';
import { persistStandings } from '@/lib/ddsl/persist';
import { CLUB_SEASON } from '@/config/club-season';
import type { LeagueTable, SportLoMoStandingsTable } from '@/lib/ddsl/types';

export const dynamic     = 'force-dynamic';
export const maxDuration = 60;

const DEVELOPMENT_GROUPS = new Set(['U7', 'U8', 'U9', 'U10', 'U11']);
const CURRENT_SEASON     = CLUB_SEASON.currentSeason;
const SYNC_CACHE_KEY     = 'ddsl:sync';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface LeagueEntry {
  id:   number;
  name: string;
  url:  string;
}

interface AnomalyReport {
  /** IDs returned by AJAX that are not in KNOWN_DIVISIONS — new teams or new-season IDs */
  newDiscoveries: LeagueEntry[];
  /** Registered competitive divisions where the standings scrape returned nothing */
  staleRegistrations: LeagueEntry[];
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest): Promise<NextResponse> {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!CRON_SECRET || token !== CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  const started = Date.now();
  const errors: string[] = [];

  // ── Step 1: AJAX discovery ────────────────────────────────────────────────
  // Same discovery path as /api/fixtures/sync: read the season umbrella ID
  // from the club profile, then pull all RVR league IDs from the fixtures and
  // results feeds. This surfaces any new teams DDSL has registered this season.
  const competitionId =
    (await discoverCompetitionId(RVR_CLUB_ID)) ?? FALLBACK_AJAX_COMPETITION_ID;

  const [fixturesData, resultsData] = await Promise.all([
    scrapeClubAjax(RVR_CLUB_ID, competitionId, 'fixtures'),
    scrapeClubAjax(RVR_CLUB_ID, competitionId, 'results'),
  ]);

  const discoveredIds = new Set([...fixturesData.leagueIds, ...resultsData.leagueIds]);
  const leagueNames   = new Map([...fixturesData.leagueNames, ...resultsData.leagueNames]);

  // ── Step 2: Build the full work set ──────────────────────────────────────
  // Union of AJAX discoveries + every registered ID so we always attempt to
  // scrape known divisions even when they have no upcoming fixtures (e.g., at
  // the end of a season when all matches have been played).
  const registeredIds = new Set(KNOWN_DIVISIONS.map((d) => d.sportlomoId));
  const allLeagueIds  = new Set([...discoveredIds, ...registeredIds]);

  // ── Step 3: Anomaly detection ─────────────────────────────────────────────
  const anomalies: AnomalyReport = {
    newDiscoveries:     [],
    staleRegistrations: [],
  };

  for (const id of discoveredIds) {
    if (!registeredIds.has(id)) {
      const shortName = leagueNames.get(id) ?? '';
      anomalies.newDiscoveries.push({
        id,
        name: ddslShortToCanonical(shortName) || shortName,
        url:  `https://ddsl.ie/league/${id}/`,
      });
    }
  }

  // ── Step 4: Scrape standings for every competitive league ─────────────────
  // For registered divisions: use the canonical name and configured leagueUrl.
  // For newly discovered divisions: derive name from the AJAX short name and
  // use the standard ddsl.ie URL pattern.
  const knownMap = new Map(KNOWN_DIVISIONS.map((d) => [d.sportlomoId, d]));

  const rawList = await Promise.all(
    [...allLeagueIds].map(async (id): Promise<SportLoMoStandingsTable | null> => {
      const known = knownMap.get(id);

      // Skip development tiers from the registered set — they have no standings.
      if (known && DEVELOPMENT_GROUPS.has(known.ageGroup)) return null;

      const compName =
        known?.competitionName ??
        (ddslShortToCanonical(leagueNames.get(id) ?? '') || `League ${id}`);

      const leagueUrl = known?.leagueUrl ?? `https://ddsl.ie/league/${id}/`;

      const live = await scrapeDDSLStandings(id, compName, CURRENT_SEASON, leagueUrl);

      // Flag registered competitive divisions whose scrape returned nothing.
      // This can mean: DDSL rotated the ID, team disbanded, or site temporarily down.
      if (!live && known && !DEVELOPMENT_GROUPS.has(known.ageGroup)) {
        anomalies.staleRegistrations.push({
          id,
          name: known.competitionName,
          url:  leagueUrl,
        });
      }

      return live;
    }),
  );

  const rawStandings = applyDivisionFilter(
    rawList.filter((s): s is SportLoMoStandingsTable => s !== null),
  );

  // ── Step 5: Transform ─────────────────────────────────────────────────────
  const tables: LeagueTable[] = [];
  for (const raw of rawStandings) {
    const ageGroup = parseAgeGroup(raw.competitionName);
    if (DEVELOPMENT_GROUPS.has(ageGroup)) continue;
    tables.push(transformStandingsTable(raw, ageGroup));
  }

  // ── Step 6: Persist to Postgres ───────────────────────────────────────────
  let persistResult: Awaited<ReturnType<typeof persistStandings>> | null = null;
  try {
    persistResult = await persistStandings(CURRENT_SEASON, tables);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    errors.push(`DB persist: ${msg}`);
    console.error('[cron/ddsl-sync] persist error:', err);
  }

  // ── Step 6b: Scrape and persist AFL standings ─────────────────────────────
  let aflDivisionsUpdated = 0;
  const activeSeasonId = persistResult?.seasonId;

  if (activeSeasonId) {
    try {
      const aflTables = await scrapeAllAflStandings(AFL_DIVISIONS, CURRENT_SEASON);

      if (aflTables.length === 0) {
        console.warn('[cron/ddsl-sync] AFL scrape returned no divisions — skipping AFL persist');
      }

      for (const table of aflTables) {
        await prisma.$transaction([
          prisma.historicalStanding.deleteMany({
            where: {
              seasonId:    activeSeasonId,
              divisionName: table.division.competitionName,
              source:      'AFL',
            },
          }),
          prisma.historicalStanding.createMany({
            data: table.standings.map((row) => ({
              seasonId:       activeSeasonId,
              source:         'AFL',
              divisionName:   table.division.competitionName,
              position:       row.position,
              teamName:       row.teamName,
              played:         row.played,
              won:            row.won,
              drawn:          row.drawn,
              lost:           row.lost,
              goalsFor:       0,
              goalsAgainst:   0,
              goalDifference: 0,
              points:         row.points,
            })),
          }),
        ]);
        aflDivisionsUpdated++;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`AFL persist: ${msg}`);
      console.error('[cron/ddsl-sync] AFL persist error:', err);
    }
  } else {
    console.warn('[cron/ddsl-sync] No active season ID available — skipping AFL persist');
  }

  // ── Step 7: Bust the in-process cache ────────────────────────────────────
  cacheInvalidate(SYNC_CACHE_KEY);

  const elapsed = Date.now() - started;

  if (anomalies.newDiscoveries.length > 0) {
    console.warn(
      `[cron/ddsl-sync] NEW LEAGUES DISCOVERED — add these to KNOWN_DIVISIONS:`,
      anomalies.newDiscoveries,
    );
  }
  if (anomalies.staleRegistrations.length > 0) {
    console.warn(
      `[cron/ddsl-sync] STALE REGISTRATIONS — these IDs returned no data (check for new season IDs):`,
      anomalies.staleRegistrations,
    );
  }

  console.log(
    `[cron/ddsl-sync] complete — scraped: ${rawStandings.length}, tables: ${tables.length},` +
    ` rows written: ${persistResult?.rowsWritten ?? 0}, afl divisions: ${aflDivisionsUpdated}, elapsed: ${elapsed}ms`,
  );

  return NextResponse.json({
    ok:                   errors.length === 0,
    season:               CURRENT_SEASON,
    elapsed,
    discovered:           discoveredIds.size,
    tablesScraped:        rawStandings.length,
    tablesWritten:        persistResult?.tablesWritten ?? 0,
    rowsWritten:          persistResult?.rowsWritten   ?? 0,
    aflDivisionsUpdated,
    anomalies,
    errors: process.env.NODE_ENV === 'development'
      ? errors
      : errors.length > 0 ? [`${errors.length} error(s) — check server logs`] : [],
  });
}
