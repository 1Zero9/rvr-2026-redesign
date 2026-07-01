import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";
import { AdminPrismaAdapter } from "@/lib/competitions/auth-adapter";
import type { GlobalRole } from "@prisma/client";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: AdminPrismaAdapter(),
  providers: [
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY,
      from: process.env.EMAIL_FROM ?? "noreply@rivervalleyrangers.ie",
    }),
  ],
  pages: {
    signIn: "/admin/login",
    verifyRequest: "/admin/login?verify=1",
  },
  session: {
    // 8-hour idle timeout: session expires 8h after last activity
    maxAge: 8 * 60 * 60,
    // Refresh session expiry on every request (so idle = no requests for 8h)
    updateAge: 60,
  },
  callbacks: {
    session({ session, user }) {
      const u = user as { id: string; globalRole?: GlobalRole | null };
      return {
        ...session,
        user: {
          ...session.user,
          id: u.id,
          globalRole: u.globalRole ?? null,
        },
      };
    },
  },
  trustHost: true,
});
