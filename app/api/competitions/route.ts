import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { GlobalRole, CompetitionType, ParticipantMode, TeamTheme } from "@prisma/client";
import { createId } from "@paralleldrive/cuid2";

function slug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function GET(_req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const where =
    session.user.globalRole === GlobalRole.SUPER_ADMIN
      ? {}
      : {
          assignments: {
            some: { adminUserId: session.user.id },
          },
        };

  const competitions = await prisma.competition.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      name: true,
      type: true,
      state: true,
      ageGroup: true,
      dates: true,
    },
  });

  return NextResponse.json(competitions);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.globalRole !== GlobalRole.SUPER_ADMIN) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json() as {
    name?: string;
    slug?: string;
    type?: string;
    participantMode?: string;
    ageGroup?: string;
    teamTheme?: string;
    dataRetentionDays?: number;
  };

  if (!body.name || !body.type || !body.participantMode || !body.ageGroup || !body.teamTheme) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const competitionSlug = body.slug?.trim() || slug(body.name);

  try {
    const competition = await prisma.competition.create({
      data: {
        id: createId(),
        slug: competitionSlug,
        name: body.name,
        type: body.type as CompetitionType,
        participantMode: body.participantMode as ParticipantMode,
        ageGroup: body.ageGroup,
        teamTheme: body.teamTheme as TeamTheme,
        customThemeNames: [],
        dataRetentionDays: body.dataRetentionDays ?? 90,
        createdById: session.user.id,
      },
    });
    return NextResponse.json({ id: competition.id, slug: competition.slug });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (message.includes("Unique constraint")) {
      return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
