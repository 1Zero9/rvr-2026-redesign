/**
 * Emergency season activation script.
 *
 * Usage:
 *   npx tsx scripts/activate-season.ts
 *   npx tsx scripts/activate-season.ts 2024/25   # activate a specific label
 *
 * Requires DATABASE_URL to be set. Safe to run multiple times — idempotent.
 */

import { PrismaClient } from '@prisma/client';
import { CLUB_SEASON } from '../config/club-season';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const target = process.argv[2] ?? CLUB_SEASON.currentSeason;

  console.log(`Activating season: "${target}"`);

  await prisma.$transaction(async (tx) => {
    // 1. Deactivate all existing seasons
    const deactivated = await tx.season.updateMany({
      data: { isActive: false },
    });
    console.log(`  Deactivated ${deactivated.count} existing season record(s).`);

    // 2. Upsert target season as active (creates the row if it does not exist)
    const season = await tx.season.upsert({
      where:  { label: target },
      update: { isActive: true },
      create: { label: target, isActive: true },
    });
    console.log(`  Season "${season.label}" is now active (id: ${season.id}).`);
  });

  // Verification read
  const active = await prisma.season.findFirst({
    where: { isActive: true },
    select: { id: true, label: true, isActive: true },
  });
  console.log('Active season confirmed:', active ?? 'NONE — something went wrong');
}

main()
  .then(() => {
    console.log('Done.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Season activation failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
