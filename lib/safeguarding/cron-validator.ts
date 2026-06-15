/**
 * Weekly compliance validator.
 *
 * For every active staff member:
 *   1. Evaluate compliance using pure date logic (compliance-checker.ts)
 *   2. Write updated flags back to the DB in a transaction
 *   3. For each new alert: create a ComplianceAlert row and send the relevant emails
 *
 * "New" means no un-resolved alert of that type already exists for this staff member.
 * This prevents duplicate emails if the cron fires multiple times before the alert is resolved.
 */

import { prisma } from '@/lib/prisma';
import { evaluateCompliance } from './compliance-checker';
import {
  safeguarding1AlertCoach,
  vettingExpiredCoach,
  vettingExpiredWelfareOfficer,
  vettingExpiringSoonCoach,
  vettingExpiringSoonWelfareOfficer,
} from './email-templates';
import { sendMail } from './mailer';
import type { ComplianceAlertType, CronRunResult } from './types';

export async function runSafeguardingCron(now: Date = new Date()): Promise<CronRunResult> {
  const result: CronRunResult = {
    runAt: now,
    totalStaffChecked: 0,
    compliantCount: 0,
    nonCompliantCount: 0,
    alertsRaised: 0,
    emailsSent: 0,
    errors: [],
  };

  // Fetch all active staff with only the fields the checker needs
  const allStaff = await prisma.staffMember.findMany({
    where: { isActivelyCoaching: true },
    select: {
      id:                       true,
      firstName:                true,
      lastName:                 true,
      email:                    true,
      isGardaVetted:            true,
      gardaVettingApprovedAt:   true,
      safeguarding1CompletedAt: true,
      // Fetch open alerts to avoid duplicate sends
      complianceAlerts: {
        where: { status: { in: ['PENDING', 'EMAIL_SENT'] } },
        select: { alertType: true },
      },
    },
  });

  result.totalStaffChecked = allStaff.length;

  for (const staff of allStaff) {
    try {
      const eval_ = evaluateCompliance(staff, now);

      // Collect alert types already open for this staff member
      const existingAlertTypes = new Set<ComplianceAlertType>(
        staff.complianceAlerts.map((a) => a.alertType),
      );

      // ------------------------------------------------------------------
      // 1. Write updated compliance flags (single transaction)
      // ------------------------------------------------------------------
      await prisma.staffMember.update({
        where: { id: staff.id },
        data: {
          isVettingExpired:       eval_.isVettingExpired,
          isGardaVetted:          eval_.isGardaVetted && !eval_.isVettingExpired,
          isSafeguarding1Current: eval_.isSafeguarding1Current,
          isClubMarkCompliant:    eval_.isClubMarkCompliant,
          lastComplianceCheckedAt: now,
        },
      });

      // ------------------------------------------------------------------
      // 2. Raise new alerts and send emails
      // ------------------------------------------------------------------
      for (const pending of eval_.alerts) {
        if (existingAlertTypes.has(pending.type)) continue; // already open

        // Persist the alert row
        await prisma.complianceAlert.create({
          data: {
            staffId:   staff.id,
            alertType: pending.type,
            status:    'PENDING',
            notes:     pending.detail,
          },
        });
        result.alertsRaised++;

        // Select and send the right email templates
        const emailsSentForAlert = await dispatchAlertEmails(eval_, pending.type, staff.id);
        result.emailsSent += emailsSentForAlert;
      }

      if (eval_.isClubMarkCompliant) {
        result.compliantCount++;
      } else {
        result.nonCompliantCount++;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      result.errors.push(`Staff ${staff.id} (${staff.email}): ${msg}`);
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// Email dispatch router
// ---------------------------------------------------------------------------

async function dispatchAlertEmails(
  eval_: import('./types').ComplianceEvaluation,
  alertType: ComplianceAlertType,
  staffId: string,
): Promise<number> {
  let sent = 0;

  const sendAndMark = async (
    to: string,
    payload: { subject: string; html: string; text: string },
    bcc?: string,
  ) => {
    await sendMail({ to, ...payload, bcc });
    sent++;
  };

  try {
    if (alertType === 'VETTING_EXPIRING_SOON') {
      await sendAndMark(eval_.email, vettingExpiringSoonCoach(eval_));
      await sendAndMark(
        process.env.WELFARE_OFFICER_EMAIL ?? '',
        vettingExpiringSoonWelfareOfficer(eval_),
      );
    } else if (alertType === 'VETTING_EXPIRED') {
      await sendAndMark(eval_.email, vettingExpiredCoach(eval_));
      await sendAndMark(
        process.env.WELFARE_OFFICER_EMAIL ?? '',
        vettingExpiredWelfareOfficer(eval_),
      );
    } else if (alertType === 'SAFEGUARDING_1_MISSING') {
      await sendAndMark(eval_.email, safeguarding1AlertCoach(eval_, false));
    } else if (alertType === 'SAFEGUARDING_1_OUTDATED') {
      await sendAndMark(eval_.email, safeguarding1AlertCoach(eval_, true));
    }

    // Mark alert as EMAIL_SENT
    await prisma.complianceAlert.updateMany({
      where: { staffId, alertType, status: 'PENDING' },
      data:  { status: 'EMAIL_SENT', emailSentAt: new Date() },
    });
  } catch (err) {
    // Log but don't rethrow — a failed email shouldn't abort the whole cron run
    console.error(`[safeguarding/cron] email failed for ${eval_.email} (${alertType}):`, err);
  }

  return sent;
}
