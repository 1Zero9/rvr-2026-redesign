import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireEventAdmin } from "@/lib/competitions/auth-helpers";
import { CompetitionAdminShell } from "@/components/competitions/CompetitionAdminShell";
import { TeamGrid } from "@/components/competitions/TeamGrid";
import { distributeToTeams, suggestTeamCount } from "@/lib/competitions/randomiser";
import { getThemeNames } from "@/lib/competitions/theme-pools";
import { createId } from "@paralleldrive/cuid2";

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
  const playerCount = await prisma.playerPoolEntry.count({ where: { competitionId: id } });

  async function generateTeams() {
    "use server";
    const comp = await prisma.competition.findUnique({
      where: { id },
      include: { playerPool: { where: { status: "UNASSIGNED" } } },
    });
    if (!comp) return;

    const players = comp.playerPool;
    const teamCount = suggestTeamCount(players.length);
    const themeNames = getThemeNames(comp.teamTheme, comp.customThemeNames, teamCount);
    const distributed = distributeToTeams(players, teamCount);

    await prisma.$transaction(async (tx) => {
      await tx.teamPlayer.deleteMany({ where: { team: { competitionId: id } } });
      await tx.competitionTeam.deleteMany({ where: { competitionId: id } });
      for (let i = 0; i < teamCount; i++) {
        const teamId = createId();
        await tx.competitionTeam.create({
          data: { id: teamId, competitionId: id, name: themeNames[i] ?? `Team ${i + 1}`, themeName: themeNames[i] ?? `Team ${i + 1}` },
        });
        const group = distributed[i] ?? [];
        if (group.length > 0) {
          await tx.teamPlayer.createMany({
            data: group.map((p) => ({ id: createId(), teamId, playerPoolEntryId: p.id })),
          });
          await tx.playerPoolEntry.updateMany({
            where: { id: { in: group.map((p) => p.id) } },
            data: { status: "ACTIVE" },
          });
        }
      }
    });
    redirect(`/competitions/admin/${id}/teams`);
  }

  return (
    <CompetitionAdminShell nav={nav} title="Teams">
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <p className="text-sm text-zinc-500">
            {competition.teams.length} teams · {totalPlayers} players assigned
          </p>
          <div className="flex gap-2 flex-wrap">
            <form action={generateTeams}>
              <button
                type="submit"
                disabled={playerCount === 0}
                className="min-h-[44px] px-5 bg-brand-navy text-brand-neon font-display font-black italic uppercase text-sm border-3 border-brand-charcoal shadow-brutalist hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Auto-Generate Teams
              </button>
            </form>
          </div>
        </div>

        {playerCount === 0 && (
          <div className="bg-brand-sky/10 border border-brand-sky/30 px-4 py-3 text-sm text-brand-navy">
            Upload players first, then auto-generate teams.
          </div>
        )}

        {competition.teams.length === 0 && playerCount > 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-brand-navy/20">
            <p className="text-zinc-400 text-sm">No teams yet.</p>
            <p className="text-zinc-400 text-xs mt-1">{playerCount} players in pool — click Auto-Generate Teams.</p>
          </div>
        ) : competition.teams.length > 0 ? (
          <TeamGrid teams={competition.teams} />
        ) : null}

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
