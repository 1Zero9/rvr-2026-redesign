/**
 * GET /api/teams/[team]/coaches
 *
 * Returns the compliant coaching staff assigned to a specific team.
 *
 * Path param:
 *   team  – URL-encoded team name, e.g. "U10%20Boys%20A"
 *
 * Query params:
 *   ?season=2025-2026  – defaults to the current season if omitted
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PUBLIC_COACH_SELECT, PUBLIC_COACH_WHERE } from '@/lib/safeguarding/public-filter';
import type { PublicCoachProfile } from '@/lib/safeguarding/types';

function currentSeason(): string {
  const now = new Date();
  const year = now.getFullYear();
  // Season runs Aug–Jul; if before August use previous year as start
  const start = now.getMonth() < 7 ? year - 1 : year;
  return `${start}-${start + 1}`;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ team: string }> },
): Promise<NextResponse> {
  const { team: rawTeam } = await params;
  const teamName = decodeURIComponent(rawTeam).trim();

  if (!teamName) {
    return NextResponse.json({ error: 'Team name is required' }, { status: 400 });
  }

  const season = req.nextUrl.searchParams.get('season') ?? currentSeason();

  try {
    const rows = await prisma.staffMember.findMany({
      where: {
        // Compliance gate — always applied
        ...PUBLIC_COACH_WHERE,
        // Must have an active assignment to this specific team this season
        teamAssignments: {
          some: { teamName, season },
        },
      },
      select: {
        ...PUBLIC_COACH_SELECT,
        teamAssignments: {
          select: PUBLIC_COACH_SELECT.teamAssignments.select,
          where: { teamName, season },
          orderBy: { isPrimary: 'desc' },
        },
      },
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
    });

    const coaches: PublicCoachProfile[] = rows.map((r) => ({
      id:               r.id,
      firstName:        r.firstName,
      lastName:         r.lastName,
      role:             r.role,
      teams:            r.teamAssignments,
      gardaVettedBadge: true,
    }));

    return NextResponse.json({
      team:    teamName,
      season,
      coaches,
      total:   coaches.length,
    });
  } catch (err) {
    console.error(`[api/teams/${teamName}/coaches] error:`, err);
    return NextResponse.json({ error: 'Failed to fetch team coaches' }, { status: 500 });
  }
}
