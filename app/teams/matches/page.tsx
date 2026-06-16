import type { Metadata } from "next";
import Header from "@/components/Header";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Radio,
  ShieldCheck,
  Trophy,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Live Match Results | Rivervalley Rangers AFC",
  description:
    "Public live match results dashboard for Rivervalley Rangers AFC DDSL league fixtures.",
};

type MatchStatus = "FT" | "Live" | "Scheduled";
type AgeGroup = `U${number}` | "Senior";

interface TeamDisplay {
  name: string;
  crestLabel: string;
}

interface MatchResult {
  id: string;
  divisionTag: string;
  ageGroup: AgeGroup;
  status: MatchStatus;
  homeTeam: TeamDisplay;
  awayTeam: TeamDisplay;
  homeScore: number | null;
  awayScore: number | null;
  matchDate: string;
  kickoffTime: string;
  venue: string;
}

const matches: MatchResult[] = [
  {
    id: "rvr-u8-green-live",
    divisionTag: "DDSL U8 Mixed Blitz",
    ageGroup: "U8",
    status: "Live",
    homeTeam: {
      name: "Rivervalley Rangers U8 Green",
      crestLabel: "RVR",
    },
    awayTeam: {
      name: "Swords Celtic U8",
      crestLabel: "SC",
    },
    homeScore: 2,
    awayScore: 1,
    matchDate: "2026-06-20",
    kickoffTime: "09:30",
    venue: "Ward Astro",
  },
  {
    id: "rvr-u10-hoops-ft",
    divisionTag: "DDSL U10 Boys Division 1",
    ageGroup: "U10",
    status: "FT",
    homeTeam: {
      name: "Malahide United U10",
      crestLabel: "MU",
    },
    awayTeam: {
      name: "Rivervalley Rangers U10 Hoops",
      crestLabel: "RVR",
    },
    homeScore: 3,
    awayScore: 3,
    matchDate: "2026-06-20",
    kickoffTime: "10:45",
    venue: "Ridgewood Park",
  },
  {
    id: "rvr-u12-girls-ft",
    divisionTag: "DDSL U12 Girls Division 2",
    ageGroup: "U12",
    status: "FT",
    homeTeam: {
      name: "Rivervalley Rangers U12 Girls",
      crestLabel: "RVR",
    },
    awayTeam: {
      name: "Portmarnock AFC U12 Girls",
      crestLabel: "PA",
    },
    homeScore: 4,
    awayScore: 2,
    matchDate: "2026-06-21",
    kickoffTime: "11:15",
    venue: "Rathingle",
  },
  {
    id: "rvr-u15-premier-ft",
    divisionTag: "DDSL U15 Premier",
    ageGroup: "U15",
    status: "FT",
    homeTeam: {
      name: "Rivervalley Rangers U15",
      crestLabel: "RVR",
    },
    awayTeam: {
      name: "Baldoyle United U15",
      crestLabel: "BU",
    },
    homeScore: 3,
    awayScore: 1,
    matchDate: "2026-06-22",
    kickoffTime: "19:15",
    venue: "Ward Astro",
  },
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IE", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(`${value}T00:00:00`));
}

function getAgeNumber(ageGroup: AgeGroup) {
  if (ageGroup === "Senior") return 99;
  return Number(ageGroup.replace("U", ""));
}

function isDevelopmentBracket(ageGroup: AgeGroup) {
  const age = getAgeNumber(ageGroup);
  return age >= 7 && age <= 11;
}

function TeamIdentity({
  team,
  align = "left",
}: {
  team: TeamDisplay;
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
          {team.name}
        </p>
      )}
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-3 border-white bg-brand-neon font-display text-xs font-black text-brand-charcoal shadow-[3px_3px_0_#FFFFFF]">
        {team.crestLabel}
      </span>
      {align === "left" && (
        <p className="min-w-0 flex-1 truncate font-display text-sm font-black uppercase text-white sm:text-base">
          {team.name}
        </p>
      )}
    </div>
  );
}

