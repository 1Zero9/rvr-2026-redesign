'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronRight, Menu, X } from 'lucide-react';
import { ASSET_PATHS } from '@/config/assets';
import SearchOverlay from './SearchOverlay';

// ─── Types ────────────────────────────────────────────────────────────────────

type NavLink   = { href: string; label: string };
type NavColumn = { heading?: string; links: NavLink[] };
type NavSection = { label: string; columns: NavColumn[]; twoColumn?: boolean };

// ─── Desktop mega-menu data ───────────────────────────────────────────────────

const NAV_SECTIONS: NavSection[] = [
  {
    label: 'Teams',
    columns: [
      {
        links: [
          { href: '/teams',                      label: 'All Teams'       },
          { href: '/teams?filter=boys',          label: 'DDSL Boys'       },
          { href: '/teams?filter=girls',         label: 'DDSL Girls'      },
          { href: '---',                         label: 'SENIORS'         },
          { href: '/seniors/first-team',         label: 'First Team'      },
          { href: '/seniors/lsl-div3b',          label: 'Div 3B Saturday' },
          { href: '/seniors/lsl-div3c',          label: 'Div 3C Saturday' },
          { href: '---',                         label: 'OVER 35s'        },
          { href: '/seniors/over-35s/over35s-a', label: 'Over 35s A'      },
          { href: '/seniors/over-35s/over35s-b', label: 'Over 35s B'      },
        ],
      },
    ],
  },
  {
    label: 'Fixtures',
    columns: [
      {
        links: [
          { href: '/fixtures',               label: 'Fixtures & Results' },
          { href: '/fixtures?filter=youth',  label: 'Youth Fixtures'     },
          { href: '/fixtures?filter=senior', label: 'Senior Fixtures'    },
        ],
      },
    ],
  },
  {
    label: 'Join',
    columns: [
      {
        heading: 'Membership',
        links: [
          { href: '/register',              label: 'Register a Player' },
          { href: '/membership-calculator', label: 'Calculate Fees'    },
          { href: '/astro-booking',         label: 'Book Astro Pitch'  },
        ],
      },
      {
        heading: 'Programmes',
        links: [
          { href: '/football-for-all', label: 'Football For All' },
          { href: '/football-for-all', label: 'Walking Football'  },
          { href: '/football-for-all', label: 'Sensory Sessions'  },
        ],
      },
    ],
  },
  {
    label: 'Club',
    columns: [
      {
        heading: 'About RVR',
        links: [
          { href: '/contact', label: 'Contact Us' },
          { href: '/shop',    label: 'Club Shop'  },
        ],
      },
      {
        heading: 'Safeguarding',
        links: [
          { href: '/club/safeguarding', label: 'Safeguarding Statement' },
          { href: '/club/safeguarding', label: 'Garda Vetting'          },
          { href: '/club/safeguarding', label: 'Child Welfare'          },
        ],
      },
    ],
  },
];

// Campaigns — rendered as a direct top-level link, no dropdown
const CAMPAIGNS_LINK = { label: 'Campaigns', href: '/campaigns' };

// ─── Mobile overlay links ─────────────────────────────────────────────────────

type MobileNavItem =
  | { type: 'header'; label: string; href: string }
  | { type: 'link';   label: string; href: string };

const MOBILE_NAV_GROUPS: MobileNavItem[] = [
  { type: 'header', label: 'All Teams',       href: '/teams'                       },
  { type: 'link',   label: 'DDSL Boys',       href: '/teams?filter=boys'           },
  { type: 'link',   label: 'DDSL Girls',      href: '/teams?filter=girls'          },
  { type: 'header', label: 'Seniors',         href: '/seniors/first-team'          },
  { type: 'link',   label: 'First Team',      href: '/seniors/first-team'          },
  { type: 'link',   label: 'Div 3B Saturday', href: '/seniors/lsl-div3b'           },
  { type: 'link',   label: 'Div 3C Saturday', href: '/seniors/lsl-div3c'           },
  { type: 'header', label: 'Over 35s',        href: '/seniors/over-35s'            },
  { type: 'link',   label: 'Over 35s A',      href: '/seniors/over-35s/over35s-a' },
  { type: 'link',   label: 'Over 35s B',      href: '/seniors/over-35s/over35s-b' },
  { type: 'header', label: 'Fixtures',        href: '/fixtures'                    },
  { type: 'header', label: 'Join Us',         href: '/register'                    },
  { type: 'header', label: 'Campaigns',       href: '/campaigns'                   },
];

// ─── Active-section helper ────────────────────────────────────────────────────

