import { signIn } from '@/auth';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { GlobalRole } from '@prisma/client';

export const metadata = { title: 'Admin Login | RVR' };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ verify?: string; error?: string; callbackUrl?: string }>;
}) {
  const [session, params] = await Promise.all([auth(), searchParams]);

  const role = (session?.user as { globalRole?: string | null } | undefined)?.globalRole;
  if (role === GlobalRole.SITE_ADMIN || role === GlobalRole.SUPER_ADMIN) {
    redirect(params.callbackUrl ?? '/admin');
  }
  if (session) {
    // Authenticated but no admin role — redirect to competitions admin
    redirect(params.callbackUrl ?? '/competitions/admin');
  }

  const callbackUrl = params.callbackUrl;

  if (params.verify) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <p className="font-display text-xs font-black uppercase tracking-widest text-brand-green mb-6">
            Rivervalley Rangers
          </p>
          <div className="bg-white border-3 border-brand-charcoal shadow-brutalist p-8">
            <div className="text-4xl mb-4">📬</div>
            <h1 className="font-display font-black italic text-2xl uppercase text-brand-navy mb-2">
              Check Your Email
            </h1>
            <p className="text-brand-charcoal/60 text-sm leading-relaxed">
              A magic link has been sent. Click it to sign in — the link expires in 24 hours.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <p className="font-display text-xs font-black uppercase tracking-widest text-brand-green mb-1">
            Rivervalley Rangers
          </p>
          <h1 className="font-display font-black italic text-4xl uppercase text-brand-navy leading-none">
            Admin
          </h1>
          <p className="text-brand-charcoal/60 text-sm mt-2">
            Enter your email to receive a sign-in link.
          </p>
        </div>

        {params.error && (
          <div className="mb-4 bg-brand-maroon/10 border-2 border-brand-maroon text-brand-maroon text-sm px-4 py-3 font-semibold">
            Something went wrong. Please try again.
          </div>
        )}

        <div className="bg-white border-3 border-brand-charcoal shadow-brutalist p-6 space-y-4">
          <form
            action={async (formData: FormData) => {
              'use server';
              const email = formData.get('email') as string;
              const destination = (formData.get('callbackUrl') as string | null) || '/admin';
              await signIn('resend', { email, redirectTo: destination, redirect: false });
              redirect('/admin/login?verify=1');
            }}
            className="space-y-4"
          >
            <input type="hidden" name="callbackUrl" value={callbackUrl ?? '/admin'} />
            <div>
              <label htmlFor="email" className="block text-xs font-black uppercase tracking-wider text-brand-navy/60 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoFocus
                placeholder="you@rivervalleyrangers.ie"
                className="w-full border-2 border-brand-navy/20 bg-brand-cream text-brand-charcoal placeholder:text-brand-charcoal/30 px-3 py-2 min-h-[44px] focus:outline-none focus:border-brand-neon"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-brand-neon text-brand-charcoal font-display font-black uppercase tracking-wide min-h-[44px] border-3 border-brand-charcoal shadow-brutalist hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
              Send Magic Link →
            </button>
          </form>
        </div>

        <p className="mt-4 text-xs text-brand-charcoal/40 text-center">
          Access is restricted to authorised administrators.
        </p>
      </div>
    </div>
  );
}
