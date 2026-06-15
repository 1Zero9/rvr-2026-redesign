import type { AlertStatus, ComplianceAlertType, StaffRole } from '@prisma/client';

export type { AlertStatus, ComplianceAlertType, StaffRole };

/** Result of evaluating one staff member against all FAI compliance rules */
export interface ComplianceEvaluation {
  staffId: string;
  firstName: string;
  fullName: string;
  email: string;

  // Garda Vetting
  isGardaVetted: boolean;
  gardaVettingExpiryDate: Date | null;
  daysUntilVettingExpiry: number | null;
  isVettingExpired: boolean;
  isVettingExpiringSoon: boolean;

  // Safeguarding 1
  isSafeguarding1Current: boolean;
  isSafeguarding1Missing: boolean;
  isSafeguarding1Expiring: boolean;
  safeguarding1ExpiryDate: Date | null;
  daysUntilSafeguarding1Expiry: number | null;

  // Overall
  isClubMarkCompliant: boolean;
  alerts: PendingAlert[];
}

export interface PendingAlert {
  type: ComplianceAlertType;
  /** Describes the breach — included in email subject/body */
  detail: string;
}

/** Summary returned from a single cron run */
export interface CronRunResult {
  runAt: Date;
  totalStaffChecked: number;
  compliantCount: number;
  nonCompliantCount: number;
  alertsRaised: number;
  emailsSent: number;
  errors: string[];
}

/** Public-safe coach shape returned by /api/coaches and /api/teams/[team]/coaches */
export interface PublicCoachProfile {
  id: string;
  firstName: string;
  lastName: string;
  role: StaffRole;
  teams: Array<{
    teamName: string;
    ageGroup: string;
    season: string;
    isPrimary: boolean;
  }>;
  /** Compliance badge shown publicly — never reveals dates or COMET ID */
  gardaVettedBadge: true;
}
