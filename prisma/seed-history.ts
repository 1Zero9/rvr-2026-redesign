#!/usr/bin/env tsx

import { Prisma, PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

interface HistoricalStandingSeedRow {
  position: number;
  teamName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

interface HistoricalDivisionSeed {
  divisionName: string;
  rows: HistoricalStandingSeedRow[];
}

interface HistoricalSeasonSeed {
  label: string;
  isActive: boolean;
  divisions: HistoricalDivisionSeed[];
}

const historicalSeasonSeed: HistoricalSeasonSeed = {
  label: "2025/26",
  isActive: false,
  divisions: [
    {
      divisionName: "DDSL U12 Boys Major Saturday",
      rows: [
        {
          position: 1,
          teamName: "Rivervalley Rangers AFC",
          played: 10,
          won: 8,
          drawn: 1,
          lost: 1,
          goalsFor: 27,
          goalsAgainst: 10,
          goalDifference: 17,
          points: 25,
        },
        {
          position: 2,
          teamName: "Blanchardstown AFC",
          played: 10,
          won: 7,
          drawn: 1,
          lost: 2,
          goalsFor: 24,
          goalsAgainst: 12,
          goalDifference: 12,
          points: 22,
        },
        {
          position: 3,
          teamName: "Coolmine Athletic FC",
          played: 10,
          won: 5,
          drawn: 2,
          lost: 3,
          goalsFor: 18,
          goalsAgainst: 16,
          goalDifference: 2,
          points: 17,
        },
        {
          position: 4,
          teamName: "Lucan United FC",
          played: 10,
          won: 2,
          drawn: 1,
          lost: 7,
          goalsFor: 9,
          goalsAgainst: 26,
          goalDifference: -17,
          points: 7,
        },
      ],
    },
  ],
};

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is required to seed historical standings.");
  }

  return new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
    log: ["error", "warn"],
  });
}

function validateRows(seed: HistoricalSeasonSeed): void {
  for (const division of seed.divisions) {
    const seenPositions = new Set<number>();

    for (const row of division.rows) {
      if (seenPositions.has(row.position)) {
        throw new Error(
          `Duplicate position ${row.position} in ${division.divisionName}.`,
        );
      }
      seenPositions.add(row.position);

      if (row.played !== row.won + row.drawn + row.lost) {
        throw new Error(
          `Played total does not match results for ${row.teamName} in ${division.divisionName}.`,
        );
      }

      if (row.goalDifference !== row.goalsFor - row.goalsAgainst) {
        throw new Error(
          `Goal difference does not match goals for ${row.teamName} in ${division.divisionName}.`,
        );
      }

      if (row.points !== row.won * 3 + row.drawn) {
        throw new Error(
          `Points total does not match results for ${row.teamName} in ${division.divisionName}.`,
        );
      }
    }
  }
}

function buildStandingRows(
  seasonId: string,
  seed: HistoricalSeasonSeed,
): Prisma.HistoricalStandingCreateManyInput[] {
  return seed.divisions.flatMap((division) =>
    division.rows.map((row) => ({
      seasonId,
      divisionName: division.divisionName,
      position: row.position,
      teamName: row.teamName,
      played: row.played,
      won: row.won,
      drawn: row.drawn,
      lost: row.lost,
      goalsFor: row.goalsFor,
      goalsAgainst: row.goalsAgainst,
      goalDifference: row.goalDifference,
      points: row.points,
    })),
  );
}

async function seedHistoricalStandings(): Promise<void> {
  validateRows(historicalSeasonSeed);

  const prisma = createPrismaClient();
  const divisionNames = historicalSeasonSeed.divisions.map(
    (division) => division.divisionName,
  );

  try {
    const insertedRows = await prisma.$transaction(async (tx) => {
      const season = await tx.season.upsert({
        where: { label: historicalSeasonSeed.label },
        update: { isActive: historicalSeasonSeed.isActive },
        create: {
          label: historicalSeasonSeed.label,
          isActive: historicalSeasonSeed.isActive,
        },
      });

      await tx.historicalStanding.deleteMany({
        where: {
          seasonId: season.id,
          divisionName: { in: divisionNames },
        },
      });

      const rows = buildStandingRows(season.id, historicalSeasonSeed);
      const result = await tx.historicalStanding.createMany({ data: rows });

      return result.count;
    });

    console.log(
      `Historical standings seed completed for ${historicalSeasonSeed.label}.`,
    );
    console.log(`Inserted ${insertedRows} historical standing rows.`);
  } finally {
    await prisma.$disconnect();
  }
}

seedHistoricalStandings().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown seed error.";
  console.error(`Historical standings seed failed: ${message}`);
  process.exit(1);
});
