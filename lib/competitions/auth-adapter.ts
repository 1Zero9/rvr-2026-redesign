import type { Adapter, AdapterUser, AdapterSession, AdapterAccount, VerificationToken } from "@auth/core/adapters";
import { prisma } from "@/lib/prisma";

function toAdapterUser(u: {
  id: string;
  email: string;
  emailVerified: Date | null;
  name: string | null;
  image: string | null;
  globalRole: import("@prisma/client").GlobalRole | null;
}): AdapterUser & { globalRole: import("@prisma/client").GlobalRole | null } {
  return {
    id: u.id,
    email: u.email,
    emailVerified: u.emailVerified,
    name: u.name,
    image: u.image,
    globalRole: u.globalRole,
  };
}

export function AdminPrismaAdapter(): Adapter {
  return {
    async createUser(user) {
      const u = await prisma.adminUser.create({
        data: {
          email: user.email,
          emailVerified: user.emailVerified,
          name: user.name ?? null,
          image: user.image ?? null,
        },
      });
      return toAdapterUser(u);
    },

    async getUser(id) {
      const u = await prisma.adminUser.findUnique({ where: { id } });
      return u ? toAdapterUser(u) : null;
    },

    async getUserByEmail(email) {
      const u = await prisma.adminUser.findUnique({ where: { email } });
      return u ? toAdapterUser(u) : null;
    },

    async getUserByAccount({ provider, providerAccountId }) {
      const account = await prisma.authAccount.findUnique({
        where: { provider_providerAccountId: { provider, providerAccountId } },
        include: { user: true },
      });
      return account?.user ? toAdapterUser(account.user) : null;
    },

    async updateUser(user) {
      const u = await prisma.adminUser.update({
        where: { id: user.id },
        data: {
          email: user.email,
          emailVerified: user.emailVerified,
          name: user.name,
          image: user.image,
        },
      });
      return toAdapterUser(u);
    },

    async deleteUser(userId) {
      await prisma.adminUser.delete({ where: { id: userId } });
    },

    async linkAccount(account) {
      await prisma.authAccount.create({
        data: {
          userId: account.userId,
          type: account.type,
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          refresh_token: account.refresh_token ?? null,
          access_token: account.access_token ?? null,
          expires_at: account.expires_at ?? null,
          token_type: account.token_type ?? null,
          scope: account.scope ?? null,
          id_token: account.id_token ?? null,
          session_state: (account.session_state as string | null) ?? null,
        },
      });
      return account as AdapterAccount;
    },

    async unlinkAccount({ provider, providerAccountId }) {
      await prisma.authAccount.delete({
        where: { provider_providerAccountId: { provider, providerAccountId } },
      });
    },

    async createSession(session) {
      // Enforce single session per user — invalidate all other sessions on new sign-in
      await prisma.authSession.deleteMany({ where: { userId: session.userId } });
      const s = await prisma.authSession.create({ data: session });
      return s as AdapterSession;
    },

    async getSessionAndUser(sessionToken) {
      const session = await prisma.authSession.findUnique({
        where: { sessionToken },
        include: { user: true },
      });
      if (!session) return null;
      return {
        session: {
          sessionToken: session.sessionToken,
          userId: session.userId,
          expires: session.expires,
        },
        user: toAdapterUser(session.user),
      };
    },

    async updateSession(session) {
      const s = await prisma.authSession.update({
        where: { sessionToken: session.sessionToken },
        data: { expires: session.expires },
      });
      return s as AdapterSession;
    },

    async deleteSession(sessionToken) {
      const s = await prisma.authSession.delete({ where: { sessionToken } });
      return s as AdapterSession;
    },

    async createVerificationToken(token) {
      const t = await prisma.verificationToken.create({ data: token });
      return t as VerificationToken;
    },

    async useVerificationToken({ identifier, token }) {
      try {
        const t = await prisma.verificationToken.delete({
          where: { identifier_token: { identifier, token } },
        });
        return t as VerificationToken;
      } catch {
        return null;
      }
    },
  };
}
