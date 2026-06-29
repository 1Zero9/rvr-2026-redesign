import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/competitions/auth-helpers";
import { CompetitionAdminShell } from "@/components/competitions/CompetitionAdminShell";
import { AssignmentRole } from "@prisma/client";
import { createId } from "@paralleldrive/cuid2";

export const metadata = { title: "Manage User | RVR Competitions" };

export default async function ManageUserPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  await requireSuperAdmin();

  const [user, competitions] = await Promise.all([
    prisma.adminUser.findUnique({
      where: { id: userId },
      include: {
        assignments: {
          include: { competition: { select: { id: true, name: true } } },
          orderBy: { createdAt: "asc" },
        },
      },
    }),
    prisma.competition.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!user) notFound();

  const assignedCompIds = new Set(user.assignments.map((a) => a.competitionId));
  const unassigned = competitions.filter((c) => !assignedCompIds.has(c.id));

  const nav = [
    { href: "/competitions/admin/users", label: "← Users" },
    { href: `/competitions/admin/users/${userId}`, label: user.name ?? user.email },
  ];

  async function addAssignment(formData: FormData) {
    "use server";
    await requireSuperAdmin();
    const competitionId = formData.get("competitionId") as string;
    const role = formData.get("role") as AssignmentRole;
    if (!competitionId || !role) return;

    await prisma.competitionAssignment.create({
      data: {
        id: createId(),
        adminUserId: userId,
        competitionId,
        role,
      },
    });
    redirect(`/competitions/admin/users/${userId}`);
  }

  async function removeAssignment(formData: FormData) {
    "use server";
    await requireSuperAdmin();
    const assignmentId = formData.get("assignmentId") as string;
    await prisma.competitionAssignment.delete({ where: { id: assignmentId } });
    redirect(`/competitions/admin/users/${userId}`);
  }

  return (
    <CompetitionAdminShell nav={nav} title={user.name ?? user.email}>
      <div className="space-y-8">
        {/* User info */}
        <div className="border-2 border-brand-navy/20 bg-white p-4">
          <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <dt className="text-xs font-bold text-brand-navy/50 uppercase tracking-wider mb-1">Email</dt>
              <dd className="text-brand-navy">{user.email}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold text-brand-navy/50 uppercase tracking-wider mb-1">Name</dt>
              <dd className="text-brand-navy">{user.name ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold text-brand-navy/50 uppercase tracking-wider mb-1">Global Role</dt>
              <dd className="text-brand-navy">{user.globalRole ?? "None"}</dd>
            </div>
          </dl>
        </div>

        {/* Current assignments */}
        <div>
          <h2 className="font-display font-black italic text-lg uppercase text-brand-navy mb-3">
            Competition Assignments
          </h2>

          {user.assignments.length === 0 ? (
            <p className="text-sm text-zinc-400 mb-4">No competition assignments yet.</p>
          ) : (
            <div className="space-y-2 mb-4">
              {user.assignments.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between gap-4 border-2 border-brand-navy/15 bg-white px-4 py-2"
                >
                  <div>
                    <p className="text-sm font-bold text-brand-navy">{a.competition.name}</p>
                    <p className="text-xs text-zinc-400">{a.role.replace("_", " ")}</p>
                  </div>
                  <form action={removeAssignment}>
                    <input type="hidden" name="assignmentId" value={a.id} />
                    <button
                      type="submit"
                      className="min-h-[36px] px-3 text-xs font-bold border-2 border-brand-maroon/40 text-brand-maroon hover:bg-brand-maroon hover:text-white transition-colors"
                    >
                      Remove
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )}

          {/* Add assignment */}
          {unassigned.length > 0 && (
            <form action={addAssignment} className="flex flex-wrap gap-3 items-end border-t border-brand-navy/10 pt-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-brand-navy/60 uppercase tracking-wider">
                  Competition
                </label>
                <select
                  name="competitionId"
                  required
                  className="border-2 border-brand-navy/30 bg-white px-3 py-2 min-h-[44px] text-sm min-w-[200px] focus:outline-none focus:border-brand-neon"
                >
                  {unassigned.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-brand-navy/60 uppercase tracking-wider">
                  Role
                </label>
                <select
                  name="role"
                  required
                  className="border-2 border-brand-navy/30 bg-white px-3 py-2 min-h-[44px] text-sm min-w-[160px] focus:outline-none focus:border-brand-neon"
                >
                  <option value={AssignmentRole.EVENT_ADMIN}>Event Admin</option>
                  <option value={AssignmentRole.PITCH_ADMIN}>Pitch Admin</option>
                </select>
              </div>
              <button
                type="submit"
                className="min-h-[44px] px-5 bg-brand-navy text-brand-neon font-display font-black italic uppercase text-sm border-3 border-brand-charcoal shadow-brutalist hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
              >
                Assign
              </button>
            </form>
          )}

          {unassigned.length === 0 && competitions.length > 0 && (
            <p className="text-xs text-zinc-400 border-t border-brand-navy/10 pt-3">
              This user is assigned to all competitions.
            </p>
          )}

          {competitions.length === 0 && (
            <p className="text-xs text-zinc-400 border-t border-brand-navy/10 pt-3">
              No competitions exist yet.
            </p>
          )}
        </div>
      </div>
    </CompetitionAdminShell>
  );
}
