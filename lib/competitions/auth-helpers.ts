import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { GlobalRole, AssignmentRole } from "@prisma/client";
import type { SessionUser } from "./types";

export async function requireCompetitionSession(): Promise<SessionUser> {
  const session = await auth();
  if (!session?.user?.email) redirect("/admin/login");
  return session.user as SessionUser;
}

export async function requireSuperAdmin(): Promise<SessionUser> {
  const user = await requireCompetitionSession();
  if (user.globalRole !== GlobalRole.SUPER_ADMIN) {
    redirect("/competitions/admin");
  }
  return user;
}

export async function requireSiteAdmin(): Promise<SessionUser> {
  const user = await requireCompetitionSession();
  if (user.globalRole !== GlobalRole.SITE_ADMIN && user.globalRole !== GlobalRole.SUPER_ADMIN) {
    redirect("/admin/login");
  }
  return user;
}

export async function requireEventAdmin(competitionId: string): Promise<SessionUser> {
  const user = await requireCompetitionSession();
  if (user.globalRole === GlobalRole.SUPER_ADMIN) return user;

  const assignment = await prisma.competitionAssignment.findFirst({
    where: {
      adminUserId: user.id,
      competitionId,
      role: { in: [AssignmentRole.EVENT_ADMIN, AssignmentRole.PITCH_ADMIN] },
    },
  });
  if (!assignment) redirect("/competitions/admin");
  return user;
}

export async function requirePitchAdmin(
  competitionId: string,
  pitchId: string,
): Promise<SessionUser> {
  const user = await requireCompetitionSession();
  if (user.globalRole === GlobalRole.SUPER_ADMIN) return user;

  const assignment = await prisma.competitionAssignment.findFirst({
    where: {
      adminUserId: user.id,
      competitionId,
      role: AssignmentRole.PITCH_ADMIN,
      pitchId,
    },
  });
  if (!assignment) redirect("/admin/login");
  return user;
}

export async function getAccessibleCompetitionIds(userId: string): Promise<string[] | null> {
  const user = await prisma.adminUser.findUnique({
    where: { id: userId },
    select: { globalRole: true },
  });
  if (user?.globalRole === GlobalRole.SUPER_ADMIN) return null; // null = all

  const assignments = await prisma.competitionAssignment.findMany({
    where: { adminUserId: userId },
    select: { competitionId: true },
  });
  return assignments.map((a) => a.competitionId);
}
