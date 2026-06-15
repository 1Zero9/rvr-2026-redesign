/**
 * Pure functions — no DB or side effects.
 * All date arithmetic lives here so the cron validator and any other
 * call-site can share identical logic.
 */

import {
  EXPIRY_WARNING_DAYS,
  SAFEGUARDING_1_EXPIRY_DAYS,
  VETTING_EXPIRY_DAYS,
} from './constants';
import type { ComplianceEvaluation, PendingAlert } from './types';

// ---------------------------------------------------------------------------
// Date helpers
// ---------------------------------------------------------------------------

/** Returns midnight UTC for the given date, dropping the time component */
function startOfDay(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

/** Returns (date + days) at midnight UTC */
function addDays(d: Date, days: number): Date {
  return new Date(startOfDay(d).getTime() + days * 86_400_000);
}

/** Positive = expires in the future; negative = already expired */
function daysFromNow(expiry: Date, now: Date): number {
  const expiryDay = startOfDay(expiry).getTime();
  const today     = startOfDay(now).getTime();
  return Math.floor((expiryDay - today) / 86_400_000);
}

// ---------------------------------------------------------------------------
// Core evaluator
// ---------------------------------------------------------------------------

interface StaffInput {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isGardaVetted: boolean;
  gardaVettingApprovedAt: Date | null;
  safeguarding1CompletedAt: Date | null;
}

export function evaluateCompliance(
  staff: StaffInput,
  now: Date = new Date(),
): ComplianceEvaluation {
  const alerts: PendingAlert[] = [];

  // ------------------------------------------------------------------
  // Garda Vetting
  // ------------------------------------------------------------------
  let gardaVettingExpiryDate: Date | null = null;
  let daysUntilVettingExpiry: number | null = null;
  let isVettingExpired = false;
  let isVettingExpiringSoon = false;

  if (staff.gardaVettingApprovedAt) {
    gardaVettingExpiryDate = addDays(staff.gardaVettingApprovedAt, VETTING_EXPIRY_DAYS);
    daysUntilVettingExpiry = daysFromNow(gardaVettingExpiryDate, now);

    if (daysUntilVettingExpiry < 0) {
      isVettingExpired = true;
      alerts.push({
        type: 'VETTING_EXPIRED',
        detail: `Garda Vetting expired ${Math.abs(daysUntilVettingExpiry)} day(s) ago (approved ${staff.gardaVettingApprovedAt.toISOString().split('T')[0]}).`,
      });
    } else if (daysUntilVettingExpiry <= EXPIRY_WARNING_DAYS) {
      isVettingExpiringSoon = true;
      alerts.push({
        type: 'VETTING_EXPIRING_SOON',
        detail: `Garda Vetting expires in ${daysUntilVettingExpiry} day(s) on ${gardaVettingExpiryDate.toISOString().split('T')[0]}.`,
      });
    }
  } else if (!staff.isGardaVetted) {
    // No approval date and not flagged vetted — treat as expired
    isVettingExpired = true;
    alerts.push({
      type: 'VETTING_EXPIRED',
      detail: 'No Garda Vetting approval date recorded. Vetting must be completed via FAI COMET.',
    });
  }

  // ------------------------------------------------------------------
  // Safeguarding 1
  // ------------------------------------------------------------------
  let safeguarding1ExpiryDate: Date | null = null;
  let daysUntilSafeguarding1Expiry: number | null = null;
  const isSafeguarding1Missing = !staff.safeguarding1CompletedAt;
  let isSafeguarding1Expiring = false;
  let isSafeguarding1Current = false;

  if (staff.safeguarding1CompletedAt) {
    safeguarding1ExpiryDate = addDays(staff.safeguarding1CompletedAt, SAFEGUARDING_1_EXPIRY_DAYS);
    daysUntilSafeguarding1Expiry = daysFromNow(safeguarding1ExpiryDate, now);

    if (daysUntilSafeguarding1Expiry < 0) {
      alerts.push({
        type: 'SAFEGUARDING_1_OUTDATED',
        detail: `FAI Safeguarding 1 certificate expired ${Math.abs(daysUntilSafeguarding1Expiry)} day(s) ago. Renewal required.`,
      });
    } else if (daysUntilSafeguarding1Expiry <= EXPIRY_WARNING_DAYS) {
      isSafeguarding1Expiring = true;
    } else {
      isSafeguarding1Current = true;
    }
  } else {
    alerts.push({
      type: 'SAFEGUARDING_1_MISSING',
      detail: 'No FAI Safeguarding 1 completion date recorded. Certificate required for FAI Club Mark compliance.',
    });
  }

  // ------------------------------------------------------------------
  // Overall Club Mark gate
  // ------------------------------------------------------------------
  const isClubMarkCompliant =
    staff.isGardaVetted &&
    !isVettingExpired &&
    isSafeguarding1Current;

  return {
    staffId: staff.id,
    firstName: staff.firstName,
    fullName: `${staff.firstName} ${staff.lastName}`,
    email: staff.email,
    isGardaVetted: staff.isGardaVetted,
    gardaVettingExpiryDate,
    daysUntilVettingExpiry,
    isVettingExpired,
    isVettingExpiringSoon,
    isSafeguarding1Current,
    isSafeguarding1Missing,
    isSafeguarding1Expiring,
    safeguarding1ExpiryDate,
    daysUntilSafeguarding1Expiry,
    isClubMarkCompliant,
    alerts,
  };
}