function isNavActive(label: string, pathname: string): boolean {
  if (label === 'Teams')    return pathname === '/teams' ||
                                   pathname.startsWith('/seniors') ||
                                   pathname.startsWith('/teams');
  if (label === 'Fixtures') return pathname === '/fixtures';
  if (label === 'Join')     return pathname === '/register';
  if (label === 'Club')     return pathname.startsWith('/club');
  return false;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function Header() {
  const [open,        setOpen]        = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  const close = () => setOpen(false);

  // Body scroll lock for mobile overlay
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Close mega menu and search on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenSection(null);
        setSearchOpen(false);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  return (
    <>
      <header
        id="site-header"
        className="relative sticky top-0 z-50 glass-dark border-b border-brand-sky/20"
      >
        <div className="relative max-w-7xl mx-auto flex items-center justify-between h-16 px-4 md:px-6">

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

          <div className="hidden lg:flex flex-1 items-center justify-center gap-8">
            {/* Desktop mega-menu trigger buttons */}
            <nav
              className="flex items-center gap-1"
              aria-label="Main navigation"
              onMouseLeave={() => {
                closeTimer.current = setTimeout(() => setOpenSection(null), 150);
              }}
              onMouseEnter={() => {
                if (closeTimer.current) clearTimeout(closeTimer.current);
              }}
            >
              {NAV_SECTIONS.map((section) => {
                const isOpen   = openSection === section.label;
                const isActive = isNavActive(section.label, pathname);

                return (
                  <div key={section.label} className="relative">
                    <button
                      type="button"
                      onMouseEnter={() => {
                        if (closeTimer.current) clearTimeout(closeTimer.current);
                        setOpenSection(section.label);
                      }}
                      aria-expanded={isOpen}
                      className={`min-h-[44px] px-4 flex items-center gap-1.5 font-display font-black uppercase text-sm tracking-wide rounded-lg transition-all ${
                        isOpen
                          ? 'text-brand-neon bg-white/10'
                          : isActive
                          ? 'text-brand-neon hover:bg-white/5'
                          : 'text-white/80 hover:text-brand-neon hover:bg-white/5'
                      }`}
                    >
                      {section.label}
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="absolute top-full left-1/2 z-40 mt-1 -translate-x-1/2 border border-brand-sky/20 border-t-2 border-t-brand-neon bg-brand-charcoal shadow-2xl">
                        <div className="flex gap-10 px-6 py-6">
                          {section.columns.map((col, colIndex) => (
                            <div key={col.heading ?? colIndex} className="min-w-[140px] border-l border-brand-sky/20 pl-4">
                              {col.heading && (
                                <p className="mb-3 whitespace-nowrap font-display text-xs font-black uppercase tracking-widest text-brand-neon">
                                  {col.heading}
                                </p>
                              )}
                              <ul className="space-y-0.5">
                                {col.links.map((link) => {
                                  if (link.href === '---') {
                                    return (
                                      <li key={link.label} className="pt-3 pb-1">
                                        <p className="text-brand-neon text-[10px] font-black uppercase tracking-widest pl-6 border-t border-brand-sky/20 pt-2">
                                          {link.label}
                                        </p>
                                      </li>
                                    );
                                  }
                                  return (
                                    <li key={link.label}>
                                      <Link
                                        href={link.href}
                                        onClick={() => setOpenSection(null)}
                                        className="group flex min-h-[44px] items-center gap-2 whitespace-nowrap py-2 text-sm font-semibold text-zinc-300 transition-colors hover:text-white"
                                      >
                                        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-brand-neon opacity-0 transition-opacity group-hover:opacity-100" />
                                        {link.label}
                                      </Link>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Campaigns — direct link, no dropdown */}
              <div
                onMouseEnter={() => {
                  if (closeTimer.current) clearTimeout(closeTimer.current);
                  setOpenSection(null);
                }}
              >
                <Link
                  href={CAMPAIGNS_LINK.href}
                  className={`min-h-[44px] px-4 flex items-center font-display font-black uppercase text-sm tracking-wide rounded-lg transition-all ${
                    pathname.startsWith('/campaigns')
                      ? 'text-brand-neon hover:bg-white/5'
                      : 'text-white/80 hover:text-brand-neon hover:bg-white/5'
                  }`}
                >
                  {CAMPAIGNS_LINK.label}
                </Link>
              </div>

            </nav>

            {/* Search + Desktop CTA */}
            <div className="absolute right-4 md:right-6 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Search teams"
                className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-brand-sky hover:text-brand-neon transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </button>
              <Link href="/register" className="btn-brutalist-neon px-5 py-2.5 text-xs whitespace-nowrap">
                Join the Team
              </Link>
            </div>

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

      {/* Search overlay */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

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
          <nav className="flex-1 overflow-y-auto px-6 py-4" aria-label="Mobile navigation">
            {MOBILE_NAV_GROUPS.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              if (item.type === 'header') {
                return (
                  <Link
                    key={item.href + item.label}
                    href={item.href}
                    onClick={close}
                    className={`min-h-[56px] flex items-center px-2 font-display font-black uppercase text-xl border-b border-brand-sky/20 transition-colors mt-2 first:mt-0 ${
                      active ? 'text-brand-neon' : 'text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              }
              return (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  onClick={close}
                  className={`min-h-[44px] flex items-center pl-6 pr-2 text-base font-semibold border-b border-brand-sky/10 transition-colors ${
                    active ? 'text-brand-neon' : 'text-brand-sky'
                  }`}
                >
                  {item.label}
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
