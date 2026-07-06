import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { GlobalRole } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminMobileNav from '@/components/admin/AdminMobileNav';

export default async function CompetitionsAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.email) redirect('/admin/login');

  const user = session.user as {
    name?: string | null;
    email?: string | null;
    globalRole?: string | null;
  };
  const role = user.globalRole ?? null;

  const [annCount, regCount, enqCount] = await Promise.all([
    prisma.announcement.count({ where: { isPublished: false } }),
    prisma.playerProfile.count({ where: { registrationStatus: 'NEW' } }),
    prisma.publicEnquiry.count({ where: { status: 'NEW' } }),
  ]);

  const badges = { ann: annCount, reg: regCount, enq: enqCount };
  const displayName = user.name ?? user.email ?? '';

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <AdminSidebar
        badges={badges}
        role={role}
        displayName={displayName}
        email={user.email ?? ''}
      />

      <AdminMobileNav
        badges={badges}
        role={role}
        displayName={displayName}
        isSuperAdmin={role === GlobalRole.SUPER_ADMIN}
      />

      <div className="flex-1 min-w-0 lg:pt-0 pt-14">
        {children}
      </div>
    </div>
  );
}
