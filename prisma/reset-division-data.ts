/**
 * Emergency data reset — U12 Major Saturday division.
 *
 * Deletes all HistoricalStanding rows whose divisionName matches the U12 Major
 * Saturday competition, clearing the slate before a clean re-sync against the
 * correct SportLoMo competition ID (208581 / "12 MAJOR BOYS SAT").
 *
 * Usage:
 *   npx tsx prisma/reset-division-data.ts
 *
 * After this script completes:
 *   1. Restart the Next.js server — this wipes the in-process response cache.
 *   2. Call GET /api/fixtures/sync to pull a fresh dataset from SportLoMo.
 *   3. Verify the U12 Major Saturday table contains only registered members.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Division name variants that may have been seeded from the wrong competition
// ID. The deleteMany call uses exact-match `in` to avoid accidental deletions
// in other age groups.
const STALE_DIVISION_NAMES = [
  'DDSL U12 Boys Major Saturday',
  '12 MAJOR BOYS SAT',
  'DDSL 12 MAJOR BOYS SAT',
  'U12 Major Boys Saturday',
  'U12 Boys Major Saturday',
] as const;

async function main(): Promise<void> {
  console.log('=== RVR Division Data Reset ===');
  console.log('Target: U12 Major Saturday (SportLoMo competition ID 208581)');
  console.log('');

  console.log('Step 1 — Deleting stale HistoricalStanding rows...');
  const result = await prisma.historicalStanding.deleteMany({
    where: {
      divisionName: { in: [...STALE_DIVISION_NAMES] },
    },
  });

  if (result.count === 0) {
    console.log('  No stale rows found — HistoricalStanding table was already clean.');
  } else {
    console.log(`  Deleted ${result.count} stale HistoricalStanding row(s).`);
  }

  console.log('');
  console.log('Step 2 — Verifying remaining U12 data...');
  const remaining = await prisma.historicalStanding.count({
    where: {
      divisionName: { contains: 'U12' },
    },
  });
  console.log(
    remaining === 0
      ? '  No U12 HistoricalStanding rows remain. Database is clean.'
      : `  ${remaining} U12 HistoricalStanding row(s) remain (from other U12 divisions — review if unexpected).`,
  );

  console.log('');
  console.log('=== Reset complete ===');
  console.log('');
  console.log('Next steps:');
  console.log('  1. Restart the Next.js server to flush the in-process SportLoMo cache.');
  console.log('  2. Call GET /api/fixtures/sync to re-fetch from the correct competition ID.');
  console.log('  3. Confirm "Coolmine Athletic FC" no longer appears in the U12 Major Saturday table.');
}

main()
  .catch((err) => {
    console.error('Reset failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
