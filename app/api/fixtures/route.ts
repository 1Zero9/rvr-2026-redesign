/**
 * GET /api/fixtures
 *
 * Returns upcoming RVR fixtures sourced from the SportLoMo API.
 * When SPORTLOMO_BASE_URL / SPORTLOMO_API_KEY / SPORTLOMO_CLUB_ID are not
 * set the handler falls back to a mock dataset so the endpoint remains usable
 * during local development and CI.
 *
 * Mercy Rule (DDSL policy, U7–U12):
 *   The publicly visible score margin is capped at 5 goals.
 *   Formula: displayMargin = Math.min(winningScore − losingScore, 5)
 *   The losing score is held constant; only the winning total is adjusted.
 */

import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type MatchStatus = "upcoming" | "live" | "completed" | "postponed";

interface Score {
  home: number;
  away: number;
  mercyRuleApplied: boolean;
  displayMargin: number;
  actualMargin: number | null;
}

interface Fixture {
  id: number;
  date: string;
  time: string;
  homeTeam: string;
  awayTeam: string;
  competition: string;
  ageGroup: string;
  venue: string;
  status: MatchStatus;
  score: Score | null;
}

interface FixturesResponse {
  source: "live" | "mock";
  fetchedAt: string;
  total: number;
  fixtures: Fixture[];
}

// ---------------------------------------------------------------------------
// Mercy Rule
// ---------------------------------------------------------------------------

const MERCY_RULE_AGE_GROUPS = new Set(["U7", "U8", "U9", "U10", "U11", "U12"]);

function buildScore(home: number, away: number, ageGroup: string): Score {
  const eligible = MERCY_RULE_AGE_GROUPS.has(ageGroup);
  const winningScore = Math.max(home, away);
  const losingScore = Math.min(home, away);
  const actualMargin = winningScore - losingScore;
  const displayMargin = eligible ? Math.min(actualMargin, 5) : actualMargin;
  const capped = eligible && displayMargin < actualMargin;

  if (!capped) {
    return { home, away, mercyRuleApplied: false, displayMargin, actualMargin: null };
  }

  const cappedWinning = losingScore + displayMargin;
  return {
    home: home >= away ? cappedWinning : losingScore,
    away: home >= away ? losingScore : cappedWinning,
    mercyRuleApplied: true,
    displayMargin,
    actualMargin,
  };
}

// ---------------------------------------------------------------------------
// SportLoMo live fetch
// ---------------------------------------------------------------------------

interface SportLoMoRawFixture {
  fixtureId: number;
  fixtureDate: string;
  fixtureTime: string;
  homeTeam: { teamName: string };
  awayTeam: { teamName: string };
  competition: { competitionName: string };
  venue: { venueName: string };
  status: string;
  score?: { home: number; away: number };
}

function parseAgeGroup(competitionName: string): string {
  const match = competitionName.match(/[Uu](?:nder[-\s]?)?(\d{1,2})/);
  if (!match) return "Senior";
  const age = parseInt(match[1], 10);
  return age >= 7 && age <= 18 ? `U${age}` : "Unknown";
}

function mapStatus(raw: string): MatchStatus {
  const s = raw.toLowerCase();
  if (s === "live") return "live";
  if (s === "result" || s === "completed") return "completed";
  if (s === "postponed") return "postponed";
  return "upcoming";
}

