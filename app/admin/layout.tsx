import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { GlobalRole } from '@prisma/client';
import AdminNav from '@/components/admin/AdminNav';

export const metadata: Metadata = {
  robots: { index: false, follow: false, noarchive: true },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const hdrs = await headers();
  const pathname = hdrs.get('x-pathname') ?? '';

  // Login page — no auth check, no nav
  if (pathname === '/admin/login') return <>{children}</>;

  // Auth check — role must be SITE_ADMIN or SUPER_ADMIN
  const session = await auth();
  const role = (session?.user as { globalRole?: string | null } | undefined)?.globalRole;
  if (role !== GlobalRole.SITE_ADMIN && role !== GlobalRole.SUPER_ADMIN) {
    redirect('/admin/login');
  }

  return (
    <>
      <AdminNav />
      {children}
    </>
  );
}
