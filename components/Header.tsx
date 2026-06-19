'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { ASSET_PATHS } from '@/config/assets';

const NAV_LINKS = [
  { href: '/teams',                        label: 'Teams'     },
  { href: '/fixtures',                     label: 'Fixtures'  },
  { href: '/register',                     label: 'Join'      },
  { href: '/club/safeguarding',            label: 'Club'      },
  { href: '/campaigns/colour-fun-run',     label: 'Campaigns' },
] as const;

const MOBILE_NAV_LINKS = [
  { href: '/teams',                        label: 'Teams'     },
  { href: '/fixtures',                     label: 'Fixtures'  },
  { href: '/register',                     label: 'Join Us'   },
  { href: '/club/safeguarding',            label: 'Club'      },
  { href: '/campaigns/colour-fun-run',     label: 'Campaigns' },
] as const;

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const close = () => setOpen(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-50 glass-dark border-b border-brand-sky/20">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-4 md:px-6">

          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-3" onClick={close}>
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-brand-sky/40 bg-brand-green font-display text-sm font-black italic text-brand-neon shadow-[2px_2px_0_rgba(184,205,238,0.25)] lg:hidden">
              RVR
            </span>
            <Image
              src={ASSET_PATHS.crestMaster}
              alt="Rivervalley Rangers AFC crest"
              width={44}
              height={44}
              className="hidden lg:block rounded-lg"
              priority
            />
            <span className="grid leading-none">
              <span className="font-display text-lg font-black uppercase italic tracking-tight text-white md:text-xl">
                Rivervalley
              </span>
              <span className="font-display text-xs font-bold uppercase tracking-wider text-brand-neon">
                Rangers AFC
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`font-display font-black uppercase text-xs xl:text-sm tracking-wide transition-colors px-3 py-2 min-h-[44px] inline-flex items-center rounded-lg hover:bg-white/5 ${
                    active ? 'text-brand-neon' : 'text-white/80 hover:text-brand-neon'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex shrink-0">
            <Link href="/register" className="btn-brutalist-neon px-5 py-2.5 text-xs whitespace-nowrap">
              Join the Team
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="rounded-xl border-2 border-brand-sky/30 bg-brand-neon p-2 shadow-[3px_3px_0_rgba(184,205,238,0.3)] transition active:translate-y-0.5 active:shadow-none lg:hidden"
          >
            {open ? (
              <X className="h-6 w-6 text-brand-charcoal" />
            ) : (
              <Menu className="h-6 w-6 text-brand-charcoal" />
            )}
          </button>

        </div>
      </header>

      {/* Mobile full-screen overlay */}
      {open && (
        <div className="fixed inset-0 z-50 bg-brand-navy flex flex-col lg:hidden">

          {/* Overlay header row */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-brand-sky/20 shrink-0">
            <Link href="/" onClick={close} className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-brand-sky/40 bg-brand-green font-display text-sm font-black italic text-brand-neon shadow-[2px_2px_0_rgba(184,205,238,0.25)]">
                RVR
              </span>
              <span className="grid leading-none">
                <span className="font-display text-lg font-black uppercase italic tracking-tight text-white">
                  Rivervalley
                </span>
                <span className="font-display text-xs font-bold uppercase tracking-wider text-brand-neon">
                  Rangers AFC
                </span>
              </span>
            </Link>
            <button
              type="button"
              aria-label="Close navigation"
              onClick={close}
              className="rounded-xl border-2 border-brand-sky/30 bg-brand-neon p-2 shadow-[3px_3px_0_rgba(184,205,238,0.3)] transition active:translate-y-0.5 active:shadow-none"
            >
              <X className="h-6 w-6 text-brand-charcoal" />
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex-1 flex flex-col justify-center px-6 gap-2" aria-label="Mobile navigation">
            {MOBILE_NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={close}
                  className={`min-h-[64px] flex items-center px-4 font-display font-black uppercase text-2xl border-b border-brand-sky/10 transition-colors ${
                    active ? 'text-brand-neon' : 'text-white'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Bottom CTAs */}
          <div className="px-6 pb-10 grid gap-3 shrink-0">
            <Link href="/register" onClick={close} className="btn-brutalist-neon block py-4 text-center text-base">
              Join the Team
            </Link>
            <Link href="/astro-booking" onClick={close} className="btn-brutalist-green block py-4 text-center text-base">
              Book Astro Pitch
            </Link>
          </div>

        </div>
      )}
    </>
  );
}
