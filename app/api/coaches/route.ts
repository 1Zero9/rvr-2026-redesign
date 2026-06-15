/**
 * GET /api/coaches
 *
 * Returns all publicly visible coaches.
 * The PUBLIC_COACH_WHERE clause guarantees that non-compliant profiles are
 * never returned — the filtering happens at the DB query level, not in
 * application code, so it cannot be bypassed by changing request parameters.
 *
 * Optional query params:
 *   ?role=COACH              – filter by StaffRole enum value
 *   ?season=2025-2026        – filter team assignments by season
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PUBLIC_COACH_SELECT, PUBLIC_COACH_WHERE } from '@/lib/safeguarding/public-filter';
import type { PublicCoachProfile } from '@/lib/safeguarding/types';
import type { StaffRole } from '@prisma/client';

const VALID_ROLES = new Set<string>([
  'COACH', 'MENTOR', 'TEAM_MANAGER', 'WELFARE_OFFICER', 'COMMITTEE_MEMBER', 'VOLUNTEER',
]);

export async function GET(req: NextRequest): Promise<NextResponse> {
  const roleParam   = req.nextUrl.searchParams.get('role');
  const seasonParam = req.nextUrl.searchParams.get('season');

  // Validate optional role param before it reaches Prisma
  if (roleParam && !VALID_ROLES.has(roleParam.toUpperCase())) {
    return NextResponse.json(
      { error: `Invalid role parameter. Valid values: ${[...VALID_ROLES].join(', ')}` },
      { status: 400 },
    );
  }

  try {
    const rows = await prisma.staffMember.findMany({
      where: {
        // Compliance gate — always applied, cannot be overridden
        ...PUBLIC_COACH_WHERE,
        // Optional role filter
        ...(roleParam ? { role: roleParam.toUpperCase() as StaffRole } : {}),
      },
      select: {
        ...PUBLIC_COACH_SELECT,
        teamAssignments: {
          select: PUBLIC_COACH_SELECT.teamAssignments.select,
          // Optionally filter team assignments by season
          ...(seasonParam ? { where: { season: seasonParam } } : {}),
          orderBy: [{ isPrimary: 'desc' }, { teamName: 'asc' }],
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
      gardaVettedBadge: true, // Badge is only present because the WHERE gate passed
    }));

    return NextResponse.json({ coaches, total: coaches.length });
  } catch (err) {
    console.error('[api/coaches] error:', err);
    return NextResponse.json({ error: 'Failed to fetch coaches' }, { status: 500 });
  }
}
