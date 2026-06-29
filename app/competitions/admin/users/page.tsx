import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/competitions/auth-helpers";
import { CompetitionAdminShell } from "@/components/competitions/CompetitionAdminShell";
import { GlobalRole } from "@prisma/client";
import { createId } from "@paralleldrive/cuid2";

export const metadata = { title: "Admin Users | RVR Competitions" };

const nav = [
  { href: "/competitions/admin", label: "← Dashboard" },
  { href: "/competitions/admin/users", label: "Users" },
];

export default async function AdminUsersPage() {
  await requireSuperAdmin();

  const users = await prisma.adminUser.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      assignments: {
        include: { competition: { select: { name: true } } },
      },
    },
  });

  async function inviteUser(formData: FormData) {
    "use server";
    await requireSuperAdmin();
    const email = (formData.get("email") as string).trim().toLowerCase();
    const name = (formData.get("name") as string | null)?.trim() || null;
    if (!email) return;

    await prisma.adminUser.upsert({
      where: { email },
      update: name ? { name } : {},
      create: { id: createId(), email, name },
    });
    redirect("/competitions/admin/users");
  }

  async function removeUser(formData: FormData) {
    "use server";
    await requireSuperAdmin();
    const userId = formData.get("userId") as string;
    await prisma.adminUser.delete({ where: { id: userId } });
    redirect("/competitions/admin/users");
  }

  async function setGlobalRole(formData: FormData) {
    "use server";
    await requireSuperAdmin();
    const userId = formData.get("userId") as string;
    const role = formData.get("role") as string;
    await prisma.adminUser.update({
      where: { id: userId },
      data: { globalRole: role === "SUPER_ADMIN" ? GlobalRole.SUPER_ADMIN : null },
    });
    redirect("/competitions/admin/users");
  }

  return (
    <CompetitionAdminShell nav={nav} title="Admin Users">
      <div className="space-y-8">
        {/* Invite form */}
        <div className="border-3 border-brand-navy/20 p-5 bg-white">
          <h2 className="font-display font-black italic text-lg uppercase text-brand-navy mb-4">
            Invite User
          </h2>
          <form action={inviteUser} className="flex flex-wrap gap-3 items-end">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-brand-navy/60 uppercase tracking-wider">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="admin@example.com"
                className="border-2 border-brand-navy/30 bg-white px-3 py-2 min-h-[44px] text-sm min-w-[240px] focus:outline-none focus:border-brand-neon"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-brand-navy/60 uppercase tracking-wider">
                Name (optional)
              </label>
              <input
                name="name"
                type="text"
                placeholder="Full name"
                className="border-2 border-brand-navy/30 bg-white px-3 py-2 min-h-[44px] text-sm min-w-[180px] focus:outline-none focus:border-brand-neon"
              />
            </div>
            <button
              type="submit"
              className="min-h-[44px] px-5 bg-brand-navy text-brand-neon font-display font-black italic uppercase text-sm border-3 border-brand-charcoal shadow-brutalist hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
              Add User
            </button>
          </form>
          <p className="mt-2 text-xs text-zinc-400">
            Adding a user here allows them to sign in with the magic link. Assign a role or competitions below.
          </p>
        </div>

        {/* Users table */}
        {users.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-brand-navy/20">
            <p className="text-zinc-400 text-sm">No admin users yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="border-2 border-brand-navy/20 bg-white p-4 flex flex-wrap gap-4 items-start justify-between"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-brand-navy text-sm">
                      {user.name ?? user.email}
                    </p>
                    {user.globalRole === GlobalRole.SUPER_ADMIN && (
                      <span className="px-2 py-0.5 text-xs font-bold bg-brand-neon text-brand-charcoal uppercase">
                        Super Admin
                      </span>
                    )}
                  </div>
                  {user.name && (
                    <p className="text-xs text-zinc-400 mt-0.5">{user.email}</p>
                  )}
                  {user.assignments.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {user.assignments.map((a) => (
                        <span
                          key={a.id}
                          className="px-2 py-0.5 text-xs border border-brand-navy/20 text-brand-navy/70"
                        >
                          {a.competition.name} — {a.role.replace("_", " ")}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 shrink-0">
                  {/* Toggle super admin */}
                  <form action={setGlobalRole}>
                    <input type="hidden" name="userId" value={user.id} />
                    <input
                      type="hidden"
                      name="role"
                      value={user.globalRole === GlobalRole.SUPER_ADMIN ? "" : "SUPER_ADMIN"}
                    />
                    <button
                      type="submit"
                      className="min-h-[36px] px-3 text-xs font-bold border-2 border-brand-navy/30 hover:border-brand-navy transition-colors"
                    >
                      {user.globalRole === GlobalRole.SUPER_ADMIN
                        ? "Remove Super Admin"
                        : "Make Super Admin"}
                    </button>
                  </form>

                  {/* Manage assignments */}
                  <Link
                    href={`/competitions/admin/users/${user.id}`}
                    className="min-h-[36px] px-3 flex items-center text-xs font-bold border-2 border-brand-navy/30 hover:border-brand-neon transition-colors"
                  >
                    Manage Competitions
                  </Link>

                  {/* Remove user */}
                  <form action={removeUser}>
                    <input type="hidden" name="userId" value={user.id} />
                    <button
                      type="submit"
                      className="min-h-[36px] px-3 text-xs font-bold border-2 border-brand-maroon/40 text-brand-maroon hover:bg-brand-maroon hover:text-white transition-colors"
                    >
                      Remove
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </CompetitionAdminShell>
  );
}
