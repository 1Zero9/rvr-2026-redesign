import { NextRequest, NextResponse } from 'next/server';
import { createId } from '@paralleldrive/cuid2';
import { prisma } from '@/lib/prisma';
import { buildTermsAcceptanceCreate } from '@/lib/terms/record-acceptance';
import { getRequestMeta } from '@/lib/terms/request-meta';
import { validateTermsAgreement } from '@/lib/terms/validate-agreement';
import { SUBMISSION_TYPES } from '@/lib/terms/submission-types';
import type { ClothingSize } from '@prisma/client';

interface ShirtSubmitBody {
  submitterName:    string;
  submitterEmail:   string;
  playerName?:      string;
  teamName?:        string;
  designNotes?:     string;
  designFileUrl:    string;
  thumbnailUrl?:    string;
  size:             ClothingSize;
  quantity:         number;
  totalAmountCents: number;
  agreedToTerms:    boolean;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: ShirtSubmitBody;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  // 1. Validate terms agreement server-side
  const termsError = validateTermsAgreement(body);
  if (termsError) {
    return NextResponse.json({ error: termsError.error }, { status: termsError.status });
  }

  // 2. Validate required fields
  const { submitterName, submitterEmail, designFileUrl, size, quantity, totalAmountCents } = body;
  if (!submitterName || !submitterEmail || !designFileUrl || !size || !quantity || !totalAmountCents) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  // 3. Pre-generate the submission id so both transaction operations can reference it
  const submissionId = createId();
  const { ipAddress, userAgent } = getRequestMeta(req);

  try {
    await prisma.$transaction([
      prisma.shirtSubmission.create({
        data: {
          id:               submissionId,
          submitterName,
          submitterEmail,
          playerName:       body.playerName   ?? null,
          teamName:         body.teamName     ?? null,
          designNotes:      body.designNotes  ?? null,
          designFileUrl,
          thumbnailUrl:     body.thumbnailUrl ?? null,
          size,
          quantity,
          totalAmountCents,
          moderationStatus: 'PENDING',
          paymentStatus:    'PENDING',
        },
      }),
      buildTermsAcceptanceCreate({
        submissionType: SUBMISSION_TYPES.ANNIVERSARY_SHIRT,
        submissionId,
        submitterName,
        submitterEmail,
        ipAddress,
        userAgent,
      }),
    ]);

    return NextResponse.json({ success: true, submissionId }, { status: 201 });
  } catch (err) {
    console.error('[shirts/submit] Transaction error:', err);
    return NextResponse.json({ error: 'Submission failed. Please try again.' }, { status: 500 });
  }
}
