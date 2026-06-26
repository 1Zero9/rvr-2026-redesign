import type { GlobalRole } from "@prisma/client";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      globalRole: GlobalRole | null;
    } & DefaultSession["user"];
  }
  interface User {
    globalRole?: GlobalRole | null;
    emailVerified?: Date | null;
  }
}
