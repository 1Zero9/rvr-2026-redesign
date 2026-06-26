import { CompetitionType } from "@prisma/client";
import type { GeneratedFixture, SchedulerConfig } from "./types";

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60_000);
}

function parseStartTime(dateStr: Date, timeStr: string): Date {
  const [h, m] = timeStr.split(":").map(Number);
  const d = new Date(dateStr);
  d.setHours(h, m, 0, 0);
  return d;
}

/** Round-robin pairs for n teams — returns [home, away] index pairs */
function roundRobinPairs(n: number): [number, number][] {
  const pairs: [number, number][] = [];
  if (n % 2 !== 0) n++;
  const rounds = n - 1;
  const half = n / 2;
  const teams = Array.from({ length: n - 1 }, (_, i) => i);

  for (let r = 0; r < rounds; r++) {
    for (let i = 0; i < half; i++) {
      const home = i === 0 ? n - 1 : teams[(r + i) % (n - 1)];
      const away = teams[(r + n - 1 - i) % (n - 1)];
      if (home !== n - 1 || away < n) {
        pairs.push([home, away]);
      }
    }
  }
  return pairs;
}

function assignTimeslots(
  fixtures: Omit<GeneratedFixture, "scheduledAt" | "venueName" | "pitchLabel">[],
  config: SchedulerConfig,
): GeneratedFixture[] {
  const { venues, dates, startTime, gameDuration, breakDuration } = config;
  const allPitches: { venue: string; pitch: string | null }[] = [];

  for (const v of venues) {
    if (v.pitches.length === 0) {
      allPitches.push({ venue: v.name, pitch: null });
    } else {
      for (const p of v.pitches) {
        allPitches.push({ venue: v.name, pitch: p });
      }
    }
  }
  if (allPitches.length === 0) {
    allPitches.push({ venue: "Main Pitch", pitch: null });
  }

  const slotDuration = gameDuration + breakDuration;
  const result: GeneratedFixture[] = [];

  // Track when each pitch is next free, per day
  const pitchFreeAt: Date[] = allPitches.map((_, i) => {
    const d = dates[0] ?? new Date();
    return parseStartTime(d, startTime);
  });

  let fixtureIdx = 0;
  let dayIdx = 0;

  for (const f of fixtures) {
    if (dayIdx >= dates.length) dayIdx = 0;

    // Find earliest free pitch
    let bestPitch = 0;
    for (let p = 1; p < allPitches.length; p++) {
      if (pitchFreeAt[p] < pitchFreeAt[bestPitch]) bestPitch = p;
    }

    const scheduledAt = new Date(pitchFreeAt[bestPitch]);
    pitchFreeAt[bestPitch] = addMinutes(scheduledAt, slotDuration);

    result.push({
      ...f,
      scheduledAt,
      venueName: allPitches[bestPitch].venue,
      pitchLabel: allPitches[bestPitch].pitch,
      duration: gameDuration,
    });

    fixtureIdx++;
  }

  return result.sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime());
}

export function generateFixtures(config: SchedulerConfig): GeneratedFixture[] {
  const { teams, competitionType } = config;
  const n = teams.length;
  if (n < 2) return [];

  const base: Omit<GeneratedFixture, "scheduledAt" | "venueName" | "pitchLabel">[] = [];

  if (
    competitionType === CompetitionType.MINI_LEAGUE ||
    competitionType === CompetitionType.BLITZ ||
    competitionType === CompetitionType.FESTIVAL
  ) {
    const pairs = roundRobinPairs(n);
    for (const [h, a] of pairs) {
      if (h < n && a < n) {
        base.push({
          homeTeamId: teams[h].id,
          awayTeamId: teams[a].id,
          round: "Round Robin",
          duration: config.gameDuration,
        });
      }
    }
  } else if (competitionType === CompetitionType.KNOCKOUT) {
    // Simple single-elimination bracket
    let round = 1;
    let remaining = [...teams];
    while (remaining.length > 1) {
      const roundName = remaining.length === 2 ? "Final" : remaining.length === 4 ? "Semi Final" : `Round ${round}`;
      const nextRound: typeof remaining = [];
      for (let i = 0; i + 1 < remaining.length; i += 2) {
        base.push({
          homeTeamId: remaining[i].id,
          awayTeamId: remaining[i + 1].id,
          round: roundName,
          duration: config.gameDuration,
        });
        // Placeholder — winner advances (can't pre-determine in scheduler)
        nextRound.push(remaining[i]);
      }
      if (remaining.length % 2 !== 0) nextRound.push(remaining[remaining.length - 1]);
      remaining = nextRound;
      round++;
    }
  } else if (competitionType === CompetitionType.GROUP_KNOCKOUT) {
    const groupSize = n <= 8 ? 3 : 4;
    const groups: typeof teams[] = [];
    for (let i = 0; i < n; i += groupSize) {
      groups.push(teams.slice(i, i + groupSize));
    }
    groups.forEach((group, gi) => {
      const label = String.fromCharCode(65 + gi);
      const pairs = roundRobinPairs(group.length);
      for (const [h, a] of pairs) {
        if (h < group.length && a < group.length) {
          base.push({
            homeTeamId: group[h].id,
            awayTeamId: group[a].id,
            round: `Group ${label}`,
            duration: config.gameDuration,
          });
        }
      }
    });
    // Knockout rounds are created manually after group stage
  }

  return assignTimeslots(base, config);
}
