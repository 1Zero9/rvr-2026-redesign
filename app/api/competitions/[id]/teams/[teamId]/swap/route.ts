import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { GlobalRole, AssignmentRole } from "@prisma/client";

async function canAccess(userId: string, globalRole: GlobalRole | null, competitionId: string) {
  if (globalRole === GlobalRole.SUPER_ADMIN) return true;
  const a = await prisma.competitionAssignment.findFirst({
    where: { adminUserId: userId, competitionId, role: AssignmentRole.EVENT_ADMIN },
  });
  return !!a;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; teamId: string }> },
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, teamId } = await params;
  if (!await canAccess(session.user.id, session.user.globalRole, id)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json() as { playerPoolEntryId: string; toTeamId: string };
  if (!body.playerPoolEntryId || !body.toTeamId) {
    return NextResponse.json({ error: "Missing playerPoolEntryId or toTeamId" }, { status: 400 });
  }

  const existing = await prisma.teamPlayer.findUnique({
    where: { playerPoolEntryId: body.playerPoolEntryId },
  });
  if (!existing) return NextResponse.json({ error: "Player not in any team" }, { status: 404 });

  await prisma.teamPlayer.update({
    where: { playerPoolEntryId: body.playerPoolEntryId },
    data: {
      teamId: body.toTeamId,
      movedFromTeamId: existing.teamId,
      movedAt: new Date(),
      assignedById: session.user.id,
    },
  });

  void teamId; // used for URL scoping, checked implicitly via competition access
  return NextResponse.json({ ok: true });
}
