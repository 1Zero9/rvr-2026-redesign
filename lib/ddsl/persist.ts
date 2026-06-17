import { prisma } from '@/lib/prisma';
import type { LeagueTable } from './types';

export interface PersistResult {
  seasonId:      string;
  seasonLabel:   string;
  tablesWritten: number;
  rowsWritten:   number;
}

/**
 * Upserts the full set of competitive league tables for one season into
 * the HistoricalStanding table.
 *
 * Each call for a given (seasonLabel, divisionName) pair is idempotent:
 * existing rows for that division are deleted and replaced with the freshly
 * scraped data. This keeps the DB in sync with DDSL throughout the season
 * without accumulating stale rows.
 *
 * The Season row is created on first call and never deactivated here —
 * use setActiveSeason() from lib/db/active-season.ts for that.
 */
export async function persistStandings(
  seasonLabel: string,
  tables: LeagueTable[],
): Promise<PersistResult> {
  const season = await prisma.season.upsert({
    where:  { label: seasonLabel },
    create: { label: seasonLabel, isActive: true },
    update: {},
  });

  let tablesWritten = 0;
  let rowsWritten   = 0;

  for (const table of tables) {
    if (table.rows.length === 0) continue;

    await prisma.$transaction([
      prisma.historicalStanding.deleteMany({
        where: { seasonId: season.id, divisionName: table.competitionName },
      }),
      prisma.historicalStanding.createMany({
        data: table.rows.map((row) => ({
          seasonId:       season.id,
          divisionName:   table.competitionName,
          position:       row.position,
          teamName:       row.teamName,
          played:         row.played,
          won:            row.won,
          drawn:          row.drawn,
          lost:           row.lost,
          goalsFor:       row.goalsFor,
          goalsAgainst:   row.goalsAgainst,
          goalDifference: row.goalDifference,
          points:         row.points,
        })),
      }),
    ]);

    tablesWritten++;
    rowsWritten += table.rows.length;
  }

  return { seasonId: season.id, seasonLabel, tablesWritten, rowsWritten };
}
