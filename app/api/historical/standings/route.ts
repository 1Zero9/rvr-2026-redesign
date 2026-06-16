import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isRvrTeam } from "@/lib/ddsl/transform";
import { parseAgeGroup } from "@/lib/ddsl/mercy-rule";
import type { AgeGroup, HistoricalSeasonResponse, LeagueTable } from "@/lib/ddsl/types";

export const dynamic = "force-dynamic";

// Stable numeric ID derived from a competition name string so LeagueTable rows
// have a competitionId without a SportLoMo API call.
function divisionHash(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (Math.imul(31, h) + name.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export async function GET(
  req: NextRequest,
): Promise<NextResponse<HistoricalSeasonResponse>> {
  const season = req.nextUrl.searchParams.get("season") ?? "";

  if (!season) {
    return NextResponse.json(
      { source: "empty", season: "", fetchedAt: new Date().toISOString(), total: 0, tables: [] },
      { status: 400 },
    );
  }

  let tables: LeagueTable[] = [];

  try {
    const rows = await prisma.historicalStanding.findMany({
      where: { season: { label: season } },
      orderBy: [{ divisionName: "asc" }, { position: "asc" }],
    });

    // Group rows by divisionName
    const byDivision = new Map<string, typeof rows>();
    for (const row of rows) {
      const bucket = byDivision.get(row.divisionName) ?? [];
      bucket.push(row);
      byDivision.set(row.divisionName, bucket);
    }

    tables = Array.from(byDivision.entries()).map(([divisionName, divRows]) => {
      const ageGroup: AgeGroup = parseAgeGroup(divisionName);
      return {
        competitionId: divisionHash(divisionName),
        competitionName: divisionName,
        ageGroup,
        season,
        rows: divRows.map((r) => ({
          position: r.position,
          teamName: r.teamName,
          played: r.played,
          won: r.won,
          drawn: r.drawn,
          lost: r.lost,
          goalsFor: r.goalsFor,
          goalsAgainst: r.goalsAgainst,
          goalDifference: r.goalDifference,
          points: r.points,
          isRvr: isRvrTeam(r.teamName),
        })),
      };
    });
  } catch {
    // DB unavailable — return empty payload rather than a 500
    return NextResponse.json({
      source: "empty",
      season,
      fetchedAt: new Date().toISOString(),
      total: 0,
      tables: [],
    });
  }

  return NextResponse.json({
    source: tables.length > 0 ? "db" : "empty",
    season,
    fetchedAt: new Date().toISOString(),
    total: tables.length,
    tables,
  });
}
