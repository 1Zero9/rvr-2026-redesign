import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function isAuthorised(req: NextRequest): boolean {
  const header = req.headers.get('authorization') ?? '';
  return header === `Bearer ${process.env.ADMIN_SECRET}`;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  if (!isAuthorised(req)) {
    return NextResponse.json({ error: 'Unauthorised.' }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => ({})) as { notes?: string; reviewedBy?: string };

  try {
    await prisma.shirtSubmission.update({
      where: { id },
      data: {
        moderationStatus: 'APPROVED',
        moderationNotes:  body.notes      ?? null,
        reviewedAt:       new Date(),
        reviewedBy:       body.reviewedBy ?? 'admin',
      },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[moderation/approve] Error:', err);
    return NextResponse.json({ error: 'Update failed.' }, { status: 500 });
  }
}
