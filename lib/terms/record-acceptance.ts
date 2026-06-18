import type { Prisma } from '@prisma/client';
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
 * Returns a Prisma create operation for use inside prisma.$transaction([]).
 * Do NOT call prisma.$transaction inside this function — the caller owns the transaction.
 */
export function buildTermsAcceptanceCreate(
  params: AcceptanceParams,
): Prisma.TermsAcceptanceCreateArgs {
  return {
    data: {
      submissionType:  params.submissionType,
      submissionId:    params.submissionId,
      submitterName:   params.submitterName,
      submitterEmail:  params.submitterEmail,
      termsVersion:    TERMS_VERSIONS[params.submissionType],
      ipAddress:       params.ipAddress ?? null,
      userAgent:       params.userAgent ?? null,
    },
  };
}
