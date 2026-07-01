'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, ChevronDown, ChevronRight, Menu, X } from 'lucide-react';
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
          { href: '/academy',                    label: 'Academy (U6 & Under)' },
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
          { href: '/football-for-all',   label: 'Football For All' },
          { href: '/walking-football',   label: 'Walking Football'  },
        ],
      },
    ],
  },
  {
    label: 'Club',
    columns: [
      {
        heading: 'Club Information',
        links: [
          { href: '/club',            label: 'Club Overview' },
          { href: '/club#history',    label: 'History'       },
          { href: '/club#committee',  label: 'Committee'     },
          { href: '/club#facilities', label: 'Facilities'    },
          { href: '/club#policies',   label: 'Policies'      },
        ],
      },
      {
        heading: 'Club Services',
        links: [
          { href: '/get-involved', label: 'Volunteer & Coach' },
          { href: '/sponsorship',  label: 'Sponsorship'       },
          { href: '/boot-room',    label: 'Boot Room'         },
          { href: '/news',         label: 'News'              },
          { href: '/contact',      label: 'Contact Us'        },
          { href: '/shop',         label: 'Club Shop'         },
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

type MobileNavSection = {
  label: string;
  href: string;
  topLinkLabel?: string;
  links?: NavLink[];
};

const MOBILE_NAV_SECTIONS: MobileNavSection[] = [
  {
    label: 'Academy',
    href: '/academy',
  },
  {
    label: 'All Teams',
    href: '/teams',
    topLinkLabel: 'View all teams',
    links: [
      { href: '/teams?filter=boys',  label: 'DDSL Boys'  },
      { href: '/teams?filter=girls', label: 'DDSL Girls' },
    ],
  },
  {
    label: 'Seniors',
    href: '/seniors',
    topLinkLabel: 'View senior football',
    links: [
      { href: '/seniors/first-team', label: 'First Team'      },
      { href: '/seniors/lsl-div3b',  label: 'Div 3B Saturday' },
      { href: '/seniors/lsl-div3c',  label: 'Div 3C Saturday' },
    ],
  },
  {
    label: 'Over 35s',
    href: '/seniors/over-35s',
    topLinkLabel: 'View Over 35s hub',
    links: [
      { href: '/seniors/over-35s/over35s-a', label: 'Over 35s A' },
      { href: '/seniors/over-35s/over35s-b', label: 'Over 35s B' },
    ],
  },
  {
    label: 'Fixtures',
    href: '/fixtures',
    topLinkLabel: 'View all fixtures',
    links: [
      { href: '/fixtures?filter=youth',  label: 'Youth Fixtures'  },
      { href: '/fixtures?filter=senior', label: 'Senior Fixtures' },
    ],
  },
  {
    label: 'Join Us',
    href: '/register',
    topLinkLabel: 'Register a player',
    links: [
      { href: '/membership-calculator', label: 'Calculate Fees'   },
      { href: '/astro-booking',         label: 'Book Astro Pitch' },
      { href: '/football-for-all',      label: 'Football For All' },
      { href: '/walking-football',       label: 'Walking Football' },
    ],
  },
  {
    label: 'Club',
    href: '/club',
    topLinkLabel: 'View club overview',
    links: [
      { href: '/club#history',       label: 'History'           },
      { href: '/club#committee',     label: 'Committee'         },
      { href: '/club#facilities',    label: 'Facilities'        },
      { href: '/club#policies',      label: 'Policies'          },
      { href: '/club/safeguarding',  label: 'Safeguarding'      },
      { href: '/get-involved',       label: 'Volunteer & Coach' },
      { href: '/sponsorship',        label: 'Sponsorship'       },
      { href: '/contact',            label: 'Contact Us'        },
      { href: '/shop',               label: 'Club Shop'         },
    ],
  },
  { label: 'News',      href: '/news'      },
  { label: 'Campaigns', href: '/campaigns' },
];

// ─── Active-section helper ────────────────────────────────────────────────────

function isNavActive(label: string, pathname: string): boolean {
  if (label === 'Teams')    return pathname === '/teams' ||
                                   pathname.startsWith('/seniors') ||
                                   pathname.startsWith('/teams');
  if (label === 'Fixtures') return pathname === '/fixtures';
  if (label === 'Join')     return pathname === '/register';
  if (label === 'Club')     return pathname.startsWith('/club') ||
                                   pathname === '/news' ||
                                   pathname === '/get-involved' ||
                                   pathname === '/sponsorship' ||
                                   pathname === '/boot-room';
  return false;
}

function hrefMatchesPath(href: string, pathname: string): boolean {
  const path = href.split(/[?#]/)[0];
  return pathname === path || (path !== '/' && pathname.startsWith(`${path}/`));
}

function isMobileSectionActive(section: MobileNavSection, pathname: string): boolean {
  if (section.label === 'Seniors') {
    return pathname === '/seniors' ||
           pathname.startsWith('/seniors/first-team') ||
           pathname.startsWith('/seniors/lsl-');
  }
  if (section.label === 'Over 35s') {
    return pathname.startsWith('/seniors/over-35s');
  }
  return hrefMatchesPath(section.href, pathname) ||
         Boolean(section.links?.some((link) => hrefMatchesPath(link.href, pathname)));
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function Header() {
  const [open,        setOpen]        = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const activeMobileSection = MOBILE_NAV_SECTIONS.find((section) => isMobileSectionActive(section, pathname));

  const close = () => setOpen(false);
  const toggleMobileNav = () => {
    if (!open) {
      setMobileSection(activeMobileSection?.links?.length ? activeMobileSection.label : null);
    }
    setOpen((current) => !current);
  };
  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    requestAnimationFrame(() => searchButtonRef.current?.focus());
  }, []);

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
        if (open) setOpen(false);
        if (searchOpen) closeSearch();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [closeSearch, open, searchOpen]);

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
        <div className="relative max-w-7xl mx-auto flex items-center justify-between h-16 px-4 md:px-6 lg:grid lg:grid-cols-[auto_1fr_auto] lg:items-center">

          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-3" onClick={close}>
            <Image
              src="/river-valley-rangers-logo-pack-v2/RVR-New-White2.png"
              alt="Rivervalley Rangers AFC crest"
              width={44}
              height={44}
              className="block"
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

          <div className="hidden lg:flex flex-1 items-center justify-center gap-8 lg:justify-self-center">
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
                      onFocus={() => setOpenSection(section.label)}
                      onClick={() => setOpenSection(section.label)}
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

          </div>

          {/* Search + Instagram + Affiliation logos + Desktop CTA */}
          <div className="hidden lg:flex items-center gap-2 lg:justify-self-end">
            <button
              ref={searchButtonRef}
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
            <a
              href="https://www.instagram.com/rvrfc1981"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow @rvrfc1981 on Instagram"
              className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-brand-sky hover:text-brand-neon transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>

            {/* Affiliation logos */}
            <span className="h-5 w-px bg-brand-sky/20 mx-1" aria-hidden="true" />
            <a
              href="https://www.fai.ie/clubmark/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="FAI Club Mark"
              className="flex items-center"
            >
              <img
                src="/river-valley-rangers-logo-pack-v2/clumark.png"
                alt="FAI Club Mark"
                width={500}
                height={250}
                className="h-7 w-auto"
              />
            </a>
            <a
              href="https://shelbournefc.ie/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Shelbourne Football Club"
              className="flex items-center"
            >
              <img
                src="/river-valley-rangers-logo-pack-v2/Shelbourne-Football-Club-Crest.webp"
                alt="Shelbourne Football Club"
                width={512}
                height={512}
                className="h-7 w-auto"
              />
            </a>
            <span className="h-5 w-px bg-brand-sky/20 mx-1" aria-hidden="true" />

            <Link href="/register" className="btn-brutalist-neon px-5 py-2.5 text-xs whitespace-nowrap">
              Join the Team
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            aria-expanded={open}
            onClick={toggleMobileNav}
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
      <SearchOverlay isOpen={searchOpen} onClose={closeSearch} />

      {/* Mobile slide-out drawer */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden transition ${
          open ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        aria-hidden={!open}
      >
        <button
          type="button"
          aria-label="Close navigation backdrop"
          onClick={close}
          className={`absolute inset-0 bg-brand-charcoal/30 transition-opacity duration-300 ease-out ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className={`absolute inset-y-0 right-0 flex w-3/4 max-w-sm flex-col border-l border-brand-sky/20 bg-brand-navy shadow-[-18px_0_40px_rgba(0,0,0,0.35)] transition-transform duration-300 ease-out ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex h-16 shrink-0 items-center justify-end px-4">
            <button
              type="button"
              aria-label="Close navigation"
              onClick={close}
              className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-brand-sky/30 bg-brand-neon text-brand-charcoal shadow-[3px_3px_0_rgba(18,18,18,0.35)] transition active:translate-y-0.5 active:shadow-none"
            >
              <ArrowRight className="h-6 w-6" />
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex-1 overflow-y-auto px-5 pb-4 pt-1" aria-label="Mobile navigation">
            {MOBILE_NAV_SECTIONS.map((section) => {
              const links = section.links ?? [];
              const active = isMobileSectionActive(section, pathname);
              const expanded = mobileSection === section.label;

              if (links.length === 0) {
                return (
                  <Link
                    key={section.href + section.label}
                    href={section.href}
                    onClick={close}
                    aria-current={active ? 'page' : undefined}
                    className={`group mt-1 flex min-h-[54px] items-center justify-between gap-3 border-b px-1 font-display text-lg font-black uppercase transition-colors first:mt-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-neon/70 ${
                      active
                        ? 'border-brand-neon/50 text-brand-neon'
                        : 'border-brand-sky/15 text-white hover:border-brand-sky/40 hover:text-brand-neon'
                    }`}
                  >
                    <span>{section.label}</span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-brand-sky transition-transform group-hover:translate-x-0.5 group-hover:text-brand-neon" aria-hidden="true" />
                  </Link>
                );
              }

              return (
                <div key={section.label} className="border-b border-brand-sky/15">
                  <button
                    type="button"
                    aria-expanded={expanded}
                    onClick={() => setMobileSection((current) => current === section.label ? null : section.label)}
                    className={`group flex min-h-[54px] w-full items-center justify-between gap-3 px-1 text-left font-display text-lg font-black uppercase transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-neon/70 ${
                      active
                        ? 'text-brand-neon'
                        : 'text-white hover:text-brand-neon'
                    }`}
                  >
                    <span>{section.label}</span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-brand-sky transition-transform group-hover:text-brand-neon ${
                        expanded ? 'rotate-180 text-brand-neon' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  {expanded && (
                    <div className="pb-1">
                      <Link
                        href={section.href}
                        onClick={close}
                        className={`flex min-h-[42px] items-center border-t border-brand-sky/10 pl-5 pr-1 text-sm font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-neon/70 ${
                          hrefMatchesPath(section.href, pathname)
                            ? 'text-brand-neon'
                            : 'text-brand-sky hover:text-white'
                        }`}
                      >
                        {section.topLinkLabel ?? `View ${section.label}`}
                      </Link>
                      {links.map((link) => {
                        const linkActive = !/[?#]/.test(link.href) && hrefMatchesPath(link.href, pathname);
                        return (
                          <Link
                            key={link.href + link.label}
                            href={link.href}
                            onClick={close}
                            className={`flex min-h-[40px] items-center border-t border-brand-sky/10 pl-5 pr-1 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-neon/70 ${
                              linkActive ? 'text-brand-neon' : 'text-brand-sky/85 hover:text-white'
                            }`}
                          >
                            {link.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Footer: Instagram + affiliation logos */}
          <div className="shrink-0 px-5 py-4 border-t border-brand-sky/15 flex items-center gap-3">
            <a
              href="https://www.instagram.com/rvrfc1981"
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}
              className="flex items-center gap-2 min-h-[44px] text-brand-sky/70 hover:text-brand-neon transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              <span className="font-display font-bold text-sm">@rvrfc1981</span>
            </a>
            <div className="ml-auto flex items-center gap-2">
              <a href="https://www.fai.ie/clubmark/" target="_blank" rel="noopener noreferrer" aria-label="FAI Club Mark">
                <img src="/river-valley-rangers-logo-pack-v2/clumark.png" alt="FAI Club Mark" className="h-6 w-auto" />
              </a>
              <a href="https://shelbournefc.ie/" target="_blank" rel="noopener noreferrer" aria-label="Shelbourne Football Club">
                <img src="/river-valley-rangers-logo-pack-v2/Shelbourne-Football-Club-Crest.webp" alt="Shelbourne FC" className="h-6 w-auto" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
