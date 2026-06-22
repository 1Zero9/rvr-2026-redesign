import { cookies } from 'next/headers';
import { ADMIN_COOKIE_NAME, verifyAdminSession } from '@/lib/admin/session';

export async function requireAdmin(): Promise<void> {
  const token = (await cookies()).get(ADMIN_COOKIE_NAME)?.value;
  if (!verifyAdminSession(token)) {
    throw new Error('Unauthorised admin action');
  }
}
