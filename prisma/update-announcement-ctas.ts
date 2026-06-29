#!/usr/bin/env tsx

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is required.");
  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}

const UPDATES: Array<{ titleContains: string; ctaLabel: string; ctaUrl: string }> = [
  {
    titleContains: "FAI Club Mark",
    ctaLabel: "About the Club",
    ctaUrl: "/club",
  },
  {
    titleContains: "Ladies Football Fit",
    ctaLabel: "Find Out More",
    ctaUrl: "/seniors",
  },
  {
    titleContains: "Walking Football",
    ctaLabel: "Walking Football Info",
    ctaUrl: "/walking-football",
  },
  {
    titleContains: "Football For All",
    ctaLabel: "Football For All",
    ctaUrl: "/football-for-all",
  },
  {
    titleContains: "Academy",
    ctaLabel: "Register Now",
    ctaUrl: "/register",
  },
];

async function run() {
  const prisma = createPrismaClient();
  try {
    for (const { titleContains, ctaLabel, ctaUrl } of UPDATES) {
      const result = await prisma.announcement.updateMany({
        where: { title: { contains: titleContains } },
        data: { ctaLabel, ctaUrl },
      });
      console.log(`"${titleContains}" — updated ${result.count} row(s) → ${ctaUrl}`);
    }
    console.log("Done.");
  } finally {
    await prisma.$disconnect();
  }
}

run().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
