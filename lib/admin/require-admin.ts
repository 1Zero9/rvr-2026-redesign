import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { GlobalRole } from '@prisma/client';

export async function requireAdmin(): Promise<void> {
  const session = await auth();
  const role = (session?.user as { globalRole?: string | null } | undefined)?.globalRole;
  if (role !== GlobalRole.SITE_ADMIN && role !== GlobalRole.SUPER_ADMIN) {
    redirect('/admin/login');
  }
}
