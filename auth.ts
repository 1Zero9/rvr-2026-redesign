import NextAuth from "next-auth";
import Nodemailer from "next-auth/providers/nodemailer";
import { AdminPrismaAdapter } from "@/lib/competitions/auth-adapter";
import type { GlobalRole } from "@prisma/client";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: AdminPrismaAdapter(),
  providers: [
    Nodemailer({
      server: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT ?? "587"),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
      from: process.env.EMAIL_FROM ?? "noreply@rivervalleyrangers.ie",
    }),
  ],
  pages: {
    signIn: "/competitions/login",
    verifyRequest: "/competitions/login?verify=1",
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
