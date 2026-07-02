import type { ReactNode } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';

interface PublicPageShellProps {
  children: ReactNode;
  className?: string;
}

const FOOTER_LINKS = [
  { label: 'All Teams',       href: '/teams'              },
  { label: 'Fixtures',        href: '/fixtures'           },
  { label: 'Register',        href: '/register'           },
  { label: 'Book Astro',      href: '/astro-booking'      },
  { label: 'Pitch Locations', href: '/pitch-locations'    },
  { label: 'About the Club',  href: '/club'               },
  { label: 'About Swords',   href: '/swords'             },
  { label: 'Safeguarding',    href: '/club/safeguarding'  },
  { label: 'Contact',         href: '/contact'            },
  { label: 'News',            href: '/news'               },
];

export default function PublicPageShell({
  children,
  className = '',
}: PublicPageShellProps) {
  return (
    <div className={`site-canvas flex min-h-screen flex-col ${className}`}>
      {/* Skip-to-content — visible on keyboard focus only */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[999] focus:inline-flex focus:min-h-[44px] focus:items-center focus:px-4 focus:bg-brand-neon focus:text-brand-charcoal focus:font-display focus:font-black focus:uppercase focus:text-sm focus:border-3 focus:border-brand-charcoal focus:shadow-brutalist"
      >
        Skip to main content
      </a>

      <Header />
      <main id="main-content" className="flex-1">{children}</main>

      <footer className="bg-brand-navy border-t border-brand-sky/15">
        {/* Join CTA strip */}
        <div className="bg-brand-navy border-b border-brand-sky/10">
          <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-display font-black italic text-xl uppercase text-brand-cream leading-tight">
                Ready to join Rivervalley Rangers?
              </p>
              <p className="text-brand-sky/70 text-sm mt-1">
                Teams for every age, every level — from Academy to Seniors.
              </p>
            </div>
            <Link
              href="/register"
              className="shrink-0 inline-flex items-center gap-2 min-h-[48px] px-7 bg-brand-neon text-brand-charcoal font-display font-black italic uppercase text-sm border-3 border-brand-charcoal shadow-brutalist hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all whitespace-nowrap"
            >
              Register Now →
            </Link>
          </div>
        </div>

        {/* Nav row */}
        <div className="max-w-6xl mx-auto px-6 py-6 border-b border-brand-sky/10">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {FOOTER_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-zinc-400 hover:text-brand-neon text-sm font-semibold transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="max-w-6xl mx-auto px-6 py-5">
          <p className="text-xs text-zinc-500 text-center sm:text-left">
            &copy; {new Date().getFullYear()} Rivervalley Rangers AFC · Swords, Co. Dublin
          </p>
        </div>
      </footer>
    </div>
  );
}
