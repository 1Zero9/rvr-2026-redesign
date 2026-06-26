import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { shufflePlayers, distributeToTeams, suggestTeamCount } from "@/lib/competitions/randomiser";
import { getThemeNames } from "@/lib/competitions/theme-pools";
import { GlobalRole, AssignmentRole } from "@prisma/client";
import { createId } from "@paralleldrive/cuid2";

async function canAccess(userId: string, globalRole: GlobalRole | null, competitionId: string) {
  if (globalRole === GlobalRole.SUPER_ADMIN) return true;
  const a = await prisma.competitionAssignment.findFirst({
    where: { adminUserId: userId, competitionId, role: AssignmentRole.EVENT_ADMIN },
  });
  return !!a;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (!await canAccess(session.user.id, session.user.globalRole, id)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const competition = await prisma.competition.findUnique({
    where: { id },
    include: { playerPool: { where: { status: "UNASSIGNED" } } },
  });
  if (!competition) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json().catch(() => ({})) as { teamCount?: number };
  const teamCount = body.teamCount ?? suggestTeamCount(competition.playerPool.length);

  const themeNames = getThemeNames(competition.teamTheme, competition.customThemeNames, teamCount);
  const distributed = distributeToTeams(competition.playerPool, teamCount);

  // Delete existing teams and reassign
  await prisma.$transaction(async (tx) => {
    await tx.teamPlayer.deleteMany({ where: { team: { competitionId: id } } });
    await tx.competitionTeam.deleteMany({ where: { competitionId: id } });

    for (let i = 0; i < teamCount; i++) {
      const teamId = createId();
      await tx.competitionTeam.create({
        data: {
          id: teamId,
          competitionId: id,
          name: themeNames[i] ?? `Team ${i + 1}`,
          themeName: themeNames[i] ?? `Team ${i + 1}`,
        },
      });

      const players = distributed[i] ?? [];
      if (players.length > 0) {
        await tx.teamPlayer.createMany({
          data: players.map((p) => ({
            id: createId(),
            teamId,
            playerPoolEntryId: p.id,
            assignedById: session.user.id,
          })),
        });
        await tx.playerPoolEntry.updateMany({
          where: { id: { in: players.map((p) => p.id) } },
          data: { status: "ACTIVE" },
        });
      }
    }
  });

  return NextResponse.json({ teams: teamCount });
}
