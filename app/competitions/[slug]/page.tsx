import { notFound } from "next/navigation";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { CompetitionState, FixtureStatus } from "@prisma/client";
import { CompetitionTabs } from "@/components/competitions/CompetitionTabs";
import { FixtureRow } from "@/components/competitions/FixtureRow";
import { StandingsTable } from "@/components/competitions/StandingsTable";
import { SquadCard } from "@/components/competitions/SquadCard";
import { computeStandings } from "@/lib/competitions/standings";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const competition = await prisma.competition.findFirst({
    where: { OR: [{ slug }, { publicSlug: slug }] },
    select: { name: true },
  });
  return { title: competition ? `${competition.name} | RVR Competitions` : "Competition Not Found" };
}

export default async function CompetitionPublicPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const tab = sp.tab ?? "now";

  const competition = await prisma.competition.findFirst({
    where: {
      OR: [{ slug }, { publicSlug: slug }],
      NOT: { state: CompetitionState.DRAFT },
    },
    include: {
      teams: {
        include: {
          players: { include: { playerPoolEntry: { select: { displayName: true } } } },
        },
        orderBy: { name: "asc" },
      },
      fixtures: {
        include: { homeTeam: true, awayTeam: true },
        orderBy: { scheduledAt: "asc" },
      },
    },
  });

  if (!competition) notFound();

  if (competition.state === CompetitionState.READY) {
    return (
      <div className="min-h-screen bg-brand-navy flex flex-col items-center justify-center px-4 text-center">
        <h1 className="font-display font-black italic text-5xl text-brand-neon uppercase mb-4">
          {competition.name}
        </h1>
        <p className="text-brand-sky text-lg font-semibold mb-2">Coming Soon</p>
        {competition.dates[0] && (
          <p className="text-brand-sky/60 text-sm">
            {new Date(competition.dates[0]).toLocaleDateString("en-IE", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        )}
        <div className="mt-6 h-1 w-24 bg-brand-neon" />
      </div>
    );
  }

  const teamNames: Record<string, string> = {};
  for (const t of competition.teams) teamNames[t.id] = t.name;

  const standings = computeStandings(competition.fixtures, competition.teams.map((t) => t.id), teamNames);
  const liveFixture = competition.fixtures.find((f) => f.status === FixtureStatus.LIVE);
  const nextFixture = competition.fixtures.find(
    (f) => f.status === FixtureStatus.SCHEDULED && f.scheduledAt && f.scheduledAt > new Date(),
  );
  const lastResult = [...competition.fixtures].reverse().find((f) => f.status === FixtureStatus.COMPLETE);

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Hero */}
      <div className="bg-brand-navy py-8 px-4 border-b-3 border-brand-charcoal">
        <div className="max-w-4xl mx-auto">
          <p className="font-mono text-xs uppercase tracking-widest text-brand-sky/60 mb-1">
            {competition.type.replace("_", " ")} · {competition.ageGroup}
          </p>
          <h1 className="font-display font-black italic text-4xl md:text-5xl uppercase text-brand-neon leading-none">
            {competition.name}
          </h1>
          {competition.state === CompetitionState.LIVE && (
            <span className="mt-3 inline-block bg-brand-neon text-brand-charcoal text-xs font-black uppercase px-3 py-1 animate-pulse">
              Live
            </span>
          )}
        </div>
      </div>

      {/* Tab nav */}
      <Suspense>
        <CompetitionTabs slug={slug} />
      </Suspense>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {tab === "now" && (
          <div className="space-y-4">
            {liveFixture && (
              <div className="border-3 border-brand-neon bg-brand-neon/5 p-4 shadow-brutalist">
                <p className="font-mono text-xs uppercase text-brand-neon mb-2 font-black">Live Now</p>
                <FixtureRow fixture={liveFixture} />
              </div>
            )}
            {nextFixture && (
              <div className="border-3 border-brand-navy/20 bg-white p-4">
                <p className="font-mono text-xs uppercase text-zinc-400 mb-2">Next Up</p>
                <FixtureRow fixture={nextFixture} />
              </div>
            )}
            {lastResult && (
              <div className="border-3 border-brand-navy/20 bg-white p-4">
                <p className="font-mono text-xs uppercase text-zinc-400 mb-2">Last Result</p>
                <FixtureRow fixture={lastResult} />
              </div>
            )}
            {!liveFixture && !nextFixture && !lastResult && (
              <p className="text-zinc-400 text-sm text-center py-8">No fixtures yet.</p>
            )}
          </div>
        )}

        {tab === "fixtures" && (
          <div className="border-3 border-brand-charcoal bg-white shadow-brutalist p-4">
            {competition.fixtures.length === 0 ? (
              <p className="text-zinc-400 text-sm text-center py-8">No fixtures yet.</p>
            ) : (
              competition.fixtures.map((f) => <FixtureRow key={f.id} fixture={f} />)
            )}
          </div>
        )}

        {tab === "standings" && (
          <div className="border-3 border-brand-charcoal bg-white shadow-brutalist p-4">
            <StandingsTable rows={standings} />
          </div>
        )}

        {tab === "teams" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {competition.teams.map((team) => (
              <SquadCard
                key={team.id}
                team={{
                  ...team,
                  players: team.players.map((p) => ({
                    ...p,
                    playerPoolEntry: {
                      ...p.playerPoolEntry,
                      displayName: p.playerPoolEntry.displayName,
                    } as Parameters<typeof SquadCard>[0]["team"]["players"][0]["playerPoolEntry"],
                  })),
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
