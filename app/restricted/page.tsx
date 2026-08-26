import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Access Restricted',
  robots: { index: false, follow: false },
};

export default function RestrictedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-navy px-6 py-16 text-center">
      <div className="max-w-md space-y-6">
        <ShieldAlert className="mx-auto h-10 w-10 text-brand-neon" aria-hidden="true" />
        <div>
          <p className="font-display text-xs font-black uppercase tracking-widest text-brand-neon">
            Rivervalley Rangers AFC
          </p>
          <h1 className="mt-2 font-display text-3xl font-black uppercase italic text-white">
            Access Restricted
          </h1>
        </div>
        <p className="leading-relaxed text-brand-cream/80">
          You&apos;ve reached rivervalleyrangers.ie, but access to this site is currently
          restricted to visitors in Ireland.
        </p>
        <Link
          href="/contact"
          className="inline-flex min-h-[44px] items-center justify-center gap-2 border-2 border-brand-charcoal bg-brand-neon px-6 py-3 text-sm font-bold text-brand-charcoal shadow-brutalist transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
        >
          Click here to contact us
        </Link>
      </div>
    </main>
  );
}
