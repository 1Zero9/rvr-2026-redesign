import { NextRequest, NextResponse } from "next/server";
import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";
import { SquadCardTemplate } from "@/lib/competitions/squad-card";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; teamId: string }> },
) {
  const { id, teamId } = await params;

  const [team, competition] = await Promise.all([
    prisma.competitionTeam.findUnique({
      where: { id: teamId, competitionId: id },
      include: {
        players: {
          include: {
            playerPoolEntry: { select: { displayName: true } },
          },
        },
      },
    }),
    prisma.competition.findUnique({
      where: { id },
      select: { name: true, isPublic: true },
    }),
  ]);

  if (!team || !competition) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const image = new ImageResponse(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SquadCardTemplate({ team: team as any, competition }) as React.ReactElement,
    {
      width: 1080,
      height: 1080,
    },
  );

  return new NextResponse(image.body, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=300",
    },
  });
}
