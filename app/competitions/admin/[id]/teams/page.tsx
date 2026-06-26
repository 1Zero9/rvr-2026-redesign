import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireEventAdmin } from "@/lib/competitions/auth-helpers";
import { CompetitionAdminShell } from "@/components/competitions/CompetitionAdminShell";
import { TeamGrid } from "@/components/competitions/TeamGrid";

export const metadata = { title: "Teams | RVR Competitions" };

export default async function TeamsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireEventAdmin(id);

  const competition = await prisma.competition.findUnique({
    where: { id },
    include: {
      teams: {
        include: {
          players: { include: { playerPoolEntry: true } },
        },
        orderBy: { name: "asc" },
      },
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

  const totalPlayers = competition.teams.reduce((s, t) => s + t.players.length, 0);

  return (
    <CompetitionAdminShell nav={nav} title="Teams">
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <p className="text-sm text-zinc-500">
            {competition.teams.length} teams · {totalPlayers} players assigned
          </p>
          <div className="flex gap-2 flex-wrap">
            <form
              action={async () => {
                "use server";
                const res = await fetch(
                  `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/api/competitions/${id}/teams/generate`,
                  { method: "POST" },
                );
                if (!res.ok) throw new Error("Generate failed");
              }}
            >
              <button
                type="submit"
                className="min-h-[44px] px-5 bg-brand-navy text-brand-neon font-display font-black italic uppercase text-sm border-3 border-brand-charcoal shadow-brutalist hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
              >
                Auto-Generate Teams
              </button>
            </form>
          </div>
        </div>

        {competition.teams.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-brand-navy/20">
            <p className="text-zinc-400 text-sm">No teams yet.</p>
            <p className="text-zinc-400 text-xs mt-1">Upload players first, then auto-generate teams.</p>
          </div>
        ) : (
          <TeamGrid teams={competition.teams} />
        )}

        {competition.teams.length > 0 && (
          <div className="pt-4 border-t border-brand-navy/10">
            <p className="text-xs font-mono uppercase text-zinc-400 mb-3">Squad Cards</p>
            <div className="flex flex-wrap gap-2">
              {competition.teams.map((team) => (
                <Link
                  key={team.id}
                  href={`/api/competitions/${id}/squad-card/${team.id}`}
                  target="_blank"
                  className="min-h-[44px] px-3 flex items-center text-xs font-bold border-2 border-brand-navy/30 hover:border-brand-neon transition-colors"
                >
                  {team.name} card ↗
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </CompetitionAdminShell>
  );
}
