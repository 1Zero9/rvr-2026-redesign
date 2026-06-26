import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { FixtureStatus } from "@prisma/client";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ pitchId: string }> },
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { pitchId } = await params;
  const decodedPitch = decodeURIComponent(pitchId);

  const now = new Date();

  const [current, next] = await Promise.all([
    prisma.fixture.findFirst({
      where: {
        pitchLabel: decodedPitch,
        status: { in: [FixtureStatus.LIVE, FixtureStatus.SCHEDULED] },
        scheduledAt: { lte: now },
      },
      include: { homeTeam: true, awayTeam: true },
      orderBy: { scheduledAt: "desc" },
    }),
    prisma.fixture.findFirst({
      where: {
        pitchLabel: decodedPitch,
        status: FixtureStatus.SCHEDULED,
        scheduledAt: { gt: now },
      },
      include: { homeTeam: true, awayTeam: true },
      orderBy: { scheduledAt: "asc" },
    }),
  ]);

  return NextResponse.json({ current, next });
}
