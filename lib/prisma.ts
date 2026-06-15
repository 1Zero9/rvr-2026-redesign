import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  // Fail loudly rather than connecting with implicit dev credentials.
  // A misconfigured production deployment must crash on boot, not silently
  // fall through to a default that may succeed against localhost or leak.
  throw new Error(
    "DATABASE_URL is not set. " +
      "Configure it in .env.local (dev) or your hosting provider's secret store (prod).",
  );
}

const adapter = new PrismaPg({ connectionString: databaseUrl });

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
