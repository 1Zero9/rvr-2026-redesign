import type { ReactNode } from 'react';
import Image from 'next/image';
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
      <Header />
      <main className="flex-1">{children}</main>

      <footer className="bg-brand-navy border-t border-brand-sky/15">
        {/* Nav row */}
        <div className="max-w-6xl mx-auto px-6 py-8 border-b border-brand-sky/10">
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
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-zinc-500">
            &copy; {new Date().getFullYear()} Rivervalley Rangers AFC · Swords, Co. Dublin
          </p>
          <a
            href="https://www.1zero9.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-brand-neon hover:text-white transition-colors"
            aria-label="Built by 1Zero9Studio"
          >
            <Image
              src="/marketing/109-logo-circle-white2.png"
              alt="1Zero9Studio"
              width={28}
              height={28}
              className="h-7 w-7 opacity-90"
            />
            <span className="font-bold text-xs animate-pulse">Built by 1Zero9Studio</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
