import type { Metadata } from 'next';
import Link from 'next/link';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { GlobalRole } from '@prisma/client';
import AdminSidebar from '@/components/admin/AdminSidebar';

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
    <div className="flex min-h-screen bg-zinc-50">
      <AdminSidebar />

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 h-12 bg-brand-navy border-b border-brand-sky/10 flex items-center px-4 gap-4">
        <Link
          href="/admin"
          className="font-display font-black italic text-sm uppercase text-brand-neon"
        >
          RVR Admin
        </Link>
        <Link
          href="/"
          className="ml-auto text-xs font-bold text-brand-sky/50 hover:text-brand-sky transition-colors"
        >
          ← Site
        </Link>
      </div>

      <div className="flex-1 min-w-0 lg:pt-0 pt-12">
        {children}
      </div>
    </div>
  );
}
