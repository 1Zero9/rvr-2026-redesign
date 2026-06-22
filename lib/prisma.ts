import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { normalizeDatabaseUrl } from "@/lib/database-url";

const globalForPrisma = globalThis as unknown as { _prisma?: PrismaClient };

function createClient(): PrismaClient {
  const url = normalizeDatabaseUrl(process.env.DATABASE_URL);
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. " +
        "Configure it in .env.local (dev) or your hosting provider's secret store (prod).",
    );
  }
  return new PrismaClient({
    adapter: new PrismaPg({ connectionString: url }),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

function getClient(): PrismaClient {
  if (!globalForPrisma._prisma) {
    globalForPrisma._prisma = createClient();
  }
  return globalForPrisma._prisma;
}

// Proxy defers client creation (and the DATABASE_URL check) until the first
// actual DB call. This lets Next.js import this module at build time without
// DATABASE_URL being available on the build machine.
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    return Reflect.get(getClient(), prop, receiver);
  },
});
