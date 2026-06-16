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
import type {
  AgeGroup,
  DevelopmentDivision,
  DiscoveredDivision,
  LeagueTable,
  NormalisedMatch,
  SyncResponse,
} from "@/lib/ddsl/types";

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
  if (/rivervalley\s+rangers|(?<![a-z])rvr(?![a-z])/i.test(teamName)) {
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

function TeamIdentity({
  teamName,
  align = "left",
}: {
  teamName: string;
  align?: "left" | "right";
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
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-3 border-white bg-brand-neon font-display text-xs font-black text-brand-charcoal shadow-[3px_3px_0_#FFFFFF]">
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

function ResultBadge({ ageGroup }: { ageGroup: AgeGroup }) {
  const development = isDevelopmentAge(ageGroup);

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border-2 px-3 py-1 font-display text-[10px] font-black uppercase ${
        development
          ? "border-white bg-brand-navy text-white"
          : "border-brand-charcoal bg-brand-neon text-brand-charcoal"
      }`}
    >
      {development ? "Development Bracket" : "Official DDSL Result"}
    </span>
  );
}

function MatchCard({ match }: { match: NormalisedMatch }) {
  const status = formatStatus(match.status);
  const live = match.status === "live";

  return (
    <article className="rounded-[2rem] border-4 border-white bg-brand-navy p-5 text-white shadow-[6px_6px_0_#85E320] sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-display text-xs font-black uppercase text-brand-neon">
            {match.competition}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-2 rounded-full border-2 px-3 py-1 font-display text-[10px] font-black uppercase ${
                live
                  ? "border-brand-neon bg-brand-neon text-brand-charcoal"
                  : "border-white bg-white text-brand-navy"
              }`}
            >
              {live && <Radio className="h-3.5 w-3.5" aria-hidden="true" />}
              {status}
            </span>
            <ResultBadge ageGroup={match.ageGroup} />
          </div>
        </div>

        <div className="grid gap-2 text-sm font-bold text-white/80 sm:text-right">
          <span className="inline-flex items-center gap-2 sm:justify-end">
            <CalendarDays className="h-4 w-4 text-brand-neon" aria-hidden="true" />
            {formatDate(match.date)}
          </span>
          <span className="inline-flex items-center gap-2 sm:justify-end">
            <Clock3 className="h-4 w-4 text-brand-neon" aria-hidden="true" />
            {match.time}
          </span>
          <span className="inline-flex items-center gap-2 sm:justify-end">
            <MapPin className="h-4 w-4 text-brand-neon" aria-hidden="true" />
            {match.venue.name}
          </span>
        </div>
      </div>

      <div className="mt-6 grid items-center gap-4 sm:grid-cols-[1fr_auto_1fr]">
        <TeamIdentity teamName={match.homeTeam} />

        <div className="rounded-2xl border-4 border-white bg-white px-5 py-4 text-center text-brand-navy shadow-[5px_5px_0_#85E320]">
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

        <TeamIdentity teamName={match.awayTeam} align="right" />
      </div>
    </article>
  );
}

function SyncSkeleton() {
  return (
    <div className="grid gap-5">
      {[0, 1, 2].map((item) => (
        <div
          key={item}
          className="rounded-[2rem] border-4 border-white bg-brand-navy p-5 shadow-[6px_6px_0_#85E320]"
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

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-[2rem] border-4 border-white bg-white p-6 text-brand-navy shadow-[6px_6px_0_#85E320]">
      <p className="font-display text-xl font-black uppercase">{message}</p>
    </div>
  );
}

function DevelopmentNotice({
  divisions,
}: {
  divisions: DevelopmentDivision[];
}) {
  if (divisions.length === 0) return null;

  return (
    <aside className="rounded-[2rem] border-4 border-white bg-white p-5 text-brand-navy shadow-[6px_6px_0_#85E320] sm:p-6">
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
                className="rounded-full border-2 border-brand-charcoal bg-brand-neon px-3 py-2 font-display text-[10px] font-black uppercase text-brand-charcoal"
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

export default function MatchesPage() {
  const [syncData, setSyncData] = useState<SyncResponse | null>(null);
  const [selectedDivisionKey, setSelectedDivisionKey] =
    useState<SelectedDivisionKey>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadFixtureSync() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("/api/fixtures/sync", {
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Fixture sync failed");
        const payload = (await response.json()) as SyncResponse;

        if (active) {
          setSyncData(payload);
          setSelectedDivisionKey("all");
        }
      } catch {
        if (active) {
          setError("Live match data is not available right now.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadFixtureSync();

    return () => {
      active = false;
    };
  }, []);

  const divisionOptions = useMemo(
    () => buildDivisionOptions(syncData?.divisions ?? []),
    [syncData],
  );

  const selectedDivision =
    divisionOptions.find((option) => option.key === selectedDivisionKey) ??
    divisionOptions[0];

  const liveMatches = useMemo(() => {
    if (!syncData) return [];
    return [...syncData.results, ...syncData.fixtures]
      .filter((match) => teamMatchesCompetition(match, selectedDivision))
      .sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));
  }, [selectedDivision, syncData]);

  const visibleTables = useMemo(() => {
    if (!syncData) return [];
    return syncData.tables.filter((table) =>
      tableMatchesCompetition(table, selectedDivision),
    );
  }, [selectedDivision, syncData]);

  const visibleDevelopmentDivisions = useMemo(() => {
    if (!syncData) return [];
    return syncData.developmentDivisions.filter((division) =>
      developmentMatchesCompetition(division, selectedDivision),
    );
  }, [selectedDivision, syncData]);

  return (
    <div className="min-h-screen bg-brand-navy text-white">
      <Header />

      <main>
        <section className="border-b-4 border-white bg-brand-navy">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-20">
            <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
              <div>
                <span className="mb-5 inline-flex items-center gap-2 rounded-full border-3 border-white bg-brand-neon px-4 py-2 font-display text-xs font-black uppercase text-brand-charcoal shadow-[4px_4px_0_#FFFFFF]">
                  <Trophy className="h-4 w-4" aria-hidden="true" />
                  Live DDSL league fixtures
                </span>
                <h1 className="font-display text-4xl font-black uppercase leading-none tracking-tight sm:text-5xl lg:text-7xl">
                  Matchday Hub.
                </h1>
                <p className="mt-5 max-w-3xl text-base font-semibold leading-relaxed text-white/85 sm:text-lg">
                  Select a discovered RVR division to view live fixtures,
                  results, and league standings from the club feed.
                </p>
              </div>

              <div className="rounded-[2rem] border-4 border-white bg-white p-5 text-brand-navy shadow-[6px_6px_0_#85E320]">
                <p className="font-display text-xs font-black uppercase text-brand-green">
                  Sync status
                </p>
                <p className="mt-2 font-display text-3xl font-black uppercase leading-none">
                  {loading ? "Loading" : syncData?.source === "live" ? "Live" : "Ready"}
                </p>
                <p className="mt-3 text-sm font-bold leading-6 text-zinc-700">
                  {syncData
                    ? `Updated ${formatDate(syncData.syncedAt.slice(0, 10))}`
                    : "Connecting to the league feed."}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <label className="grid gap-3 rounded-[2rem] border-4 border-white bg-brand-navy p-4 shadow-[6px_6px_0_#85E320]">
            <span className="font-display text-xs font-black uppercase text-brand-neon">
              Squad filter
            </span>
            <span className="relative">
              <select
                value={selectedDivisionKey}
                onChange={(event) => setSelectedDivisionKey(event.target.value)}
                disabled={loading || divisionOptions.length <= 1}
                className="min-h-14 w-full appearance-none rounded-2xl border-3 border-brand-neon bg-brand-navy px-4 py-3 pr-12 font-display text-sm font-black uppercase text-white outline-none shadow-[4px_4px_0_#85E320] focus:ring-4 focus:ring-brand-neon disabled:cursor-wait disabled:opacity-70"
                aria-label="Filter matchday hub by RVR division"
              >
                {divisionOptions.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-neon"
                aria-hidden="true"
              />
            </span>
          </label>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:pb-16">
          {loading ? (
            <SyncSkeleton />
          ) : error ? (
            <EmptyState message={error} />
          ) : (
            <div className="grid gap-8">
              <div className="grid gap-6">
                {liveMatches.length > 0 ? (
                  liveMatches.map((match) => (
                    <MatchCard key={match.id} match={match} />
                  ))
                ) : (
                  <EmptyState message="No fixtures or results are available for this division." />
                )}
              </div>

              <div className="grid gap-6">
                <div className="flex items-center gap-2">
                  <Table2 className="h-5 w-5 text-brand-neon" aria-hidden="true" />
                  <h2 className="font-display text-2xl font-black uppercase">
                    League standings
                  </h2>
                </div>

                <DevelopmentNotice divisions={visibleDevelopmentDivisions} />

                {visibleTables.length > 0 ? (
                  visibleTables.map((table) => (
                    <DDSLTableWidget key={table.competitionId} table={table} />
                  ))
                ) : visibleDevelopmentDivisions.length === 0 ? (
                  <EmptyState message="No league table is available for this division." />
                ) : null}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
