import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireCompetitionSession, getAccessibleCompetitionIds } from "@/lib/competitions/auth-helpers";
import { CompetitionAdminShell } from "@/components/competitions/CompetitionAdminShell";
import { CompetitionCard } from "@/components/competitions/CompetitionCard";
import { GlobalRole } from "@prisma/client";

export const metadata = { title: "Competitions Dashboard | RVR Admin" };

export default async function CompetitionsAdminPage() {
  const user = await requireCompetitionSession();
  const accessibleIds = await getAccessibleCompetitionIds(user.id);

  const competitions = await prisma.competition.findMany({
    where: accessibleIds ? { id: { in: accessibleIds } } : undefined,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      slug: true,
      state: true,
      type: true,
      ageGroup: true,
      dates: true,
    },
  });

  const isSuperAdmin = user.globalRole === GlobalRole.SUPER_ADMIN;

  const dashboardNav = isSuperAdmin
    ? [
        { href: "/competitions/admin", label: "Dashboard" },
        { href: "/competitions/admin/users", label: "Users" },
        { href: "/competitions/admin/new", label: "New Competition" },
      ]
    : undefined;

  return (
    <CompetitionAdminShell nav={dashboardNav} title="Competitions Dashboard">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-zinc-500">{competitions.length} competition{competitions.length !== 1 ? "s" : ""}</p>
          {isSuperAdmin && (
            <Link
              href="/competitions/admin/new"
              className="inline-flex items-center min-h-[44px] px-5 bg-brand-neon text-brand-charcoal font-display font-black italic uppercase text-sm border-3 border-brand-charcoal shadow-brutalist hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
              + New Competition
            </Link>
          )}
        </div>

        {competitions.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-brand-navy/20">
            <p className="text-zinc-400 text-sm mb-4">No competitions yet.</p>
            {isSuperAdmin && (
              <Link href="/competitions/admin/new" className="text-brand-navy font-bold text-sm hover:text-brand-neon">
                Create your first competition →
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {competitions.map((c) => (
              <CompetitionCard
                key={c.id}
                competition={c}
                href={`/competitions/admin/${c.id}`}
              />
            ))}
          </div>
        )}
      </div>
    </CompetitionAdminShell>
  );
}
