/**
 * Thin nodemailer wrapper.
 *
 * Required environment variables:
 *   SMTP_HOST      – e.g. smtp.sendgrid.net
 *   SMTP_PORT      – e.g. 587
 *   SMTP_USER      – SMTP username / API key identifier
 *   SMTP_PASS      – SMTP password / API key secret
 *   SMTP_SECURE    – "true" for TLS (port 465), "false" for STARTTLS (port 587)
 *
 * Optional:
 *   COMPLIANCE_EMAIL_FROM  – defaults to noreply@rivervalleyrangers.ie
 *   WELFARE_OFFICER_EMAIL  – Welfare Officer always BCC'd on coach alerts
 */

import nodemailer, { type Transporter } from 'nodemailer';
import { COMPLIANCE_EMAIL_FROM, WELFARE_OFFICER_EMAIL } from './constants';

interface MailPayload {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  /** Additional recipients — not exposed in To/CC headers */
  bcc?: string | string[];
}

function createTransport(): Transporter {
  const host   = process.env.SMTP_HOST;
  const port   = parseInt(process.env.SMTP_PORT ?? '587', 10);
  const user   = process.env.SMTP_USER;
  const pass   = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE === 'true';

  if (!host || !user || !pass) {
    throw new Error(
      'SMTP not configured — set SMTP_HOST, SMTP_USER, SMTP_PASS environment variables',
    );
  }

  return nodemailer.createTransport({ host, port, secure, auth: { user, pass } });
}

export async function sendMail(payload: MailPayload): Promise<{ messageId: string }> {
  const transport = createTransport();

  const bccList = [
    ...(payload.bcc ? (Array.isArray(payload.bcc) ? payload.bcc : [payload.bcc]) : []),
    ...(WELFARE_OFFICER_EMAIL ? [WELFARE_OFFICER_EMAIL] : []),
  ].filter(Boolean);

  const info = await transport.sendMail({
    from:    COMPLIANCE_EMAIL_FROM,
    to:      payload.to,
    subject: payload.subject,
    html:    payload.html,
    text:    payload.text,
    bcc:     bccList.length ? bccList.join(', ') : undefined,
  });

  return { messageId: info.messageId };
}

/** Verify SMTP connectivity — call from a health-check route or startup */
export async function verifySmtp(): Promise<void> {
  const transport = createTransport();
  await transport.verify();
}
