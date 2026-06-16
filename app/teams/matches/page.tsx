"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import DDSLTableWidget from "@/components/DDSLTableWidget";
import {
  CalendarDays,
  ChevronDown,
  Clock3,
  MapPin,
  Radio,
  ShieldCheck,
  Table2,
  Trophy,
} from "lucide-react";
import { CLUB_SEASON } from "@/config/club-season";
import type {
  AgeGroup,
  DevelopmentDivision,
  DiscoveredDivision,
  HistoricalSeasonResponse,
  LeagueTable,
  NormalisedMatch,
  SyncResponse,
} from "@/lib/ddsl/types";

// ---------------------------------------------------------------------------
// Kit theme configuration
// ---------------------------------------------------------------------------

type KitTheme = "club" | "boys" | "girls";

interface KitThemeConfig {
  label: string;
  accent: string;
}

const KIT_THEMES = {
  club:  { label: "Club",           accent: "#39FF14" },
  boys:  { label: "Boys Sections",  accent: "#38BDF8" },
  girls: { label: "Girls Sections", accent: "#EC4899" },
} as const satisfies Record<KitTheme, KitThemeConfig>;

// ---------------------------------------------------------------------------
// Season configuration
// ---------------------------------------------------------------------------

type SeasonKey = "current" | "archived";

interface SeasonOption {
  key: SeasonKey;
  label: string;
  apiPath: string;
}

// Derive the previous season label automatically from the master config so
// this block never needs touching manually on an August season flip.
// "2025/26" → prevStart=2024, prevEndShort="25" → "2024/25"
function previousSeasonLabel(current: string): string {
  const [startStr] = current.split('/');
  const startYear = parseInt(startStr, 10);
  return `${startYear - 1}/${String(startYear).slice(-2)}`;
}

const CURRENT_SEASON = CLUB_SEASON.currentSeason;
const PREV_SEASON    = previousSeasonLabel(CURRENT_SEASON);

