import { NextRequest, NextResponse } from "next/server";
import { parseTeamSlug, matchesSlug } from "@/lib/ddsl/team-slug";
import { resolveActiveSeason } from "@/lib/db/active-season";

export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MERCY_CAP = 5;

// DDSL policy: mercy rule applies to U7 through U11 only.
// U12, youth competitive (U13–U18), and senior matches transmit exact scores.
const MERCY_RULE_AGE_GROUPS = new Set(["U7", "U8", "U9", "U10", "U11"]);

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
// Age group resolution
// ---------------------------------------------------------------------------

interface AgeGroupSource {
  ageCategory?: string;
  groupName?: string;
  division?: string;
  competitionName: string;
}

function extractAgeGroup(source: AgeGroupSource): string {
  // Check dedicated age fields in priority order before falling back to
  // regex on the competition name string.
  const candidate =
    source.ageCategory ??
    source.groupName ??
    source.division ??
    source.competitionName;

  const match = candidate.match(/[Uu](?:nder[-\s]?)?(\d{1,2})/);
  if (!match) return "Senior";

  const age = parseInt(match[1], 10);
  return age >= 7 && age <= 18 ? `U${age}` : "Senior";
}

function requiresMercyRule(ageGroup: string): boolean {
  return MERCY_RULE_AGE_GROUPS.has(ageGroup);
}

// ---------------------------------------------------------------------------
// Score builder
//
// For mercy-rule age groups (U7–U11) the public display is capped so the
// winning margin never exceeds MERCY_CAP goals. The losing score is held
// constant; only the winning total is reduced.
//
// For all other age groups the raw scoreline is returned unchanged.
// ---------------------------------------------------------------------------

function buildScore(home: number, away: number, ageGroup: string): Score {
  const applyMercy = requiresMercyRule(ageGroup);
  const winningScore = Math.max(home, away);
  const losingScore = Math.min(home, away);
  const actualMargin = winningScore - losingScore;
  const displayMargin = applyMercy ? Math.min(actualMargin, MERCY_CAP) : actualMargin;
  const capped = applyMercy && displayMargin < actualMargin;

  if (!capped) {
    return {
      home,
      away,
      mercyRuleApplied: false,
      displayMargin,
      actualMargin: null,
    };
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
// SportLoMo integration
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
  ageCategory?: string;
  groupName?: string;
  division?: string;
  score?: { home: number; away: number };
}

function mapStatus(raw: string): MatchStatus {
  const s = raw.toLowerCase();
  if (s === "live") return "live";
  if (s === "result" || s === "completed") return "completed";
  if (s === "postponed") return "postponed";
  return "upcoming";
}

function mapRawFixture(raw: SportLoMoRawFixture): Fixture {
  const ageGroup = extractAgeGroup({
    ageCategory: raw.ageCategory,
    groupName: raw.groupName,
    division: raw.division,
    competitionName: raw.competition.competitionName,
  });

  const status = mapStatus(raw.status);
  const score =
    raw.score != null
      ? buildScore(raw.score.home, raw.score.away, ageGroup)
      : null;

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
}

async function fetchFromSportLoMo(): Promise<Fixture[]> {
  const baseUrl = process.env.SPORTLOMO_BASE_URL?.replace(/\/$/, "");
  const apiKey = process.env.SPORTLOMO_API_KEY;
  const clubId = process.env.SPORTLOMO_CLUB_ID;
  // resolveActiveSeason() reads the active Season row from the database first,
  // then falls back to SPORTLOMO_SEASON env var, then to the current year.
  // This ties the live SportLoMo query to whichever season the DB marks active,
  // ensuring historical HistoricalStanding rows never contaminate the live feed.
  const season = await resolveActiveSeason();

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
  return envelope.data.map(mapRawFixture);
}

// ---------------------------------------------------------------------------
// Mock dataset — used when SportLoMo env vars are absent
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
  {
    id: 1007,
    date: "2026-06-20",
    time: "20:00",
    homeTeam: "Rivervalley Rangers AFC",
    awayTeam: "Blanchardstown AFC",
    competition: "DDSL Senior Men Division 1",
    ageGroup: "Senior",
    venue: "Rivervalley Park, Dublin 15",
    status: "completed",
    rawHome: 4,
    rawAway: 0,
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

export async function GET(req: NextRequest): Promise<NextResponse<FixturesResponse>> {
  const teamSlug = req.nextUrl.searchParams.get("team");

  let fixtures: Fixture[];
  let source: "live" | "mock";

  try {
    fixtures = await fetchFromSportLoMo();
    source = "live";
  } catch (err) {
    console.error("[api/fixtures] SportLoMo fetch failed, using mock data:", err);
    fixtures = buildMockFixtures();
    source = "mock";
  }

  const visible = teamSlug
    ? (() => {
        const filter = parseTeamSlug(teamSlug);
        return fixtures.filter((f) => matchesSlug(f.ageGroup, f.competition, filter));
      })()
    : fixtures;

  return NextResponse.json(
    {
      source,
      fetchedAt: new Date().toISOString(),
      total: visible.length,
      fixtures: visible,
    },
    { headers: { "X-Data-Source": source } },
  );
}
