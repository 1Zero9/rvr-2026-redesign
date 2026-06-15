/**
 * POST /api/cron/safeguarding
 *
 * Invoked weekly by Vercel Cron (see vercel.json).
 * Also callable manually for ad-hoc compliance checks.
 *
 * Auth: Vercel Cron sends `Authorization: Bearer $CRON_SECRET`.
 * Set CRON_SECRET in your Vercel project environment variables.
 */

import { NextRequest, NextResponse } from 'next/server';
import { CRON_SECRET } from '@/lib/safeguarding/constants';
import { runSafeguardingCron } from '@/lib/safeguarding/cron-validator';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // seconds — allows for large staff lists

export async function POST(req: NextRequest): Promise<NextResponse> {
  // ------------------------------------------------------------------
  // Authentication
  // ------------------------------------------------------------------
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!CRON_SECRET || token !== CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  // ------------------------------------------------------------------
  // Run validator
  // ------------------------------------------------------------------
  try {
    const summary = await runSafeguardingCron();

    console.log('[cron/safeguarding] run complete', summary);

    return NextResponse.json({
      ok: true,
      summary: {
        runAt:               summary.runAt.toISOString(),
        totalStaffChecked:   summary.totalStaffChecked,
        compliantCount:      summary.compliantCount,
        nonCompliantCount:   summary.nonCompliantCount,
        alertsRaised:        summary.alertsRaised,
        emailsSent:          summary.emailsSent,
        errorCount:          summary.errors.length,
        // Only surface error details in development — not in prod responses
        errors: process.env.NODE_ENV === 'development' ? summary.errors : undefined,
      },
    });
  } catch (err) {
    console.error('[cron/safeguarding] fatal error:', err);
    return NextResponse.json(
      { error: 'Cron run failed', detail: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
