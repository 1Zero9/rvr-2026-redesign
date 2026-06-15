"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import {
  Calendar,
  Clock,
  MapPin,
  Zap,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types — mirror the /api/fixtures response contract
// ---------------------------------------------------------------------------

type MatchStatus = "upcoming" | "live" | "completed" | "postponed";
type FilterTab = "all" | "upcoming" | "live" | "completed" | "postponed";

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
// Score capping — applied client-side before any fixture reaches the render tree.
// U7–U11 youth fixtures: visible margin is capped at 5 goals.
// Formula: displayMargin = Math.min(winningScore - losingScore, 5)
// U12, U13–U18, and Senior scores are returned exactly as received.
// ---------------------------------------------------------------------------

const MERCY_RULE_AGE_GROUPS = new Set([
  "U7", "U8", "U9", "U10", "U11",
]);

function sanitiseScore(fixture: Fixture): Fixture {
  const { score, ageGroup } = fixture;
  if (!score || !MERCY_RULE_AGE_GROUPS.has(ageGroup)) return fixture;

  const { home, away } = score;
  const winningScore = Math.max(home, away);
  const losingScore = Math.min(home, away);
  const actualMargin = winningScore - losingScore;
  const displayMargin = Math.min(actualMargin, 5);

  if (displayMargin === actualMargin) return fixture;

  const cappedWinning = losingScore + displayMargin;
  return {
    ...fixture,
    score: {
      home: home >= away ? cappedWinning : losingScore,
      away: home >= away ? losingScore : cappedWinning,
      mercyRuleApplied: true,
      displayMargin,
      actualMargin,
    },
  };
}

function sanitiseAll(fixtures: Fixture[]): Fixture[] {
  return fixtures.map(sanitiseScore);
}

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------

