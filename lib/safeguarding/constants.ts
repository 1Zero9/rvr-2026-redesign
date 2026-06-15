/**
 * FAI compliance thresholds.
 *
 * Sources:
 *   - FAI Governance Handbook §12.3–12.4 (Garda Vetting via COMET, 3-year max re-vetting)
 *   - FAI Child Welfare & Safeguarding Policy, 3rd edition (March 2025)
 *   - FAI Club Mark standard (mandatory December 2025)
 */

/** Days after Garda Vetting approval before it expires (3 years) */
export const VETTING_EXPIRY_DAYS = 1095;

/** Days after Safeguarding 1 completion before it requires renewal (3 years) */
export const SAFEGUARDING_1_EXPIRY_DAYS = 1095;

/** Days before expiry to raise a warning alert and send emails */
export const EXPIRY_WARNING_DAYS = 60;

/** Club name used in emails */
export const CLUB_NAME = 'Rivervalley Rangers AFC';

/** The Welfare Officer is always CC'd on all compliance alerts */
export const WELFARE_OFFICER_EMAIL = process.env.WELFARE_OFFICER_EMAIL ?? '';

/** From address for outbound compliance emails */
export const COMPLIANCE_EMAIL_FROM = process.env.COMPLIANCE_EMAIL_FROM ?? `noreply@rivervalleyrangers.ie`;

/** Secret header value that Vercel Cron sends to authenticate the cron endpoint */
export const CRON_SECRET = process.env.CRON_SECRET ?? '';
