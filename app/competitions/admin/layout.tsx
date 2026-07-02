import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function CompetitionsAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.email) redirect('/admin/login');

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
