import { prisma } from '@/lib/prisma';
import type { PrismaPromise } from '@prisma/client';
import { TERMS_VERSIONS } from './versions';
import type { SubmissionType } from './submission-types';

interface AcceptanceParams {
  submissionType:  SubmissionType;
  submissionId:    string;
  submitterName:   string;
  submitterEmail:  string;
  ipAddress?:      string | null;
  userAgent?:      string | null;
}

/**
 * Returns a PrismaPromise for use inside prisma.$transaction([...]).
 * The caller owns the transaction — do not await this directly.
 *
 * Usage:
 *   await prisma.$transaction([
 *     prisma.shirtSubmission.create({ data: submissionData }),
 *     buildTermsAcceptanceCreate({ submissionType, submissionId: newId, ... }),
 *   ]);
 */
export function buildTermsAcceptanceCreate(
  params: AcceptanceParams,
): PrismaPromise<unknown> {
  return prisma.termsAcceptance.create({
    data: {
      submissionType:  params.submissionType,
      submissionId:    params.submissionId,
      submitterName:   params.submitterName,
      submitterEmail:  params.submitterEmail,
      termsVersion:    TERMS_VERSIONS[params.submissionType],
      ipAddress:       params.ipAddress ?? null,
      userAgent:       params.userAgent ?? null,
    },
  });
}
