import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { GlobalRole, CompetitionState } from "@prisma/client";

async function canAccess(userId: string, globalRole: GlobalRole | null, competitionId: string) {
  if (globalRole === GlobalRole.SUPER_ADMIN) return true;
  const assignment = await prisma.competitionAssignment.findFirst({
    where: { adminUserId: userId, competitionId },
  });
  return !!assignment;
}

export async function GET(
  _req: NextRequest,
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
    include: {
      venues: true,
      teams: { include: { players: { include: { playerPoolEntry: { select: { id: true, displayName: true, status: true } } } } } },
      fixtures: { include: { homeTeam: true, awayTeam: true }, orderBy: { scheduledAt: "asc" } },
      assignments: { include: { adminUser: { select: { id: true, email: true, name: true } } } },
    },
  });
  if (!competition) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(competition);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.globalRole !== GlobalRole.SUPER_ADMIN) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json() as Partial<{
    name: string;
    state: CompetitionState;
    isPublic: boolean;
    publicSlug: string;
    dataRetentionDays: number;
  }>;

  const competition = await prisma.competition.update({
    where: { id },
    data: body,
  });
  return NextResponse.json(competition);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.globalRole !== GlobalRole.SUPER_ADMIN) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  await prisma.competition.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
