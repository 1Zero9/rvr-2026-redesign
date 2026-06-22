import { config } from "dotenv";
config({ path: ".env.local" });
import { defineConfig } from "prisma/config";
import { normalizeDatabaseUrl } from "./lib/database-url";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: normalizeDatabaseUrl(process.env.DATABASE_URL),
  },
});
