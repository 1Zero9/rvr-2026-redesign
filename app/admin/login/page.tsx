import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  ADMIN_COOKIE_NAME,
  createAdminSession,
  isAdminSecretConfigured,
} from '@/lib/admin/session';

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  async function login(formData: FormData) {
    'use server';
    const entered = formData.get('secret') as string;
    if (isAdminSecretConfigured() && entered === process.env.ADMIN_SECRET) {
      const jar = await cookies();
      jar.set(ADMIN_COOKIE_NAME, createAdminSession(), {
        httpOnly: true,
        secure:   process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path:     '/admin',
        maxAge:   60 * 60 * 8, // 8 hours
        priority: 'high',
      });
      redirect('/admin/announcements');
    }
    redirect('/admin/login?error=1');
  }

  return (
    <div className="min-h-screen bg-brand-navy flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-display font-black italic text-3xl text-brand-neon uppercase mb-1">
          RVR Admin
        </h1>
        <p className="text-brand-sky text-sm mb-8">Enter the admin secret to continue.</p>

        {error && (
          <p className="text-brand-maroon text-sm font-bold mb-4">
            Incorrect secret — try again.
          </p>
        )}

        <form action={login} className="space-y-4">
          <div>
            <label htmlFor="secret" className="block text-sm font-bold text-brand-sky mb-1">
              Admin Secret
            </label>
            <input
              id="secret"
              name="secret"
              type="password"
              required
              autoFocus
              className="w-full border-2 border-brand-sky/40 bg-white/5 text-brand-cream px-3 py-2 min-h-[44px] focus:outline-none focus:border-brand-neon"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-brand-neon text-brand-charcoal font-bold min-h-[44px] border-3 border-brand-charcoal shadow-brutalist hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
