import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireEventAdmin } from "@/lib/competitions/auth-helpers";
import { CompetitionAdminShell } from "@/components/competitions/CompetitionAdminShell";
import { GlobalRole, CompetitionState } from "@prisma/client";

export const metadata = { title: "Competition Dashboard | RVR Admin" };

export default async function CompetitionDashboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireEventAdmin(id);

  const competition = await prisma.competition.findUnique({
    where: { id },
    include: {
      venues: true,
      _count: { select: { teams: true, playerPool: true, fixtures: true } },
    },
  });
  if (!competition) notFound();

  const nav = [
    { href: `/competitions/admin/${id}`, label: "Overview" },
    { href: `/competitions/admin/${id}/players`, label: "Players" },
    { href: `/competitions/admin/${id}/teams`, label: "Teams" },
    { href: `/competitions/admin/${id}/fixtures`, label: "Fixtures" },
    { href: `/competitions/admin/${id}/results`, label: "Results" },
    { href: "/competitions/admin", label: "← All Competitions" },
  ];

  const isSuperAdmin = user.globalRole === GlobalRole.SUPER_ADMIN;

  return (
    <CompetitionAdminShell nav={nav}>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-zinc-400 mb-1">
              {competition.type.replace("_", " ")} · {competition.ageGroup}
            </p>
            <h1 className="font-display font-black italic text-3xl uppercase text-brand-navy">
              {competition.name}
            </h1>
          </div>
          <span className={`shrink-0 text-xs font-black uppercase px-3 py-1 ${
            competition.state === CompetitionState.LIVE
              ? "bg-brand-neon text-brand-charcoal"
              : competition.state === CompetitionState.DRAFT
              ? "bg-zinc-300 text-zinc-700"
              : "bg-brand-green text-white"
          }`}>
            {competition.state}
          </span>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Teams", value: competition._count.teams, href: `/competitions/admin/${id}/teams` },
            { label: "Players", value: competition._count.playerPool, href: `/competitions/admin/${id}/players` },
            { label: "Fixtures", value: competition._count.fixtures, href: `/competitions/admin/${id}/fixtures` },
          ].map((s) => (
            <Link
              key={s.label}
              href={s.href}
              className="border-3 border-brand-charcoal bg-white shadow-brutalist p-4 text-center hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
              <p className="font-display font-black italic text-3xl text-brand-navy">{s.value}</p>
              <p className="font-mono text-xs uppercase text-zinc-400">{s.label}</p>
            </Link>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link href={`/competitions/admin/${id}/players`} className="block border-2 border-brand-navy/20 bg-white p-4 hover:border-brand-neon transition-colors min-h-[44px]">
            <p className="font-bold text-brand-navy">Manage Players</p>
            <p className="text-xs text-zinc-400">Upload, review, and assign players to teams</p>
          </Link>
          <Link href={`/competitions/admin/${id}/teams`} className="block border-2 border-brand-navy/20 bg-white p-4 hover:border-brand-neon transition-colors min-h-[44px]">
            <p className="font-bold text-brand-navy">Manage Teams</p>
            <p className="text-xs text-zinc-400">Generate teams, swap players, download squad cards</p>
          </Link>
          <Link href={`/competitions/admin/${id}/fixtures`} className="block border-2 border-brand-navy/20 bg-white p-4 hover:border-brand-neon transition-colors min-h-[44px]">
            <p className="font-bold text-brand-navy">Fixtures</p>
            <p className="text-xs text-zinc-400">Generate and manage the schedule</p>
          </Link>
          <Link href={`/competitions/admin/${id}/results`} className="block border-2 border-brand-navy/20 bg-white p-4 hover:border-brand-neon transition-colors min-h-[44px]">
            <p className="font-bold text-brand-navy">Enter Results</p>
            <p className="text-xs text-zinc-400">Update scores and standings</p>
          </Link>
        </div>

        {competition.publicSlug && (
          <div className="border-2 border-brand-neon/30 bg-brand-neon/5 p-4">
            <p className="text-xs font-mono uppercase text-brand-navy/60 mb-1">Public View</p>
            <a
              href={`/competitions/${competition.publicSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-navy font-bold text-sm hover:text-brand-neon"
            >
              /competitions/{competition.publicSlug} →
            </a>
          </div>
        )}

        {isSuperAdmin && (
          <div className="border-t border-brand-navy/10 pt-4">
            <p className="text-xs font-mono uppercase text-zinc-400 mb-3">Admin Actions</p>
            <div className="flex gap-2 flex-wrap">
              <StateButton id={id} currentState={competition.state} />
            </div>
          </div>
        )}
      </div>
    </CompetitionAdminShell>
  );
}

function StateButton({ id, currentState }: { id: string; currentState: CompetitionState }) {
  const next: Record<CompetitionState, { label: string; state: CompetitionState } | null> = {
    DRAFT: { label: "Mark Ready", state: CompetitionState.READY },
    READY: { label: "Go Live", state: CompetitionState.LIVE },
    LIVE: { label: "Mark Complete", state: CompetitionState.COMPLETE },
    COMPLETE: { label: "Archive", state: CompetitionState.ARCHIVED },
    ARCHIVED: null,
  };
  const action = next[currentState];
  if (!action) return null;

  return (
    <form
      action={async () => {
        "use server";
        await prisma.competition.update({
          where: { id },
          data: { state: action.state },
        });
      }}
    >
      <button
        type="submit"
        className="min-h-[44px] px-5 bg-brand-navy text-brand-neon font-bold text-sm border-3 border-brand-charcoal shadow-brutalist hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
      >
        {action.label}
      </button>
    </form>
  );
}