function formatDate(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("en-IE", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function formatTime(timeStr: string): string {
  const [h, m] = timeStr.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

function isRVR(teamName: string): boolean {
  return /rivervalley rangers/i.test(teamName);
}

// ---------------------------------------------------------------------------
// Status badge
// ---------------------------------------------------------------------------

function StatusBadge({ status }: { status: MatchStatus }) {
  if (status === "live") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-brand-charcoal bg-brand-neon px-2.5 py-0.5 font-display text-[10px] font-black uppercase tracking-wider text-brand-charcoal">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-charcoal" />
        Live
      </span>
    );
  }
  if (status === "completed") {
    return (
      <span className="inline-flex items-center rounded-full border-2 border-brand-charcoal bg-brand-charcoal px-2.5 py-0.5 font-display text-[10px] font-black uppercase tracking-wider text-white">
        Result
      </span>
    );
  }
  if (status === "postponed") {
    return (
      <span className="inline-flex items-center rounded-full border-2 border-amber-600 bg-amber-100 px-2.5 py-0.5 font-display text-[10px] font-black uppercase tracking-wider text-amber-800">
        Postponed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full border-2 border-zinc-300 bg-zinc-100 px-2.5 py-0.5 font-display text-[10px] font-black uppercase tracking-wider text-zinc-600">
      Upcoming
    </span>
  );
}

// ---------------------------------------------------------------------------
// Match card
// ---------------------------------------------------------------------------

function MatchCard({ fixture }: { fixture: Fixture }) {
  const homeIsRVR = isRVR(fixture.homeTeam);
  const awayIsRVR = isRVR(fixture.awayTeam);
  const hasScore = fixture.score !== null && fixture.status === "completed";
  const isLive = fixture.status === "live";

  return (
    <article
      className={`brutalist-card flex flex-col gap-4 p-5 ${
        isLive ? "ring-2 ring-brand-neon ring-offset-2" : ""
      }`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <span className="font-display text-[10px] font-black uppercase tracking-wider text-brand-green">
            {fixture.competition}
          </span>
          <span className="inline-block self-start rounded-full border border-zinc-300 bg-zinc-100 px-2 py-0.5 font-display text-[10px] font-bold uppercase tracking-wide text-zinc-600">
            {fixture.ageGroup}
          </span>
        </div>
        <StatusBadge status={fixture.status} />
      </div>

      {/* Teams + score */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        {/* Home team */}
        <div className="flex flex-col items-start gap-0.5">
          <span
            className={`font-display text-sm font-black uppercase leading-tight ${
              homeIsRVR ? "text-brand-green" : "text-brand-charcoal"
            }`}
          >
            {fixture.homeTeam}
          </span>
          <span className="font-display text-[9px] font-bold uppercase tracking-wider text-zinc-400">
            Home
          </span>
        </div>

        {/* Score or kick-off */}
        <div className="flex flex-col items-center">
          {hasScore || isLive ? (
            <div className="flex items-center gap-1.5">
              <span
                className={`font-display text-2xl font-black tabular-nums ${
                  homeIsRVR ? "text-brand-green" : "text-brand-charcoal"
                }`}
              >
                {fixture.score!.home}
              </span>
              <span className="font-display text-lg font-black text-zinc-300">–</span>
              <span
                className={`font-display text-2xl font-black tabular-nums ${
                  awayIsRVR ? "text-brand-green" : "text-brand-charcoal"
                }`}
              >
                {fixture.score!.away}
              </span>
            </div>
          ) : (
            <span className="font-display text-xl font-black tracking-widest text-zinc-300">
              vs
            </span>
          )}
          {fixture.score?.mercyRuleApplied && (
            <span className="mt-1 rounded border border-brand-neon bg-brand-neon/10 px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase tracking-wider text-brand-green">
              Capped
            </span>
          )}
        </div>

        {/* Away team */}
        <div className="flex flex-col items-end gap-0.5">
          <span
            className={`text-right font-display text-sm font-black uppercase leading-tight ${
              awayIsRVR ? "text-brand-green" : "text-brand-charcoal"
            }`}
          >
            {fixture.awayTeam}
          </span>
          <span className="font-display text-[9px] font-bold uppercase tracking-wider text-zinc-400">
            Away
          </span>
        </div>
      </div>

      {/* Footer: date / time / venue */}
      <div className="flex flex-wrap items-center gap-3 border-t-2 border-dashed border-zinc-200 pt-3">
        <span className="flex items-center gap-1 font-mono text-[10px] font-semibold text-zinc-500">
          <Calendar className="h-3 w-3" />
          {formatDate(fixture.date)}
        </span>
        <span className="flex items-center gap-1 font-mono text-[10px] font-semibold text-zinc-500">
          <Clock className="h-3 w-3" />
          {formatTime(fixture.time)}
        </span>
        <span className="flex items-center gap-1 font-mono text-[10px] font-semibold text-zinc-500 truncate max-w-[180px]">
          <MapPin className="h-3 w-3 shrink-0" />
          {fixture.venue}
        </span>
      </div>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Filter tab bar
// ---------------------------------------------------------------------------

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "upcoming", label: "Upcoming" },
  { key: "live", label: "Live" },
  { key: "completed", label: "Results" },
  { key: "postponed", label: "Postponed" },
];

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function MatchesPage() {
  const [data, setData] = useState<FixturesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const fetchFixtures = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/fixtures", { cache: "no-store" });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const json = (await res.json()) as FixturesResponse;
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load fixtures");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFixtures();
  }, [fetchFixtures]);

  const sanitised = data ? sanitiseAll(data.fixtures) : [];

  const visible = sanitised.filter(
    (f) => activeTab === "all" || f.status === activeTab,
  );

  const liveCount = sanitised.filter((f) => f.status === "live").length;

  return (
    <div className="min-h-screen bg-brand-cream text-brand-charcoal">
      <Header />

      <main>
        {/* Page header */}
        <section className="border-b-4 border-brand-charcoal bg-white">
          <div className="mx-auto max-w-6xl px-6 py-14 lg:py-20">
            <div className="max-w-2xl">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border-3 border-brand-charcoal bg-brand-neon px-4 py-2 font-display text-xs font-black uppercase tracking-wider">
                <Zap className="h-4 w-4" aria-hidden="true" />
                Matchday Hub
              </span>
              <h1 className="font-display text-4xl font-black uppercase italic leading-none tracking-tighter md:text-6xl">
                Fixtures &amp; Results
              </h1>
              <p className="mt-5 text-base font-semibold leading-relaxed text-zinc-600 md:text-lg">
                All RVR matches across every age group and division. Youth scores
                for U7–U11 follow the DDSL Mercy Rule — a maximum visible margin
                of 5 goals. U12 and above display exact results.
              </p>
            </div>
          </div>
        </section>

        {/* Controls row */}
        <div className="border-b-4 border-brand-charcoal bg-brand-cream">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Filter tabs */}
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter fixtures by status">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab.key}
                  role="tab"
                  aria-selected={activeTab === tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative rounded-full border-2 px-4 py-1.5 font-display text-xs font-black uppercase tracking-wide transition-all ${
                    activeTab === tab.key
                      ? "border-brand-charcoal bg-brand-charcoal text-white shadow-[2px_2px_0_#85E320]"
                      : "border-zinc-300 bg-white text-zinc-600 hover:border-brand-charcoal hover:text-brand-charcoal"
                  }`}
                >
                  {tab.label}
                  {tab.key === "live" && liveCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-neon font-mono text-[8px] font-black text-brand-charcoal">
                      {liveCount}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Source tag + refresh */}
            <div className="flex items-center gap-3">
              {data && (
                <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">
                  {data.source === "live" ? "Live data" : "Preview data"}
                </span>
              )}
              <button
                onClick={fetchFixtures}
                disabled={loading}
                aria-label="Refresh fixtures"
                className="flex items-center gap-1.5 rounded-full border-2 border-zinc-300 bg-white px-3 py-1.5 font-display text-xs font-black uppercase tracking-wide text-zinc-600 transition hover:border-brand-charcoal hover:text-brand-charcoal disabled:opacity-40"
              >
                <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <section className="mx-auto max-w-6xl px-6 py-10 lg:py-14">
          {loading && (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-200 border-t-brand-green" />
              <p className="font-display text-sm font-bold uppercase tracking-wide text-zinc-500">
                Loading fixtures...
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="flex flex-col items-center gap-4 rounded-2xl border-4 border-red-400 bg-red-50 p-10 text-center">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <p className="font-display text-sm font-black uppercase text-red-700">
                Could not load fixtures
              </p>
              <p className="text-xs font-semibold text-red-600">{error}</p>
              <button
                onClick={fetchFixtures}
                className="btn-brutalist-neon px-5 py-2 text-xs"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && visible.length === 0 && (
            <div className="py-20 text-center">
              <p className="font-display text-sm font-black uppercase tracking-wide text-zinc-400">
                No fixtures in this category
              </p>
            </div>
          )}

          {!loading && !error && visible.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {visible.map((fixture) => (
                <MatchCard key={fixture.id} fixture={fixture} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
