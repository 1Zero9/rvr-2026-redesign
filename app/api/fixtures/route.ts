import { NextRequest, NextResponse } from "next/server";
import { parseTeamSlug, matchesSlug } from "@/lib/ddsl/team-slug";
import { resolveActiveSeason } from "@/lib/db/active-season";
import {
  normalizeKickoffTime,
  normalizeTeamName,
  normalizeVenueName,
} from "@/lib/ddsl/normalize";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

type MatchStatus = "upcoming" | "live" | "completed" | "postponed" | "walkover";

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
  /** "live" — data fetched from SportLoMo. "empty" — API unavailable, no fixtures to show. */
  source: "live" | "empty";
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
  const s = raw.toLowerCase().trim();
  if (s === "live")                            return "live";
  if (s === "result" || s === "completed")     return "completed";
  if (s === "postponed")                       return "postponed";
  if (s === "walkover" || s === "w/o")         return "walkover";
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

  // Walkovers carry no scoreline in the feed — avoid rendering a false 0–0.
  const score =
    status !== "walkover" && raw.score != null
      ? buildScore(raw.score.home, raw.score.away, ageGroup)
      : null;

  return {
    id: raw.fixtureId,
    date: raw.fixtureDate,
    time: normalizeKickoffTime(raw.fixtureTime),
    homeTeam: normalizeTeamName(raw.homeTeam.teamName),
    awayTeam: normalizeTeamName(raw.awayTeam.teamName),
    competition: raw.competition.competitionName,
    ageGroup,
    venue: normalizeVenueName(raw.venue.venueName),
    status,
    score,
  };
}

async function fetchFromSportLoMo(): Promise<Fixture[]> {
  const baseUrl = process.env.SPORTLOMO_BASE_URL?.replace(/\/$/, "");
  const apiKey = process.env.SPORTLOMO_API_KEY;
  const clubId = process.env.SPORTLOMO_CLUB_ID;
  // resolveActiveSeason() reads the active Season row from the database first,
  // then falls back to SPORTLOMO_SEASON env var, then to CLUB_SEASON.currentSeason.
  // This ties the live SportLoMo query to whichever season the DB marks active,
  // ensuring historical HistoricalStanding rows never contaminate the live feed.
  const season = await resolveActiveSeason();

  if (!baseUrl || !apiKey || !clubId) {
    throw new Error("SportLoMo environment variables not configured");
  }

  // Paginate until the server has no more rows — needed to capture all active
  // divisions when the club has a large number of registered squads.
  const PAGE_SIZE = 100;
  const all: SportLoMoRawFixture[] = [];
  let page = 1;

  for (;;) {
    const url = new URL(`${baseUrl}/clubs/${clubId}/fixtures`);
    url.searchParams.set("season", season);
    url.searchParams.set("page", String(page));
    url.searchParams.set("pageSize", String(PAGE_SIZE));

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${apiKey}`, Accept: "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`SportLoMo responded with ${res.status}`);
    }

    const envelope = (await res.json()) as { total: number; data: SportLoMoRawFixture[] };
    all.push(...envelope.data);

    if (all.length >= (envelope.total ?? 0) || envelope.data.length < PAGE_SIZE) break;
    page++;
  }

  return all.map(mapRawFixture);
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function GET(req: NextRequest): Promise<NextResponse<FixturesResponse>> {
  const teamSlug = req.nextUrl.searchParams.get("team");
  const fetchedAt = new Date().toISOString();

  // Fixtures are sourced exclusively from the live SportLoMo API feed.
  // There is no database Fixture table — live match data is not persisted.
  // When the API is unavailable the endpoint returns an empty array so the
  // UI renders its "No fixtures found" state rather than stale hardcoded data.
  let fixtures: Fixture[];

  try {
    fixtures = await fetchFromSportLoMo();
  } catch (err) {
    console.error("[api/fixtures] SportLoMo fetch failed — returning empty fixture list:", err);
    return NextResponse.json(
      { source: "empty", fetchedAt, total: 0, fixtures: [] },
      {
        headers: {
          "X-Data-Source": "empty",
          "Cache-Control": "no-store, max-age=0, must-revalidate",
        },
      },
    );
  }

  const visible = teamSlug
    ? (() => {
        const filter = parseTeamSlug(teamSlug);
        return fixtures.filter((f) => matchesSlug(f.ageGroup, f.competition, filter));
      })()
    : fixtures;

  return NextResponse.json(
    { source: "live", fetchedAt, total: visible.length, fixtures: visible },
    {
      headers: {
        "X-Data-Source": "live",
        "Cache-Control": "no-store, max-age=0, must-revalidate",
      },
    },
  );
}
