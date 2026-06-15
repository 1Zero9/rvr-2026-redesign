'use client';

import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Shield,
  Heart,
  Trophy,
  Activity,
  Users,
  HelpCircle,
  Megaphone,
} from 'lucide-react';

interface NavLink {
  label: string;
  path: string;
}

interface NavSection {
  title: string;
  icon: React.ReactNode;
  links: NavLink[];
}

const sections: NavSection[] = [
  {
    title: 'Girls & Women',
    icon: <Users className="w-5 h-5 text-brand-green" />,
    links: [
      { label: 'Squad Directory', path: '/teams' },
      { label: 'Fixtures & Results', path: '/teams/matches' },
      { label: 'Football For All', path: '/football-for-all' },
    ],
  },
  {
    title: 'Junior Academy',
    icon: <HelpCircle className="w-5 h-5 text-brand-green" />,
    links: [
      { label: 'Squad Directory', path: '/teams' },
      { label: 'Fixtures & Results', path: '/teams/matches' },
      { label: 'Football For All Sessions', path: '/football-for-all' },
      { label: 'Register Now', path: '/register' },
      { label: 'Family Registration', path: '/register' },
    ],
  },
  {
    title: 'Youth Competitive',
    icon: <Activity className="w-5 h-5 text-brand-green" />,
    links: [
      { label: 'Fixtures & Results', path: '/teams/matches' },
      { label: 'DDSL Match Schedules', path: '/ddsl-jmo' },
      { label: 'Squad Directory', path: '/teams' },
      { label: 'Register Now', path: '/register' },
      { label: 'Family Registration', path: '/register' },
    ],
  },
  {
    title: 'Senior Divisions',
    icon: <Trophy className="w-5 h-5 text-brand-green" />,
    links: [
      { label: 'Squad Directory', path: '/teams' },
      { label: 'Fixtures & Results', path: '/teams/matches' },
    ],
  },
  {
    title: 'Inclusive',
    icon: <Heart className="w-5 h-5 text-brand-green" />,
    links: [
      { label: 'Football For All', path: '/football-for-all' },
      { label: 'Sensory-Friendly Sessions', path: '/football-for-all#sensory' },
      { label: 'Walking Football', path: '/football-for-all#walking' },
    ],
  },
  {
    title: 'Safeguarding',
    icon: <Shield className="w-5 h-5 text-brand-green" />,
    links: [
      { label: 'Safeguarding Statement', path: '/club/safeguarding' },
      { label: 'Garda Vetting', path: '/club/safeguarding' },
      { label: 'Contact Us', path: '/contact' },
    ],
  },
  {
    title: 'Campaigns',
    icon: <Megaphone className="w-5 h-5 text-brand-green" />,
    links: [
      { label: 'Colour Fun Run', path: '/campaigns/colour-fun-run' },
      { label: '40th Anniversary Kit', path: '/club/anniversary' },
      { label: 'Shop', path: '/shop' },
      { label: 'Fees Calculator', path: '/membership-calculator' },
    ],
  },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const toggleDropdown = (title: string) => {
    setActiveDropdown((prev) => (prev === title ? null : title));
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full glass-frosted border-b-4 border-brand-charcoal">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-3">

          {/* Brand logo */}
          <a href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-brand-green border-2 border-brand-charcoal flex items-center justify-center shadow-[2px_2px_0px_0px_#121212] group-hover:-translate-y-0.5 group-hover:shadow-[3px_3px_0px_0px_#121212] transition-all">
              <span className="font-display font-black text-brand-neon text-xs italic select-none leading-none">RVR</span>
            </div>
            <div className="hidden xl:flex flex-col leading-none">
              <span className="font-display font-black text-base leading-none tracking-tight uppercase italic text-brand-charcoal">
                RIVERVALLEY
              </span>
              <span className="font-display font-bold text-[10px] leading-none tracking-wider text-brand-green uppercase mt-0.5">
                RANGERS AFC
              </span>
            </div>
          </a>

          {/* Desktop navigation — justify-between spreads items across available space */}
          <nav
            className="hidden lg:flex items-center justify-between flex-1 min-w-0"
            aria-label="Main navigation"
          >
            {sections.map((section, index) => {
              // Last two sections open their dropdowns to the right edge to avoid viewport overflow
              const alignRight = index >= sections.length - 2;

              return (
                <div key={section.title} className="relative group/menu">
                  <button
                    className="font-display font-extrabold text-[9px] xl:text-[10px] uppercase tracking-tight xl:tracking-normal text-brand-charcoal hover:text-brand-green py-2 px-1 xl:px-1.5 rounded-lg flex items-center gap-0.5 transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-brand-green"
                    aria-label={`Open ${section.title} menu`}
                    aria-haspopup="true"
                  >
                    {section.title}
                    <ChevronDown className="w-3 h-3 shrink-0 transition-transform duration-150 group-hover/menu:rotate-180" />
                  </button>

                  {/* Dropdown — uses hidden/block so it never displaces horizontal items */}
                  <div
                    className={`absolute top-full mt-1 w-56 xl:w-64 bg-white border-3 border-brand-charcoal rounded-xl shadow-brutalist py-3 hidden group-hover/menu:block z-50 ${
                      alignRight ? 'right-0' : 'left-0'
                    }`}
                  >
                    {section.links.map((link) => (
                      <a
                        key={link.label}
                        href={link.path}
                        className="flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-brand-charcoal hover:bg-brand-cream hover:text-brand-green transition-colors"
                      >
                        {link.label}
                        <ChevronRight className="w-3.5 h-3.5 opacity-40 shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center shrink-0">
            <a href="/register" className="btn-brutalist-neon px-4 xl:px-5 py-2.5 text-xs whitespace-nowrap">
              Join the Team
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden tap-target-comfort border-3 border-brand-charcoal rounded-xl bg-brand-neon shadow-[3px_3px_0px_0px_#121212] active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#121212] transition-all focus:ring-4 focus:ring-brand-green focus:outline-none"
            aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={isOpen}
          >
            {isOpen
              ? <X className="w-6 h-6 text-brand-charcoal" />
              : <Menu className="w-6 h-6 text-brand-charcoal" />}
          </button>

        </div>
      </header>

      {/* Mobile drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-brand-charcoal/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="fixed top-20 right-0 bottom-0 w-80 max-w-[calc(100%-2rem)] bg-brand-cream border-l-4 border-brand-charcoal shadow-brutalist flex flex-col overflow-y-auto animate-bounce-spring"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 space-y-3 flex-1">
              {sections.map((section) => {
                const expanded = activeDropdown === section.title;
                return (
                  <div
                    key={section.title}
                    className="border-3 border-brand-charcoal rounded-2xl bg-white p-3 shadow-[3px_3px_0px_0px_#121212]"
                  >
                    <button
                      onClick={() => toggleDropdown(section.title)}
                      className="w-full flex items-center justify-between text-left focus:outline-none"
                      aria-expanded={expanded}
                    >
                      <div className="flex items-center gap-2.5">
                        {section.icon}
                        <span className="font-display font-black text-sm uppercase italic text-brand-charcoal tracking-wide">
                          {section.title}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-brand-charcoal transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {expanded && (
                      <div className="mt-3 pt-3 border-t-2 border-dashed border-zinc-200 space-y-2">
                        {section.links.map((link) => (
                          <a
                            key={link.label}
                            href={link.path}
                            onClick={() => setIsOpen(false)}
                            className="block px-2 py-1.5 text-xs font-semibold text-brand-charcoal hover:text-brand-green hover:underline transition-colors"
                          >
                            {link.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quick access links */}
            <div className="px-6 pb-3 grid grid-cols-2 gap-3">
              <a
                href="/membership-calculator"
                onClick={() => setIsOpen(false)}
                className="rounded-xl border-3 border-brand-charcoal bg-white px-4 py-3 text-center font-display text-xs font-black uppercase text-brand-charcoal shadow-[3px_3px_0_#121212] hover:bg-brand-cream transition-colors"
              >
                Fees
              </a>
              <a
                href="/shop"
                onClick={() => setIsOpen(false)}
                className="rounded-xl border-3 border-brand-charcoal bg-white px-4 py-3 text-center font-display text-xs font-black uppercase text-brand-charcoal shadow-[3px_3px_0_#121212] hover:bg-brand-cream transition-colors"
              >
                Shop
              </a>
            </div>

            <div className="p-6 bg-white border-t-4 border-brand-charcoal space-y-3">
              <a
                href="/register"
                onClick={() => setIsOpen(false)}
                className="w-full btn-brutalist-neon py-3.5 text-center text-xs block"
              >
                Join the Team
              </a>
              <a
                href="/astro-booking"
                onClick={() => setIsOpen(false)}
                className="w-full btn-brutalist-green py-3.5 text-center text-xs block"
              >
                Book Astro Pitch
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
