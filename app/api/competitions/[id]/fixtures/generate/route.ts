import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateFixtures } from "@/lib/competitions/scheduler";
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
    include: { teams: true, venues: true },
  });
  if (!competition) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (competition.teams.length < 2) {
    return NextResponse.json({ error: "Need at least 2 teams" }, { status: 400 });
  }

  const body = await req.json() as {
    startTime?: string;
    gameDuration?: number;
    breakDuration?: number;
  };

  const fixtures = generateFixtures({
    teams: competition.teams,
    competitionType: competition.type,
    venues: competition.venues,
    startTime: body.startTime ?? "09:00",
    gameDuration: body.gameDuration ?? 20,
    breakDuration: body.breakDuration ?? 5,
    dates: competition.dates.map((d) => new Date(d)),
  });

  await prisma.$transaction(async (tx) => {
    await tx.fixture.deleteMany({ where: { competitionId: id } });
    await tx.fixture.createMany({
      data: fixtures.map((f) => ({
        id: createId(),
        competitionId: id,
        homeTeamId: f.homeTeamId,
        awayTeamId: f.awayTeamId,
        venueName: f.venueName,
        pitchLabel: f.pitchLabel,
        scheduledAt: f.scheduledAt,
        duration: f.duration,
        round: f.round,
      })),
    });
  });

  return NextResponse.json({ generated: fixtures.length });
}
