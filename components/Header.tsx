'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronRight, Menu, X } from 'lucide-react';
import { ASSET_PATHS } from '@/config/assets';

// ─── Types ────────────────────────────────────────────────────────────────────

type NavLink   = { href: string; label: string };
type NavColumn = { heading: string; links: NavLink[] };
type NavSection = { label: string; columns: NavColumn[]; directHref?: string };

// ─── Desktop mega-menu data ───────────────────────────────────────────────────

const NAV_SECTIONS: NavSection[] = [
  {
    label: 'Teams',
    columns: [
      {
        heading: 'Youth Academy',
        links: [
          { href: '/teams',           label: 'All Teams'          },
          { href: '/football-for-all', label: 'Football For All'  },
          { href: '/register',        label: 'Register Now'       },
        ],
      },
      {
        heading: 'Youth Competitive',
        links: [
          { href: '/teams',    label: 'Squad Directory'    },
          { href: '/fixtures', label: 'Fixtures & Results' },
          { href: '/ddsl-jmo', label: 'DDSL JMO'          },
        ],
      },
      {
        heading: 'Senior & Adult',
        links: [
          { href: '/teams',          label: 'Senior Squads'   },
          { href: '/fixtures',       label: 'Senior Fixtures' },
          { href: '/astro-booking',  label: 'Book Astro Pitch'},
        ],
      },
      {
        heading: 'Girls & Women',
        links: [
          { href: '/teams',            label: 'Girls Teams'           },
          { href: '/football-for-all', label: 'Girls Football For All'},
          { href: '/register',         label: 'Register'              },
        ],
      },
    ],
  },
  {
    label: 'Fixtures',
    columns: [
      {
        heading: 'Live Data',
        links: [
          { href: '/fixtures', label: 'All Fixtures & Results' },
          { href: '/fixtures', label: 'Youth Teams'            },
          { href: '/fixtures', label: 'Senior Teams'           },
        ],
      },
      {
        heading: 'Competitions',
        links: [
          { href: '/fixtures', label: 'DDSL 2025/26' },
          { href: '/fixtures', label: 'LSL Senior'   },
          { href: '/fixtures', label: 'AFL'           },
          { href: '/fixtures', label: 'FAI Cups'      },
        ],
      },
      {
        heading: 'Officials',
        links: [
          { href: '/ddsl-jmo', label: 'Junior Match Officials' },
        ],
      },
    ],
  },
  {
    label: 'Tables',
    directHref: '/league-tables',
    columns: [],
  },
  {
    label: 'Join',
    columns: [
      {
        heading: 'Membership',
        links: [
          { href: '/register',               label: 'Register a Player' },
          { href: '/membership-calculator',  label: 'Calculate Fees'    },
          { href: '/astro-booking',          label: 'Book Astro Pitch'  },
        ],
      },
      {
        heading: 'Programmes',
        links: [
          { href: '/football-for-all', label: 'Football For All'  },
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
          { href: '/club/safeguarding', label: 'Garda Vetting'         },
          { href: '/club/safeguarding', label: 'Child Welfare'         },
        ],
      },
    ],
  },
  {
    label: 'Campaigns',
    columns: [
      {
        heading: 'Active',
        links: [
          { href: '/campaigns/colour-fun-run',       label: 'Colour Fun Run'        },
          { href: '/campaigns/45th-anniversary-kit', label: '45th Anniversary Kit'  },
        ],
      },
      {
        heading: 'Support the Club',
        links: [
          { href: '/membership-calculator', label: 'Membership Fees' },
          { href: '/shop',                  label: 'Club Shop'        },
        ],
      },
    ],
  },
];

// ─── Mobile overlay links ─────────────────────────────────────────────────────

const MOBILE_NAV_LINKS = [
  { href: '/teams',                    label: 'Teams'     },
  { href: '/fixtures',                 label: 'Fixtures'  },
  { href: '/league-tables',           label: 'Tables'    },
  { href: '/register',                 label: 'Join Us'   },
  { href: '/club/safeguarding',        label: 'Club'      },
  { href: '/campaigns/colour-fun-run', label: 'Campaigns' },
] as const;

// ─── Active-section helper ────────────────────────────────────────────────────

function isNavActive(label: string, pathname: string): boolean {
  if (label === 'Teams')     return pathname === '/teams';
  if (label === 'Fixtures')  return pathname === '/fixtures';
  if (label === 'Tables')    return pathname.startsWith('/league-tables');
  if (label === 'Join')      return pathname === '/register';
  if (label === 'Club')      return pathname.startsWith('/club');
  if (label === 'Campaigns') return pathname.startsWith('/campaigns');
  return false;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function Header() {
  const [open,        setOpen]        = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  const close = () => setOpen(false);

  // Body scroll lock for mobile overlay
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Close mega menu on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenSection(null);
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

          <div className="hidden lg:flex flex-1 items-center justify-between">
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
                    {section.directHref ? (
                      <Link
                        href={section.directHref}
                        className={`min-h-[44px] px-4 flex items-center font-display font-black uppercase text-sm tracking-wide rounded-lg transition-all ${
                          isActive
                            ? 'text-brand-neon hover:bg-white/5'
                            : 'text-white/80 hover:text-brand-neon hover:bg-white/5'
                        }`}
                      >
                        {section.label}
                      </Link>
                    ) : (
                      <>
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
                              {section.columns.map((col) => (
                                <div
                                  key={col.heading}
                                  className="min-w-[140px] border-l border-brand-sky/20 pl-4"
                                >
                                  <p className="mb-3 whitespace-nowrap font-display text-xs font-black uppercase tracking-widest text-brand-neon">
                                    {col.heading}
                                  </p>
                                  <ul className="space-y-0.5">
                                    {col.links.map((link) => (
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
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Desktop CTA */}
            <div className="shrink-0">
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