const SEASON_OPTIONS: SeasonOption[] = [
  {
    key: "current",
    label: `${CURRENT_SEASON} (Current)`,
    apiPath: "/api/fixtures/sync",
  },
  {
    key: "archived",
    label: `${PREV_SEASON} (Archived)`,
    apiPath: `/api/historical/standings?season=${encodeURIComponent(PREV_SEASON)}`,
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

type SelectedDivisionKey = "all" | string;

interface DivisionOption {
  key: SelectedDivisionKey;
  label: string;
  competitionId: number | null;
  competitionName: string | null;
  ageGroup: AgeGroup | null;
  tier: "all" | "competitive" | "development";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IE", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(`${value}T00:00:00`));
}

function formatStatus(status: NormalisedMatch["status"]) {
  if (status === "completed") return "FT";
  if (status === "live") return "Live";
  if (status === "postponed") return "Postponed";
  if (status === "cancelled") return "Cancelled";
  return "Scheduled";
}

function getCrestLabel(teamName: string) {
  if (/river\s*valley\s+rangers|(?<![a-z])rvr(?![a-z])/i.test(teamName)) {
    return "RVR";
  }
  return teamName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function isDevelopmentAge(ageGroup: AgeGroup) {
  return ["U7", "U8", "U9", "U10", "U11"].includes(ageGroup);
}

function buildDivisionOptions(divisions: DiscoveredDivision[]): DivisionOption[] {
  return [
    {
      key: "all",
      label: "All Teams",
      competitionId: null,
      competitionName: null,
      ageGroup: null,
      tier: "all",
    },
    ...divisions.map((division) => ({
      key: String(division.competitionId),
      label: division.competitionName,
      competitionId: division.competitionId,
      competitionName: division.competitionName,
      ageGroup: division.ageGroup,
      tier: division.tier,
    })),
  ];
}

function buildHistoricalDivisionOptions(tables: LeagueTable[]): DivisionOption[] {
  return [
    {
      key: "all",
      label: "All Divisions",
      competitionId: null,
      competitionName: null,
      ageGroup: null,
      tier: "all",
    },
    ...tables.map((t) => ({
      key: String(t.competitionId),
      label: t.competitionName,
      competitionId: t.competitionId,
      competitionName: t.competitionName,
      ageGroup: t.ageGroup,
      tier: "competitive" as const,
    })),
  ];
}

function teamMatchesCompetition(match: NormalisedMatch, option: DivisionOption) {
  return option.competitionName === null || match.competition === option.competitionName;
}

function tableMatchesCompetition(table: LeagueTable, option: DivisionOption) {
  return (
    option.competitionId === null ||
    table.competitionId === option.competitionId ||
    table.competitionName === option.competitionName
  );
}

function developmentMatchesCompetition(
  division: DevelopmentDivision,
  option: DivisionOption,
) {
  return (
    option.competitionId === null ||
    division.competitionId === option.competitionId ||
    division.competitionName === option.competitionName
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function TeamIdentity({
  teamName,
  align = "left",
  accent,
}: {
  teamName: string;
  align?: "left" | "right";
  accent: string;
}) {
  return (
    <div
      className={`flex min-w-0 items-center gap-3 ${
        align === "right" ? "justify-end text-right" : ""
      }`}
    >
      {align === "right" && (
        <p className="min-w-0 flex-1 truncate font-display text-sm font-black uppercase text-white sm:text-base">
          {teamName}
        </p>
      )}
      <span
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-3 border-white font-display text-xs font-black text-brand-charcoal shadow-[3px_3px_0_#FFFFFF]"
        style={{ backgroundColor: accent }}
      >
        {getCrestLabel(teamName)}
      </span>
      {align === "left" && (
        <p className="min-w-0 flex-1 truncate font-display text-sm font-black uppercase text-white sm:text-base">
          {teamName}
        </p>
      )}
    </div>
  );
}

function ResultBadge({ ageGroup, accent }: { ageGroup: AgeGroup; accent: string }) {
  const development = isDevelopmentAge(ageGroup);
  if (development) {
    return (
      <span className="inline-flex items-center justify-center rounded-full border-2 border-white bg-brand-navy px-3 py-1 font-display text-[10px] font-black uppercase text-white">
        Development Bracket
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center justify-center rounded-full border-2 border-brand-charcoal px-3 py-1 font-display text-[10px] font-black uppercase text-brand-charcoal"
      style={{ backgroundColor: accent }}
    >
      Official DDSL Result
    </span>
  );
}

function MatchCard({ match, accent }: { match: NormalisedMatch; accent: string }) {
  const status = formatStatus(match.status);
  const live = match.status === "live";

  return (
    <article
      className="rounded-[2rem] border-4 border-white bg-brand-navy p-5 text-white sm:p-6"
      style={{ boxShadow: `6px 6px 0 ${accent}` }}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-display text-xs font-black uppercase" style={{ color: accent }}>
            {match.competition}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-2 rounded-full border-2 px-3 py-1 font-display text-[10px] font-black uppercase ${
                live ? "border-white text-brand-charcoal" : "border-white bg-white text-brand-navy"
              }`}
              style={live ? { backgroundColor: accent, borderColor: accent } : undefined}
            >
              {live && <Radio className="h-3.5 w-3.5" aria-hidden="true" />}
              {status}
            </span>
            <ResultBadge ageGroup={match.ageGroup} accent={accent} />
          </div>
        </div>

        <div className="grid gap-2 text-sm font-bold text-white/80 sm:text-right">
          <span className="inline-flex items-center gap-2 sm:justify-end">
            <CalendarDays className="h-4 w-4" aria-hidden="true" style={{ color: accent }} />
            {formatDate(match.date)}
          </span>
          <span className="inline-flex items-center gap-2 sm:justify-end">
            <Clock3 className="h-4 w-4" aria-hidden="true" style={{ color: accent }} />
            {match.time}
          </span>
          <span className="inline-flex items-center gap-2 sm:justify-end">
            <MapPin className="h-4 w-4" aria-hidden="true" style={{ color: accent }} />
            {match.venue.name}
          </span>
        </div>
      </div>

      <div className="mt-6 grid items-center gap-4 sm:grid-cols-[1fr_auto_1fr]">
        <TeamIdentity teamName={match.homeTeam} accent={accent} />

        <div
          className="rounded-2xl border-4 border-white bg-white px-5 py-4 text-center text-brand-navy"
          style={{ boxShadow: `5px 5px 0 ${accent}` }}
        >
          {match.score ? (
            <div className="font-display text-5xl font-black leading-none tabular-nums tracking-tight">
              {match.score.home}
              <span className="mx-2 text-zinc-300">-</span>
              {match.score.away}
            </div>
          ) : (
            <div className="font-display text-3xl font-black uppercase text-zinc-400">
              vs
            </div>
          )}
        </div>

        <TeamIdentity teamName={match.awayTeam} align="right" accent={accent} />
      </div>
    </article>
  );
}

function SyncSkeleton({ accent }: { accent: string }) {
  return (
    <div className="grid gap-5">
      {[0, 1, 2].map((item) => (
        <div
          key={item}
          className="rounded-[2rem] border-4 border-white bg-brand-navy p-5"
          style={{ boxShadow: `6px 6px 0 ${accent}` }}
        >
          <div className="h-4 w-40 rounded-full bg-white/20" />
          <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_160px_1fr]">
            <div className="h-12 rounded-2xl bg-white/15" />
            <div className="h-16 rounded-2xl bg-white" />
            <div className="h-12 rounded-2xl bg-white/15" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ message, accent }: { message: string; accent: string }) {
  return (
    <div
      className="rounded-[2rem] border-4 border-white bg-white p-6 text-brand-navy"
      style={{ boxShadow: `6px 6px 0 ${accent}` }}
    >
      <p className="font-display text-xl font-black uppercase">{message}</p>
    </div>
  );
}

function DevelopmentNotice({
  divisions,
  accent,
}: {
  divisions: DevelopmentDivision[];
  accent: string;
}) {
  if (divisions.length === 0) return null;

  return (
    <aside
      className="rounded-[2rem] border-4 border-white bg-white p-5 text-brand-navy sm:p-6"
      style={{ boxShadow: `6px 6px 0 ${accent}` }}
    >
      <div className="flex items-start gap-3">
        <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-brand-green" aria-hidden="true" />
        <div>
          <h2 className="font-display text-xl font-black uppercase">
            Development brackets
          </h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-zinc-700">
            U7 to U11 tracks focus on player development and participation, so
            competitive league tables are not published for these age groups.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {divisions.map((division) => (
              <span
                key={division.competitionId}
                className="rounded-full border-2 border-brand-charcoal px-3 py-2 font-display text-[10px] font-black uppercase text-brand-charcoal"
                style={{ backgroundColor: accent }}
              >
                {division.competitionName}
              </span>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function MatchesPage() {
  const [selectedTheme, setSelectedTheme] = useState<KitTheme>("club");
  const [selectedSeason, setSelectedSeason] = useState<SeasonKey>("current");

  // Current-season data (from /api/fixtures/sync)
  const [syncData, setSyncData] = useState<SyncResponse | null>(null);
  const [syncLoading, setSyncLoading] = useState(true);
  const [syncError, setSyncError] = useState("");

  // Archived-season data (from /api/historical/standings)
  const [historicalData, setHistoricalData] = useState<HistoricalSeasonResponse | null>(null);
  const [historicalLoading, setHistoricalLoading] = useState(false);
  const [historicalError, setHistoricalError] = useState("");

  const [selectedDivisionKey, setSelectedDivisionKey] = useState<SelectedDivisionKey>("all");

  const accent = KIT_THEMES[selectedTheme].accent;
  const isArchived = selectedSeason === "archived";

  // Fetch current-season sync on mount
  useEffect(() => {
    let active = true;
    setSyncLoading(true);
    setSyncError("");

    fetch("/api/fixtures/sync", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("Fixture sync failed");
        return res.json() as Promise<SyncResponse>;
      })
      .then((payload) => {
        if (active) setSyncData(payload);
      })
      .catch(() => {
        if (active) setSyncError("Live match data is not available right now.");
      })
      .finally(() => {
        if (active) setSyncLoading(false);
      });

    return () => { active = false; };
  }, []);

  // Fetch archived season when user switches to it
  useEffect(() => {
    if (selectedSeason !== "archived") return;
    if (historicalData) return; // already loaded

    let active = true;
    setHistoricalLoading(true);
    setHistoricalError("");

    const option = SEASON_OPTIONS.find((o) => o.key === "archived")!;
    fetch(option.apiPath, { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("Historical standings unavailable");
        return res.json() as Promise<HistoricalSeasonResponse>;
      })
      .then((payload) => {
        if (active) setHistoricalData(payload);
      })
      .catch(() => {
        if (active) setHistoricalError("Historical standings are not available.");
      })
      .finally(() => {
        if (active) setHistoricalLoading(false);
      });

    return () => { active = false; };
  }, [selectedSeason, historicalData]);

  // Reset division filter when switching seasons
  function handleSeasonChange(key: SeasonKey) {
    setSelectedSeason(key);
    setSelectedDivisionKey("all");
  }

  // Division options depend on active season
  const divisionOptions = useMemo(() => {
    if (isArchived) {
      return buildHistoricalDivisionOptions(historicalData?.tables ?? []);
    }
    return buildDivisionOptions(syncData?.divisions ?? []);
  }, [isArchived, syncData, historicalData]);

  const selectedDivision =
    divisionOptions.find((o) => o.key === selectedDivisionKey) ?? divisionOptions[0];

  // Current-season filtered data
  const liveMatches = useMemo(() => {
    if (!syncData || isArchived) return [];
    return [...syncData.results, ...syncData.fixtures]
      .filter((m) => teamMatchesCompetition(m, selectedDivision))
      .sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));
  }, [syncData, selectedDivision, isArchived]);

  const visibleTables = useMemo(() => {
    if (isArchived) {
      return (historicalData?.tables ?? []).filter((t) =>
        tableMatchesCompetition(t, selectedDivision),
      );
    }
    return (syncData?.tables ?? []).filter((t) =>
      tableMatchesCompetition(t, selectedDivision),
    );
  }, [isArchived, syncData, historicalData, selectedDivision]);

  const visibleDevelopmentDivisions = useMemo(() => {
    if (!syncData || isArchived) return [];
    return syncData.developmentDivisions.filter((d) =>
      developmentMatchesCompetition(d, selectedDivision),
    );
  }, [syncData, selectedDivision, isArchived]);

  const loading = isArchived ? historicalLoading : syncLoading;
  const error = isArchived ? historicalError : syncError;

  const syncedLabel = isArchived
    ? (historicalData ? `Season ${historicalData.season}` : "Archived")
    : syncData
    ? `Updated ${formatDate(syncData.syncedAt.slice(0, 10))}`
    : "Connecting to the league feed.";

  const sourceLabel = isArchived
    ? (historicalData?.source === "db" ? "Archive" : "Empty")
    : syncData?.source === "live"
    ? "Live"
    : loading
    ? "Loading"
    : "Ready";

  return (
    <div className="min-h-screen bg-brand-navy text-white">
      <Header />

      <main>
        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="border-b-4 border-white bg-brand-navy">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-20">
            <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
              <div>
                <span
                  className="mb-5 inline-flex items-center gap-2 rounded-full border-3 border-white px-4 py-2 font-display text-xs font-black uppercase text-brand-charcoal shadow-[4px_4px_0_#FFFFFF]"
                  style={{ backgroundColor: accent }}
                >
                  <Trophy className="h-4 w-4" aria-hidden="true" />
                  {isArchived ? "Historical DDSL standings" : "Live DDSL league fixtures"}
                </span>
                <h1 className="font-display text-4xl font-black uppercase leading-none tracking-tight sm:text-5xl lg:text-7xl">
                  Matchday Hub.
                </h1>
                <p className="mt-5 max-w-3xl text-base font-semibold leading-relaxed text-white/85 sm:text-lg">
                  {isArchived
                    ? "Viewing archived season standings from the club database."
                    : "Select a discovered RVR division to view live fixtures, results, and league standings from the club feed."}
                </p>
              </div>

              <div
                className="rounded-[2rem] border-4 border-white bg-white p-5 text-brand-navy"
                style={{ boxShadow: `6px 6px 0 ${accent}` }}
              >
                <p className="font-display text-xs font-black uppercase text-brand-green">
                  Sync status
                </p>
                <p className="mt-2 font-display text-3xl font-black uppercase leading-none">
                  {sourceLabel}
                </p>
                <p className="mt-3 text-sm font-bold leading-6 text-zinc-700">
                  {syncedLabel}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Controls row ─────────────────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="flex flex-col gap-4">

            {/* Kit theme selector pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-display text-xs font-black uppercase tracking-wider text-white/60">
                Kit theme
              </span>
              {(Object.entries(KIT_THEMES) as [KitTheme, KitThemeConfig][]).map(
                ([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedTheme(key)}
                    className={`rounded-full border-3 px-4 py-1.5 font-display text-xs font-black uppercase transition-all ${
                      selectedTheme === key
                        ? "border-white text-brand-charcoal shadow-[3px_3px_0_#FFFFFF]"
                        : "border-white/30 text-white hover:border-white/70"
                    }`}
                    style={
                      selectedTheme === key
                        ? { backgroundColor: cfg.accent }
                        : undefined
                    }
                    aria-pressed={selectedTheme === key}
                  >
                    {cfg.label}
                  </button>
                ),
              )}
            </div>

            {/* Season + division row */}
            <div className="grid gap-3 sm:grid-cols-2">

              {/* Season dropdown */}
              <label
                className="grid gap-3 rounded-[2rem] border-4 border-white bg-brand-navy p-4"
                style={{ boxShadow: `6px 6px 0 ${accent}` }}
              >
                <span className="font-display text-xs font-black uppercase" style={{ color: accent }}>
                  Season
                </span>
                <span className="relative">
                  <select
                    value={selectedSeason}
                    onChange={(e) => handleSeasonChange(e.target.value as SeasonKey)}
                    className="min-h-14 w-full appearance-none rounded-2xl border-3 bg-brand-navy px-4 py-3 pr-12 font-display text-sm font-black uppercase text-white outline-none focus:ring-4 disabled:cursor-wait disabled:opacity-70"
                    style={{ borderColor: accent, boxShadow: `4px 4px 0 ${accent}` }}
                    aria-label="Select season"
                  >
                    {SEASON_OPTIONS.map((opt) => (
                      <option key={opt.key} value={opt.key}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2"
                    aria-hidden="true"
                    style={{ color: accent }}
                  />
                </span>
              </label>

              {/* Squad / division filter */}
              <label
                className="grid gap-3 rounded-[2rem] border-4 border-white bg-brand-navy p-4"
                style={{ boxShadow: `6px 6px 0 ${accent}` }}
              >
                <span className="font-display text-xs font-black uppercase" style={{ color: accent }}>
                  {isArchived ? "Division filter" : "Squad filter"}
                </span>
                <span className="relative">
                  <select
                    value={selectedDivisionKey}
                    onChange={(e) => setSelectedDivisionKey(e.target.value)}
                    disabled={loading || divisionOptions.length <= 1}
                    className="min-h-14 w-full appearance-none rounded-2xl border-3 bg-brand-navy px-4 py-3 pr-12 font-display text-sm font-black uppercase text-white outline-none focus:ring-4 disabled:cursor-wait disabled:opacity-70"
                    style={{ borderColor: accent, boxShadow: `4px 4px 0 ${accent}` }}
                    aria-label={isArchived ? "Filter by division" : "Filter matchday hub by RVR division"}
                  >
                    {divisionOptions.map((option) => (
                      <option key={option.key} value={option.key}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2"
                    aria-hidden="true"
                    style={{ color: accent }}
                  />
                </span>
              </label>
            </div>
          </div>
        </section>

        {/* ── Content ──────────────────────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:pb-16">
          {loading ? (
            <SyncSkeleton accent={accent} />
          ) : error ? (
            <EmptyState message={error} accent={accent} />
          ) : isArchived ? (
            /* ── Archived season view: tables only ─────────────────────────── */
            <div className="grid gap-6">
              <div className="flex items-center gap-2">
                <Table2 className="h-5 w-5" aria-hidden="true" style={{ color: accent }} />
                <h2 className="font-display text-2xl font-black uppercase">
                  Historical standings · {historicalData?.season}
                </h2>
              </div>
              {visibleTables.length > 0 ? (
                visibleTables.map((table) => (
                  <DDSLTableWidget
                    key={table.competitionId}
                    table={table}
                    accent={accent}
                  />
                ))
              ) : (
                <EmptyState
                  message="No archived standings available for this selection."
                  accent={accent}
                />
              )}
            </div>
          ) : (
            /* ── Current season view: fixtures + tables ────────────────────── */
            <div className="grid gap-8">
              <div className="grid gap-6">
                {liveMatches.length > 0 ? (
                  liveMatches.map((match) => (
                    <MatchCard key={match.id} match={match} accent={accent} />
                  ))
                ) : (
                  <EmptyState
                    message="No fixtures or results are available for this division."
                    accent={accent}
                  />
                )}
              </div>

              <div className="grid gap-6">
                <div className="flex items-center gap-2">
                  <Table2 className="h-5 w-5" aria-hidden="true" style={{ color: accent }} />
                  <h2 className="font-display text-2xl font-black uppercase">
                    League standings
                  </h2>
                </div>

                <DevelopmentNotice divisions={visibleDevelopmentDivisions} accent={accent} />

                {visibleTables.length > 0 ? (
                  visibleTables.map((table) => (
                    <DDSLTableWidget
                      key={table.competitionId}
                      table={table}
                      accent={accent}
                    />
                  ))
                ) : visibleDevelopmentDivisions.length === 0 ? (
                  <EmptyState
                    message="No league table is available for this division."
                    accent={accent}
                  />
                ) : null}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
