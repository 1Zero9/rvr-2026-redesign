import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { GlobalRole, AssignmentRole, FixtureStatus } from "@prisma/client";

async function canAccess(userId: string, globalRole: GlobalRole | null, competitionId: string) {
  if (globalRole === GlobalRole.SUPER_ADMIN) return true;
  const a = await prisma.competitionAssignment.findFirst({
    where: {
      adminUserId: userId,
      competitionId,
      role: { in: [AssignmentRole.EVENT_ADMIN, AssignmentRole.PITCH_ADMIN] },
    },
  });
  return !!a;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; fixtureId: string }> },
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, fixtureId } = await params;
  if (!await canAccess(session.user.id, session.user.globalRole, id)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json() as { homeScore?: number; awayScore?: number; status?: FixtureStatus };
  if (body.homeScore == null || body.awayScore == null) {
    return NextResponse.json({ error: "homeScore and awayScore required" }, { status: 400 });
  }

  const fixture = await prisma.fixture.update({
    where: { id: fixtureId, competitionId: id },
    data: {
      homeScore: body.homeScore,
      awayScore: body.awayScore,
      status: body.status ?? FixtureStatus.COMPLETE,
      resultEnteredAt: new Date(),
      resultEnteredById: session.user.id,
    },
    include: { homeTeam: true, awayTeam: true },
  });

  return NextResponse.json(fixture);
}
