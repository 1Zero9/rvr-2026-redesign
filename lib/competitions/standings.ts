import { FixtureStatus } from "@prisma/client";
import type { FixtureWithTeams, StandingsRow } from "./types";

export function computeStandings(
  fixtures: FixtureWithTeams[],
  teamIds: string[],
  teamNames: Record<string, string>,
): StandingsRow[] {
  const rows: Record<string, StandingsRow> = {};

  for (const id of teamIds) {
    rows[id] = {
      teamId: id,
      teamName: teamNames[id] ?? id,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    };
  }

  for (const f of fixtures) {
    if (f.status !== FixtureStatus.COMPLETE) continue;
    if (f.homeScore == null || f.awayScore == null) continue;

    const h = rows[f.homeTeamId];
    const a = rows[f.awayTeamId];
    if (!h || !a) continue;

    h.played++;
    a.played++;
    h.goalsFor += f.homeScore;
    h.goalsAgainst += f.awayScore;
    a.goalsFor += f.awayScore;
    a.goalsAgainst += f.homeScore;

    if (f.homeScore > f.awayScore) {
      h.won++;
      h.points += 3;
      a.lost++;
    } else if (f.homeScore < f.awayScore) {
      a.won++;
      a.points += 3;
      h.lost++;
    } else {
      h.drawn++;
      a.drawn++;
      h.points++;
      a.points++;
    }
  }

  for (const row of Object.values(rows)) {
    row.goalDifference = row.goalsFor - row.goalsAgainst;
  }

  return Object.values(rows).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return a.teamName.localeCompare(b.teamName);
  });
}
