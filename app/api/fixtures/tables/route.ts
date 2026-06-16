import { NextRequest, NextResponse } from "next/server";
import {
  fetchStandings,
  SportLoMoConfigError,
  SportLoMoApiError,
} from "@/lib/ddsl/client";
import { cacheGet, cacheSet, TTL_MS } from "@/lib/ddsl/cache";
import { parseAgeGroup } from "@/lib/ddsl/mercy-rule";
import type {
  AgeGroup,
  BlockedDivision,
  LeagueTable,
  SportLoMoStandingsTable,
  TablesResponse,
} from "@/lib/ddsl/types";

export const dynamic = "force-dynamic";

const CACHE_KEY = "ddsl:standings";

// ---------------------------------------------------------------------------
// Age-tier enforcement
// ---------------------------------------------------------------------------

// DDSL and FAI policy prohibits the publication of league tables for
// non-competitive development age groups. Standings data for these tiers
// must not be returned to clients regardless of what the API supplies.
const DEVELOPMENT_AGE_GROUPS = new Set<AgeGroup>([
  "U7", "U8", "U9", "U10", "U11",
]);

function isCompetitiveTier(ageGroup: AgeGroup): boolean {
  return !DEVELOPMENT_AGE_GROUPS.has(ageGroup);
}

// ---------------------------------------------------------------------------
// RVR team name matching
// ---------------------------------------------------------------------------

// Matches "Rivervalley Rangers" (with or without "AFC") and the standalone
// acronym "RVR". The word-boundary assertions prevent false matches against
// other team names that happen to contain those characters.
const RVR_NAME_PATTERN = /rivervalley\s+rangers|(?<![a-z])rvr(?![a-z])/i;

function isRvrTeam(teamName: string): boolean {
  return RVR_NAME_PATTERN.test(teamName);
}

function tableContainsRvr(table: SportLoMoStandingsTable): boolean {
  return table.standings.some((row) => isRvrTeam(row.team.teamName));
}

// ---------------------------------------------------------------------------
// Transform
// ---------------------------------------------------------------------------

function transformTable(raw: SportLoMoStandingsTable, ageGroup: AgeGroup): LeagueTable {
  return {
    competitionId: raw.competitionId,
    competitionName: raw.competitionName,
    ageGroup,
    season: raw.season,
    rows: raw.standings.map((row) => ({
      position: row.position,
      teamName: row.team.teamName,
      played: row.played,
      won: row.won,
      drawn: row.drawn,
      lost: row.lost,
      goalsFor: row.goalsFor,
      goalsAgainst: row.goalsAgainst,
      goalDifference: row.goalDifference,
      points: row.points,
      isRvr: isRvrTeam(row.team.teamName),
    })),
  };
}

// ---------------------------------------------------------------------------
// Mock dataset — active when SportLoMo environment variables are absent
// ---------------------------------------------------------------------------

