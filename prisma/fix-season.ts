import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  await prisma.$transaction([
    prisma.season.updateMany({ data: { isActive: false } }),
    prisma.season.upsert({
      where:  { label: '2025/26' },
      update: { isActive: true },
      create: { label: '2025/26', isActive: true },
    }),
  ]);

  console.log('Database updated: 2025/26 is now the active live season.');
}

main()
  .catch((err) => { console.error('Fix failed:', err); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
