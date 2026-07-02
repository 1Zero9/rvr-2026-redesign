/**
 * GET /api/health
 *
 * Deployment health check. Returns:
 *   200 { status: "ok", db: "connected" }   — all systems operational
 *   503 { status: "degraded", db: "error" }  — DB unreachable (env not set or network issue)
 *
 * Safe to poll from Vercel or external uptime monitors.
 * Does not expose sensitive env var values — only reports connectivity status.
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getFeatureAvailability } from '@/lib/features';

export const dynamic = 'force-dynamic';

export async function GET(): Promise<NextResponse> {
  const features = await getFeatureAvailability();
  const required = ['DATABASE_URL'];
  if (features.stripePayments) {
    required.push('STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET');
  }

  const missing = required.filter((key) => !process.env[key]);

  let dbStatus: 'connected' | 'error' = 'error';
  let dbError: string | undefined;

  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'connected';
  } catch (err) {
    dbError = err instanceof Error ? err.message : String(err);
    console.error('[api/health] Database check failed:', dbError);
  }

  const healthy = missing.length === 0 && dbStatus === 'connected';

  return NextResponse.json(
    {
      status: healthy ? 'ok' : 'degraded',
      db: dbStatus,
      features,
    },
    { status: healthy ? 200 : 503 },
  );
}