const MOCK_STANDINGS: SportLoMoStandingsTable[] = [
  {
    competitionId: 3001,
    competitionName: "DDSL U10 Boys Division 1",
    season: "2025-2026",
    standings: [
      {
        position: 1,
        team: { teamId: 101, teamName: "Hartstown Huntstown FC", clubId: 10 },
        played: 8, won: 7, drawn: 0, lost: 1,
        goalsFor: 28, goalsAgainst: 6, goalDifference: 22, points: 21,
      },
      {
        position: 2,
        team: { teamId: 102, teamName: "Rivervalley Rangers AFC", clubId: 11 },
        played: 8, won: 6, drawn: 1, lost: 1,
        goalsFor: 22, goalsAgainst: 9, goalDifference: 13, points: 19,
      },
      {
        position: 3,
        team: { teamId: 103, teamName: "St. Brendans FC", clubId: 12 },
        played: 8, won: 4, drawn: 2, lost: 2,
        goalsFor: 15, goalsAgainst: 12, goalDifference: 3, points: 14,
      },
    ],
  },
  {
    competitionId: 3002,
    competitionName: "DDSL U15 Boys Division 2",
    season: "2025-2026",
    standings: [
      {
        position: 1,
        team: { teamId: 201, teamName: "Rivervalley Rangers AFC", clubId: 11 },
        played: 10, won: 8, drawn: 1, lost: 1,
        goalsFor: 31, goalsAgainst: 10, goalDifference: 21, points: 25,
      },
      {
        position: 2,
        team: { teamId: 202, teamName: "Swords Celtic FC", clubId: 20 },
        played: 10, won: 7, drawn: 2, lost: 1,
        goalsFor: 24, goalsAgainst: 11, goalDifference: 13, points: 23,
      },
      {
        position: 3,
        team: { teamId: 203, teamName: "Lucan United FC", clubId: 21 },
        played: 10, won: 5, drawn: 1, lost: 4,
        goalsFor: 18, goalsAgainst: 17, goalDifference: 1, points: 16,
      },
      {
        position: 4,
        team: { teamId: 204, teamName: "Coolmine Athletic FC", clubId: 22 },
        played: 10, won: 3, drawn: 2, lost: 5,
        goalsFor: 14, goalsAgainst: 22, goalDifference: -8, points: 11,
      },
    ],
  },
  {
    competitionId: 3003,
    competitionName: "DDSL Senior Men Division 1",
    season: "2025-2026",
    standings: [
      {
        position: 1,
        team: { teamId: 301, teamName: "Blanchardstown AFC", clubId: 30 },
        played: 12, won: 10, drawn: 1, lost: 1,
        goalsFor: 38, goalsAgainst: 12, goalDifference: 26, points: 31,
      },
      {
        position: 2,
        team: { teamId: 302, teamName: "Rivervalley Rangers AFC", clubId: 11 },
        played: 12, won: 9, drawn: 2, lost: 1,
        goalsFor: 33, goalsAgainst: 14, goalDifference: 19, points: 29,
      },
      {
        position: 3,
        team: { teamId: 303, teamName: "Clongriffin FC", clubId: 31 },
        played: 12, won: 6, drawn: 2, lost: 4,
        goalsFor: 22, goalsAgainst: 20, goalDifference: 2, points: 20,
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function GET(_req: NextRequest): Promise<NextResponse<TablesResponse>> {
  const cached = cacheGet<TablesResponse>(CACHE_KEY);
  if (cached.hit) {
    return NextResponse.json(cached.data, {
      headers: {
        "X-Cache": "HIT",
        "X-Cache-Expires": cached.expiresAt.toString(),
      },
    });
  }

  let source: "live" | "mock";
  let rawTables: SportLoMoStandingsTable[];

  try {
    const envelope = await fetchStandings();
    rawTables = envelope.data;
    source = "live";
  } catch (err) {
    if (err instanceof SportLoMoConfigError) {
      console.info("[api/fixtures/tables] SportLoMo not configured, using mock data");
    } else if (err instanceof SportLoMoApiError) {
      console.error(
        `[api/fixtures/tables] SportLoMo API error ${err.status}:`,
        err.message,
      );
    } else {
      console.error("[api/fixtures/tables] Standings fetch failed:", err);
    }
    rawTables = MOCK_STANDINGS;
    source = "mock";
  }

  // Isolate divisions where an RVR team is registered
  const rvrTables = rawTables.filter(tableContainsRvr);

  const tables: LeagueTable[] = [];
  const blockedDivisions: BlockedDivision[] = [];

  for (const raw of rvrTables) {
    const ageGroup = parseAgeGroup(raw.competitionName);

    if (!isCompetitiveTier(ageGroup)) {
      blockedDivisions.push({
        competitionId: raw.competitionId,
        competitionName: raw.competitionName,
        ageGroup,
        reason:
          "League tables are not published for development age groups (U7–U11) in accordance with DDSL and FAI child welfare guidelines.",
      });
      continue;
    }

    tables.push(transformTable(raw, ageGroup));
  }

  const now = Date.now();
  const body: TablesResponse = {
    source,
    fetchedAt: new Date(now).toISOString(),
    cacheExpiresAt: new Date(now + TTL_MS).toISOString(),
    total: tables.length,
    tables,
    blockedDivisions,
  };

  cacheSet(CACHE_KEY, body);

  return NextResponse.json(body, {
    headers: {
      "X-Cache": "MISS",
      "X-Data-Source": source,
    },
  });
}
