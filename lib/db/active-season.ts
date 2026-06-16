import { prisma } from '@/lib/prisma';

/**
 * Prisma `where` fragment for HistoricalStanding queries.
 *
 * Apply this whenever reading from the HistoricalStanding table to ensure
 * only the current active season's data is returned. This prevents finished
 * seasons from leaking into live DDSL data streams.
 *
 * Usage:
 *   prisma.historicalStanding.findMany({
 *     where: { ...ACTIVE_SEASON_WHERE, divisionName: 'DDSL U15 Boys Division 2' },
 *     orderBy: { position: 'asc' },
 *   })
 */
export const ACTIVE_SEASON_WHERE = {
  season: { isActive: true },
} as const;

/**
 * Returns the label of the currently active Season row (e.g., "2025/26").
 *
 * Resolution order:
 *   1. DB: Season row where isActive = true
 *   2. SPORTLOMO_SEASON environment variable
 *   3. Current calendar year string as a last resort
 *
 * All database errors are caught and swallowed so that a missing or
 * unavailable database (e.g., local dev without DATABASE_URL) never blocks
 * the fixtures routes from falling back to their mock datasets.
 */
export async function resolveActiveSeason(): Promise<string> {
  try {
    const active = await prisma.season.findFirst({
      where: { isActive: true },
      select: { label: true },
    });
    if (active) return active.label;
  } catch {
    // Database unavailable or not yet configured — fall through to env var.
  }
  return process.env.SPORTLOMO_SEASON ?? String(new Date().getFullYear());
}

/**
 * Activates a season by label, deactivating all others in the same
 * transaction to preserve the single-active-season invariant.
 *
 * Throws if no Season row with the given label exists.
 */
export async function setActiveSeason(label: string): Promise<void> {
  await prisma.$transaction([
    prisma.season.updateMany({ data: { isActive: false } }),
    prisma.season.update({
      where: { label },
      data: { isActive: true },
    }),
  ]);
}
