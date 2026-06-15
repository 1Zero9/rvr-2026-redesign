import { CLUB_NAME, EXPIRY_WARNING_DAYS } from './constants';
import type { ComplianceEvaluation } from './types';

// ---------------------------------------------------------------------------
// Shared HTML chrome
// ---------------------------------------------------------------------------

function htmlWrap(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escHtml(title)}</title>
  <style>
    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f5; color: #1a1a1a; }
    .wrapper { max-width: 600px; margin: 32px auto; background: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; }
    .header  { background: #00613a; padding: 24px 32px; }
    .header h1 { margin: 0; color: #ffffff; font-size: 18px; font-weight: 700; }
    .header p  { margin: 4px 0 0; color: #a3d9b8; font-size: 13px; }
    .body    { padding: 28px 32px; }
    .alert-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 14px 16px; border-radius: 4px; margin: 20px 0; }
    .alert-box.danger { background: #fde8e8; border-left-color: #dc3545; }
    .steps   { background: #f0f7f4; border-radius: 6px; padding: 16px 20px; margin: 20px 0; }
    .steps ol { margin: 8px 0 0; padding-left: 20px; }
    .steps li { margin: 8px 0; font-size: 14px; }
    .footer  { background: #f5f5f5; padding: 16px 32px; font-size: 12px; color: #666; border-top: 1px solid #e0e0e0; }
    p { font-size: 14px; line-height: 1.6; margin: 12px 0; }
    strong { color: #00613a; }
    a { color: #00613a; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>${escHtml(CLUB_NAME)}</h1>
      <p>FAI Safeguarding &amp; Club Mark Compliance</p>
    </div>
    <div class="body">
      ${body}
    </div>
    <div class="footer">
      <p>This is an automated compliance notification sent by ${escHtml(CLUB_NAME)}.<br />
      All Garda Vetting must be processed exclusively through the <strong>FAI COMET system</strong>.<br />
      FAI Child Welfare &amp; Safeguarding Policy, 3rd edition (March 2025) | FAI Governance Handbook §12.3–12.4</p>
    </div>
  </div>
</body>
</html>`;
}

function textWrap(body: string): string {
  return `${CLUB_NAME} — FAI Safeguarding & Club Mark Compliance\n${'='.repeat(60)}\n\n${body}\n\n${'—'.repeat(60)}\nThis is an automated compliance notification.\nAll Garda Vetting must be completed via the FAI COMET system.\nFAI Child Welfare & Safeguarding Policy, 3rd edition (March 2025)\n`;
}

function escHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ---------------------------------------------------------------------------
// Template 1 — Vetting expiring soon: email to the COACH
// ---------------------------------------------------------------------------

export function vettingExpiringSoonCoach(eval_: ComplianceEvaluation): {
  subject: string;
  html: string;
  text: string;
} {
  const days = eval_.daysUntilVettingExpiry ?? EXPIRY_WARNING_DAYS;
  const expiryStr = eval_.gardaVettingExpiryDate?.toLocaleDateString('en-IE', { dateStyle: 'long' }) ?? 'soon';

  const subject = `[ACTION REQUIRED] Your Garda Vetting expires in ${days} days — FAI COMET renewal needed`;

  const htmlBody = `
    <p>Dear <strong>${escHtml(eval_.fullName)}</strong>,</p>

    <div class="alert-box">
      <strong>⚠️ Your Garda Vetting expires on ${escHtml(expiryStr)} (${days} days from today).</strong><br />
      Under FAI policy, you will be unable to coach until a new vetting is approved via FAI COMET.
    </div>

    <p>To stay compliant with the <strong>FAI Club Mark</strong> standard and the FAI Governance Handbook §12.3–12.4,
    you must renew your Garda Vetting <em>before</em> it expires.</p>

    <div class="steps">
      <strong>Steps to renew via FAI COMET:</strong>
      <ol>
        <li>Log in to the <a href="https://comet.fai.ie">FAI COMET system</a> at <code>comet.fai.ie</code></li>
        <li>Navigate to <em>My Profile → Garda Vetting</em></li>
        <li>Follow the re-vetting prompts and submit all required information</li>
        <li>Await email confirmation of your new vetting approval</li>
        <li>Forward the approval email to your Club Welfare Officer so our records can be updated</li>
      </ol>
    </div>

    <p><strong>Important:</strong> Per FAI policy, <em>no Garda Vetting other than that completed through the FAI COMET system can be accepted.</em>
    Postal applications are not accepted.</p>

    <p>If you have already submitted your renewal, please contact your Welfare Officer so we can track progress.</p>

    <p>Thank you for everything you do for ${escHtml(CLUB_NAME)}.</p>

    <p>Regards,<br /><strong>${escHtml(CLUB_NAME)} Compliance Team</strong></p>
  `;

  const text = textWrap(
    `Dear ${eval_.fullName},\n\n` +
    `ACTION REQUIRED: Your Garda Vetting expires on ${expiryStr} (${days} days from today).\n\n` +
    `Under FAI policy you will be unable to coach until renewed via FAI COMET.\n\n` +
    `Steps to renew:\n` +
    `1. Log in at https://comet.fai.ie\n` +
    `2. Navigate to My Profile → Garda Vetting\n` +
    `3. Complete the re-vetting process\n` +
    `4. Forward your approval email to the Club Welfare Officer\n\n` +
    `No postal applications are accepted. FAI COMET only.\n\n` +
    `Thank you,\n${CLUB_NAME} Compliance Team`,
  );

  return { subject, html: htmlWrap(subject, htmlBody), text };
}

// ---------------------------------------------------------------------------
// Template 2 — Vetting expiring soon: email to WELFARE OFFICER
// ---------------------------------------------------------------------------

export function vettingExpiringSoonWelfareOfficer(eval_: ComplianceEvaluation): {
  subject: string;
  html: string;
  text: string;
} {
  const days = eval_.daysUntilVettingExpiry ?? EXPIRY_WARNING_DAYS;
  const expiryStr = eval_.gardaVettingExpiryDate?.toLocaleDateString('en-IE', { dateStyle: 'long' }) ?? 'soon';

  const subject = `[COMPLIANCE ALERT] ${eval_.fullName}'s Garda Vetting expires in ${days} days`;

  const htmlBody = `
    <p>Dear Welfare Officer,</p>

    <div class="alert-box">
      <strong>⚠️ ${escHtml(eval_.fullName)}</strong> (${escHtml(eval_.email)}) has Garda Vetting
      expiring on <strong>${escHtml(expiryStr)}</strong> — ${days} day(s) from today.
    </div>

    <p>A reminder email has also been sent directly to ${escHtml(eval_.fullName)}.</p>

    <p>Under <strong>FAI Club Mark</strong> requirements and the FAI Governance Handbook §12.3–12.4,
    this coach must not be permitted to continue coaching roles after the vetting expiry date.</p>

    <p><strong>Action required from Welfare Officer:</strong></p>
    <ul style="font-size:14px;line-height:1.8;">
      <li>Confirm ${escHtml(eval_.firstName)}'s renewal application has been submitted via FAI COMET</li>
      <li>Monitor the FAI COMET dashboard for vetting approval confirmation</li>
      <li>Update the club's coaching register once the new approval is received</li>
      <li>If vetting is not renewed before expiry, suspend this coach from all team contact until resolved</li>
    </ul>

    <p>Regards,<br /><strong>${escHtml(CLUB_NAME)} Automated Compliance System</strong></p>
  `;

  const text = textWrap(
    `Dear Welfare Officer,\n\n` +
    `COMPLIANCE ALERT: ${eval_.fullName} (${eval_.email}) has Garda Vetting expiring on ${expiryStr} (${days} days).\n\n` +
    `A reminder has been sent to the coach directly.\n\n` +
    `Required action:\n` +
    `- Confirm renewal submitted via FAI COMET\n` +
    `- Monitor FAI COMET for approval\n` +
    `- Suspend coach from team contact if not renewed before expiry\n\n` +
    `${CLUB_NAME} Automated Compliance System`,
  );

  return { subject, html: htmlWrap(subject, htmlBody), text };
}

// ---------------------------------------------------------------------------
// Template 3 — Vetting EXPIRED: email to the COACH
// ---------------------------------------------------------------------------

export function vettingExpiredCoach(eval_: ComplianceEvaluation): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = `[URGENT] Your Garda Vetting has EXPIRED — coaching suspended pending renewal`;

  const htmlBody = `
    <p>Dear <strong>${escHtml(eval_.fullName)}</strong>,</p>

    <div class="alert-box danger">
      <strong>🚨 Your FAI Garda Vetting has expired.</strong><br />
      You are currently suspended from all coaching and volunteer duties with ${escHtml(CLUB_NAME)}
      until a valid vetting approval is received via FAI COMET.
    </div>

    <p>This suspension is required by the <strong>FAI Child Welfare &amp; Safeguarding Policy</strong> and
    the FAI Governance Handbook §12.3–12.4. It is not a disciplinary action — simply a compliance requirement
    that protects both you and the children you coach.</p>

    <div class="steps">
      <strong>How to restore your compliance status immediately:</strong>
      <ol>
        <li>Log in to <a href="https://comet.fai.ie">FAI COMET</a> at <code>comet.fai.ie</code> today</li>
        <li>Submit your re-vetting application without delay</li>
        <li>Contact your Club Welfare Officer to confirm your submission</li>
        <li>Once FAI COMET issues your new approval, your coaching status will be reinstated</li>
      </ol>
    </div>

    <p>Please do not delay — the FAI requires that the re-vetting period is a maximum of 3 years
    and shorter periods may be issued by the Child Welfare &amp; Safeguarding Committee.</p>

    <p>Regards,<br /><strong>${escHtml(CLUB_NAME)} Compliance Team</strong></p>
  `;

  const text = textWrap(
    `Dear ${eval_.fullName},\n\n` +
    `URGENT: Your FAI Garda Vetting has EXPIRED.\n\n` +
    `You are suspended from all coaching and volunteer duties until a valid vetting approval is received.\n\n` +
    `Steps to resolve immediately:\n` +
    `1. Log in to https://comet.fai.ie\n` +
    `2. Submit re-vetting application\n` +
    `3. Contact Welfare Officer to confirm submission\n` +
    `4. Coaching reinstated once FAI COMET issues new approval\n\n` +
    `${CLUB_NAME} Compliance Team`,
  );

  return { subject, html: htmlWrap(subject, htmlBody), text };
}

// ---------------------------------------------------------------------------
// Template 4 — Vetting EXPIRED: email to WELFARE OFFICER
// ---------------------------------------------------------------------------

export function vettingExpiredWelfareOfficer(eval_: ComplianceEvaluation): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = `[COMPLIANCE BREACH] ${eval_.fullName}'s Garda Vetting has EXPIRED`;

  const htmlBody = `
    <p>Dear Welfare Officer,</p>

    <div class="alert-box danger">
      <strong>🚨 COMPLIANCE BREACH: ${escHtml(eval_.fullName)}</strong> (${escHtml(eval_.email)}) —
      Garda Vetting has <strong>expired</strong> and this coach has been automatically flagged
      as non-compliant in the system.
    </div>

    <p><strong>Immediate action required under FAI Club Mark standards:</strong></p>
    <ul style="font-size:14px;line-height:1.8;">
      <li>Remove ${escHtml(eval_.firstName)} from all team contact and training duties immediately</li>
      <li>Do not permit this coach to be listed on any public team roster</li>
      <li>Contact ${escHtml(eval_.firstName)} directly to confirm FAI COMET re-vetting is submitted</li>
      <li>Notify the DDSL Club Children's Officer of the breach if required by your league rules</li>
      <li>Document the date of suspension and date of reinstatement once resolved</li>
    </ul>

    <p>The coach has been sent an urgent email with reinstatement instructions. Their profile
    has been removed from all public-facing coach and team pages until compliance is restored.</p>

    <p>Regards,<br /><strong>${escHtml(CLUB_NAME)} Automated Compliance System</strong></p>
  `;

  const text = textWrap(
    `Dear Welfare Officer,\n\n` +
    `COMPLIANCE BREACH: ${eval_.fullName} (${eval_.email}) — Garda Vetting EXPIRED.\n\n` +
    `Immediate actions required:\n` +
    `- Remove from all team contact and training duties immediately\n` +
    `- Do not list on any public team roster\n` +
    `- Contact coach to confirm FAI COMET re-vetting submitted\n` +
    `- Notify DDSL Club Children's Officer if required\n` +
    `- Document suspension and reinstatement dates\n\n` +
    `The coach has been removed from all public-facing pages.\n\n` +
    `${CLUB_NAME} Automated Compliance System`,
  );

  return { subject, html: htmlWrap(subject, htmlBody), text };
}

// ---------------------------------------------------------------------------
// Template 5 — Safeguarding 1 missing or outdated: email to COACH
// ---------------------------------------------------------------------------

export function safeguarding1AlertCoach(
  eval_: ComplianceEvaluation,
  isOutdated: boolean,
): { subject: string; html: string; text: string } {
  const subject = isOutdated
    ? `[ACTION REQUIRED] Your FAI Safeguarding 1 certificate requires renewal`
    : `[ACTION REQUIRED] FAI Safeguarding 1 certificate not on record — Club Mark compliance`;

  const alertText = isOutdated
    ? `Your FAI Safeguarding 1 (Child Welfare &amp; Safeguarding) certificate has expired and requires renewal.`
    : `No FAI Safeguarding 1 completion record is held for your profile. This is required for FAI Club Mark compliance.`;

  const htmlBody = `
    <p>Dear <strong>${escHtml(eval_.fullName)}</strong>,</p>

    <div class="alert-box">
      <strong>⚠️ Safeguarding 1 Action Needed</strong><br />
      ${alertText}
    </div>

    <p>The <strong>FAI Child Welfare &amp; Safeguarding Policy (3rd edition, March 2025)</strong> requires
    all coaches and club volunteers working with children to hold a current Safeguarding 1 certificate.</p>

    <div class="steps">
      <strong>How to complete FAI Safeguarding 1:</strong>
      <ol>
        <li>Visit <a href="https://www.fai.ie/domestic/safeguarding">fai.ie/domestic/safeguarding</a></li>
        <li>Register for the next available FAI Safeguarding 1 online or in-person course</li>
        <li>Complete the course and download your certificate</li>
        <li>Email the certificate PDF to your Club Welfare Officer so records can be updated</li>
      </ol>
    </div>

    <p>Your club also offers group booking for FAI-run courses — contact the Welfare Officer for upcoming dates.</p>

    <p>Regards,<br /><strong>${escHtml(CLUB_NAME)} Compliance Team</strong></p>
  `;

  const text = textWrap(
    `Dear ${eval_.fullName},\n\n` +
    (isOutdated
      ? `ACTION REQUIRED: Your FAI Safeguarding 1 certificate has expired and requires renewal.\n\n`
      : `ACTION REQUIRED: No FAI Safeguarding 1 completion record is on file for your profile.\n\n`) +
    `Steps:\n` +
    `1. Visit https://www.fai.ie/domestic/safeguarding\n` +
    `2. Register for an FAI Safeguarding 1 course\n` +
    `3. Complete and email your certificate to the Welfare Officer\n\n` +
    `${CLUB_NAME} Compliance Team`,
  );

  return { subject, html: htmlWrap(subject, htmlBody), text };
}
