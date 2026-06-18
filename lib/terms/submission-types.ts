export const SUBMISSION_TYPES = {
  ANNIVERSARY_SHIRT: 'anniversary_shirt',
  KIT_DESIGN:        'kit_design',
  FUN_RUN:           'fun_run',
  MEMBERSHIP:        'membership',
} as const;

export type SubmissionType = (typeof SUBMISSION_TYPES)[keyof typeof SUBMISSION_TYPES];
