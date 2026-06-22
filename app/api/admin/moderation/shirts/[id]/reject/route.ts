import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin/require-admin';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Unauthorised.' }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => ({})) as { notes?: string; reviewedBy?: string };

  try {
    await prisma.shirtSubmission.update({
      where: { id },
      data: {
        moderationStatus: 'REJECTED',
        moderationNotes:  body.notes      ?? null,
        reviewedAt:       new Date(),
        reviewedBy:       body.reviewedBy ?? 'admin',
      },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[moderation/reject] Error:', err);
    return NextResponse.json({ error: 'Update failed.' }, { status: 500 });
  }
}