function ResultBadge({ match }: { match: MatchResult }) {
  const development = isDevelopmentBracket(match.ageGroup);

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

function MatchCard({ match }: { match: MatchResult }) {
  const hasScore = match.homeScore !== null && match.awayScore !== null;

  return (
    <article className="rounded-[2rem] border-4 border-white bg-brand-navy p-5 text-white shadow-[6px_6px_0_#85E320] sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-display text-xs font-black uppercase text-brand-neon">
            {match.divisionTag}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-2 rounded-full border-2 px-3 py-1 font-display text-[10px] font-black uppercase ${
                match.status === "Live"
                  ? "border-brand-neon bg-brand-neon text-brand-charcoal"
                  : "border-white bg-white text-brand-navy"
              }`}
            >
              {match.status === "Live" && (
                <Radio className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {match.status}
            </span>
            <ResultBadge match={match} />
          </div>
        </div>

        <div className="grid gap-2 text-sm font-bold text-white/80 sm:text-right">
          <span className="inline-flex items-center gap-2 sm:justify-end">
            <CalendarDays className="h-4 w-4 text-brand-neon" aria-hidden="true" />
            {formatDate(match.matchDate)}
          </span>
          <span className="inline-flex items-center gap-2 sm:justify-end">
            <Clock3 className="h-4 w-4 text-brand-neon" aria-hidden="true" />
            {match.kickoffTime}
          </span>
          <span className="inline-flex items-center gap-2 sm:justify-end">
            <MapPin className="h-4 w-4 text-brand-neon" aria-hidden="true" />
            {match.venue}
          </span>
        </div>
      </div>

      <div className="mt-6 grid items-center gap-4 sm:grid-cols-[1fr_auto_1fr]">
        <TeamIdentity team={match.homeTeam} />

        <div className="rounded-2xl border-4 border-white bg-white px-5 py-4 text-center text-brand-navy shadow-[5px_5px_0_#85E320]">
          {hasScore ? (
            <div className="font-display text-5xl font-black leading-none tabular-nums tracking-tight">
              {match.homeScore}
              <span className="mx-2 text-zinc-300">-</span>
              {match.awayScore}
            </div>
          ) : (
            <div className="font-display text-3xl font-black uppercase text-zinc-400">
              vs
            </div>
          )}
        </div>

        <TeamIdentity team={match.awayTeam} align="right" />
      </div>
    </article>
  );
}

export default function MatchesPage() {
  const liveCount = matches.filter((match) => match.status === "Live").length;
  const completedCount = matches.filter((match) => match.status === "FT").length;

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
                  Match results dashboard.
                </h1>
                <p className="mt-5 max-w-3xl text-base font-semibold leading-relaxed text-white/85 sm:text-lg">
                  Follow active fixtures, completed scores, and age-band result
                  indicators for Rivervalley Rangers AFC teams.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border-4 border-white bg-white p-4 text-brand-navy shadow-[5px_5px_0_#85E320]">
                  <p className="font-display text-xs font-black uppercase text-brand-green">
                    Live
                  </p>
                  <p className="mt-2 font-display text-4xl font-black leading-none">
                    {liveCount}
                  </p>
                </div>
                <div className="rounded-2xl border-4 border-white bg-brand-neon p-4 text-brand-charcoal shadow-[5px_5px_0_#FFFFFF]">
                  <p className="font-display text-xs font-black uppercase">
                    Final
                  </p>
                  <p className="mt-2 font-display text-4xl font-black leading-none">
                    {completedCount}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
          <div className="grid gap-6">
            {matches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </section>

        <section className="border-t-4 border-white bg-brand-navy px-4 pb-12 sm:px-6 lg:pb-16">
          <div className="mx-auto max-w-6xl rounded-[2rem] border-4 border-white bg-white p-5 text-brand-navy shadow-[6px_6px_0_#85E320] sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-brand-green" aria-hidden="true" />
                <div>
                  <h2 className="font-display text-xl font-black uppercase">
                    Result labels
                  </h2>
                  <p className="mt-1 text-sm font-semibold leading-6 text-zinc-700">
                    U7 to U11 fixtures show Development Bracket. U12 and older
                    competitive fixtures show Official DDSL Result.
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center justify-center rounded-full border-3 border-brand-charcoal bg-brand-neon px-5 py-3 font-display text-xs font-black uppercase text-brand-charcoal shadow-[4px_4px_0_#121212]">
                Updated match feed
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
