#!/usr/bin/env tsx
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

async function run() {
  const rows = await prisma.announcement.findMany({
    orderBy: { publishedAt: "desc" },
    select: { id: true, title: true, category: true, ctaLabel: true, ctaUrl: true },
  });
  for (const r of rows) {
    console.log(`[${r.category}]  cta="${r.ctaLabel ?? "(none)"}" → ${r.ctaUrl ?? "(none)"}`);
    console.log(`  Title: ${r.title}`);
    console.log(`  ID:    ${r.id}`);
    console.log();
  }
  await prisma.$disconnect();
}
run();
