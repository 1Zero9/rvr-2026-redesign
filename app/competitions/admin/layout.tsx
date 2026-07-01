import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import AdminNav from '@/components/admin/AdminNav';

export default async function CompetitionsAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.email) redirect('/admin/login');

  return (
    <>
      <AdminNav />
      {children}
    </>
  );
}