async function fetchFromSportLoMo(): Promise<Fixture[]> {
  const baseUrl = process.env.SPORTLOMO_BASE_URL?.replace(/\/$/, "");
  const apiKey = process.env.SPORTLOMO_API_KEY;
  const clubId = process.env.SPORTLOMO_CLUB_ID;
  const season = process.env.SPORTLOMO_SEASON ?? new Date().getFullYear().toString();

  if (!baseUrl || !apiKey || !clubId) {
    throw new Error("SportLoMo environment variables not configured");
  }

  const url = new URL(`${baseUrl}/Club/${clubId}/Fixtures`);
  url.searchParams.set("season", season);
  url.searchParams.set("pageSize", "100");

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${apiKey}`, Accept: "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`SportLoMo responded with ${res.status}`);
  }

  const envelope = (await res.json()) as { data: SportLoMoRawFixture[] };

  return envelope.data.map((raw) => {
    const ageGroup = parseAgeGroup(raw.competition.competitionName);
    const status = mapStatus(raw.status);
    const score =
      raw.score != null ? buildScore(raw.score.home, raw.score.away, ageGroup) : null;

    return {
      id: raw.fixtureId,
      date: raw.fixtureDate,
      time: raw.fixtureTime,
      homeTeam: raw.homeTeam.teamName,
      awayTeam: raw.awayTeam.teamName,
      competition: raw.competition.competitionName,
      ageGroup,
      venue: raw.venue.venueName,
      status,
      score,
    };
  });
}

// ---------------------------------------------------------------------------
// Mock dataset (active when SportLoMo env vars are absent)
// ---------------------------------------------------------------------------

const MOCK_FIXTURES: Array<
  Omit<Fixture, "score"> & { rawHome?: number; rawAway?: number }
> = [
  {
    id: 1001,
    date: "2026-06-21",
    time: "10:30",
    homeTeam: "Rivervalley Rangers AFC",
    awayTeam: "St. Brendans FC",
    competition: "DDSL U10 Boys Division 1",
    ageGroup: "U10",
    venue: "Rivervalley Park, Dublin 15",
    status: "upcoming",
  },
  {
    id: 1002,
    date: "2026-06-21",
    time: "12:00",
    homeTeam: "Clongriffin FC",
    awayTeam: "Rivervalley Rangers AFC",
    competition: "DDSL U12 Girls Division 2",
    ageGroup: "U12",
    venue: "Oscar Traynor Road, Dublin 17",
    status: "upcoming",
  },
  {
    id: 1003,
    date: "2026-06-22",
    time: "11:00",
    homeTeam: "Rivervalley Rangers AFC",
    awayTeam: "Hartstown Huntstown FC",
    competition: "DDSL U8 Mixed Blitz",
    ageGroup: "U8",
    venue: "Rivervalley Park, Dublin 15",
    status: "upcoming",
  },
  {
    id: 1004,
    date: "2026-06-19",
    time: "18:30",
    homeTeam: "Rivervalley Rangers AFC",
    awayTeam: "Lucan United FC",
    competition: "DDSL U10 Boys Division 1",
    ageGroup: "U10",
    venue: "Rivervalley Park, Dublin 15",
    status: "completed",
    rawHome: 8,
    rawAway: 1,
  },
  {
    id: 1005,
    date: "2026-06-18",
    time: "19:00",
    homeTeam: "Coolmine Athletic FC",
    awayTeam: "Rivervalley Rangers AFC",
    competition: "DDSL U12 Boys Division 1",
    ageGroup: "U12",
    venue: "Coolmine Sports Ground, Dublin 15",
    status: "completed",
    rawHome: 2,
    rawAway: 3,
  },
  {
    id: 1006,
    date: "2026-06-28",
    time: "10:00",
    homeTeam: "Rivervalley Rangers AFC",
    awayTeam: "Swords Celtic FC",
    competition: "DDSL U15 Boys Division 2",
    ageGroup: "U15",
    venue: "Rivervalley Park, Dublin 15",
    status: "upcoming",
  },
];

function buildMockFixtures(): Fixture[] {
  return MOCK_FIXTURES.map(({ rawHome, rawAway, ...f }) => ({
    ...f,
    score:
      rawHome !== undefined && rawAway !== undefined
        ? buildScore(rawHome, rawAway, f.ageGroup)
        : null,
  }));
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function GET(_req: NextRequest): Promise<NextResponse<FixturesResponse>> {
  let fixtures: Fixture[];
  let source: "live" | "mock";

  try {
    fixtures = await fetchFromSportLoMo();
    source = "live";
  } catch {
    fixtures = buildMockFixtures();
    source = "mock";
  }

  const body: FixturesResponse = {
    source,
    fetchedAt: new Date().toISOString(),
    total: fixtures.length,
    fixtures,
  };

  return NextResponse.json(body, {
    headers: { "X-Data-Source": source },
  });
}
