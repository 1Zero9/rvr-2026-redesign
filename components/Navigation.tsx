'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
    icon: <Users className="w-5 h-5 text-brand-neon" />,
    links: [
      { label: 'Squad Directory', path: '/teams' },
      { label: 'Fixtures & Results', path: '/fixtures' },
      { label: 'Football For All', path: '/football-for-all' },
    ],
  },
  {
    title: 'Junior Academy',
    icon: <HelpCircle className="w-5 h-5 text-brand-neon" />,
    links: [
      { label: 'Squad Directory', path: '/teams' },
      { label: 'Fixtures & Results', path: '/fixtures' },
      { label: 'Football For All Sessions', path: '/football-for-all' },
      { label: 'Register Now', path: '/register' },
      { label: 'Family Registration', path: '/register' },
    ],
  },
  {
    title: 'Youth Competitive',
    icon: <Activity className="w-5 h-5 text-brand-neon" />,
    links: [
      { label: 'Fixtures & Results', path: '/fixtures' },
      { label: 'DDSL Match Schedules', path: '/ddsl-jmo' },
      { label: 'Squad Directory', path: '/teams' },
      { label: 'Register Now', path: '/register' },
      { label: 'Family Registration', path: '/register' },
    ],
  },
  {
    title: 'Senior Divisions',
    icon: <Trophy className="w-5 h-5 text-brand-neon" />,
    links: [
      { label: 'Squad Directory', path: '/teams' },
      { label: 'Fixtures & Results', path: '/fixtures' },
    ],
  },
  {
    title: 'Inclusive',
    icon: <Heart className="w-5 h-5 text-brand-neon" />,
    links: [
      { label: 'Football For All', path: '/football-for-all' },
      { label: 'Sensory-Friendly Sessions', path: '/football-for-all#sensory' },
      { label: 'Walking Football', path: '/football-for-all#walking' },
    ],
  },
  {
    title: 'Safeguarding',
    icon: <Shield className="w-5 h-5 text-brand-neon" />,
    links: [
      { label: 'Safeguarding Statement', path: '/club/safeguarding' },
      { label: 'Garda Vetting', path: '/club/safeguarding' },
      { label: 'Contact Us', path: '/contact' },
    ],
  },
  {
    title: 'Campaigns',
    icon: <Megaphone className="w-5 h-5 text-brand-neon" />,
    links: [
      { label: 'Colour Fun Run', path: '/campaigns/colour-fun-run' },
      { label: '45th Anniversary Kit', path: '/club/anniversary' },
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
      {/* Dark charcoal/navy header — blends with the homepage grid canvas */}
      <header className="sticky top-0 z-50 w-full glass-dark border-b border-brand-sky/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-3">

          {/* Brand logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-brand-green border-2 border-brand-sky/40 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(184,205,238,0.2)] group-hover:-translate-y-0.5 transition-all">
              <span className="font-display font-black text-brand-neon text-xs italic select-none leading-none">RVR</span>
            </div>
            <div className="hidden xl:flex flex-col leading-none">
              <span className="font-display font-black text-base leading-none tracking-tight uppercase italic text-white">
                RIVERVALLEY
              </span>
              <span className="font-display font-bold text-[10px] leading-none tracking-wider text-brand-neon uppercase mt-0.5">
                RANGERS AFC
              </span>
            </div>
          </Link>

          {/* Desktop navigation — justify-between spreads all 7 sections evenly */}
          <nav
            className="hidden lg:flex items-center justify-between flex-1 min-w-0"
            aria-label="Main navigation"
          >
            {sections.map((section, index) => {
              // Last two sections anchor their dropdown to the right edge
              const alignRight = index >= sections.length - 2;

              return (
                <div key={section.title} className="relative group/menu">
                  <button
                    className="font-display font-extrabold text-[9px] xl:text-[10px] uppercase tracking-tight xl:tracking-normal text-white/85 hover:text-brand-neon py-2 px-1 xl:px-1.5 rounded-lg flex items-center gap-0.5 transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-brand-neon/50"
                    aria-label={`Open ${section.title} menu`}
                    aria-haspopup="true"
                  >
                    {section.title}
                    <ChevronDown className="w-3 h-3 shrink-0 transition-transform duration-150 group-hover/menu:rotate-180" />
                  </button>

                  {/*
                    Dropdown hover gap fix:
                    The outer wrapper starts at top-full with NO margin. A pt-3 top-padding
                    creates an invisible 12px bridge that keeps the cursor inside the hover
                    zone as it travels downward from the trigger button to the menu card.
                    The hidden/block pattern means this wrapper has zero layout footprint
                    when closed — it cannot push horizontal nav items around.
                  */}
                  <div
                    className={`absolute top-full hidden group-hover/menu:block z-50 pt-3 w-56 xl:w-64 ${
                      alignRight ? 'right-0' : 'left-0'
                    }`}
                  >
                    <div className="rounded-xl py-2 shadow-[0_12px_40px_rgba(0,0,0,0.35)] border-2 bg-white" style={{ borderColor: '#B8CDEE' }}>
                      {section.links.map((link) => (
                        <a
                          key={link.label}
                          href={link.path}
                          className="flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-brand-charcoal transition-colors hover:bg-[#F5F0F5]"
                          style={{ '--hover-text': '#8B1E4D' } as React.CSSProperties}
                          onMouseEnter={(e) => { e.currentTarget.style.color = '#8B1E4D'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = ''; }}
                        >
                          {link.label}
                          <ChevronRight className="w-3.5 h-3.5 opacity-40 shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Desktop CTA — Neon Green for high-energy conversion */}
          <div className="hidden lg:flex items-center shrink-0">
            <a href="/register" className="btn-brutalist-neon px-4 xl:px-5 py-2.5 text-xs whitespace-nowrap">
              Join the Team
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden tap-target-comfort border-2 border-brand-sky/30 rounded-xl bg-brand-neon shadow-[3px_3px_0px_0px_rgba(184,205,238,0.3)] active:translate-y-0.5 active:shadow-none transition-all focus:ring-4 focus:ring-brand-neon/50 focus:outline-none"
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
          className="fixed inset-0 z-40 bg-brand-navy/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="fixed top-20 right-0 bottom-0 w-80 max-w-[calc(100%-2rem)] bg-brand-navy border-l border-brand-sky/20 flex flex-col overflow-y-auto animate-bounce-spring"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 space-y-2 flex-1">
              {sections.map((section) => {
                const expanded = activeDropdown === section.title;
                return (
                  <div
                    key={section.title}
                    className="border border-brand-sky/20 rounded-2xl bg-white/5 p-3"
                  >
                    <button
                      onClick={() => toggleDropdown(section.title)}
                      className="w-full flex items-center justify-between text-left focus:outline-none"
                      aria-expanded={expanded}
                    >
                      <div className="flex items-center gap-2.5">
                        {section.icon}
                        <span className="font-display font-black text-sm uppercase italic text-white tracking-wide">
                          {section.title}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-white/50 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {expanded && (
                      <div className="mt-3 pt-3 border-t border-brand-sky/20 space-y-1">
                        {section.links.map((link) => (
                          <a
                            key={link.label}
                            href={link.path}
                            onClick={() => setIsOpen(false)}
                            className="block px-2 py-1.5 text-xs font-semibold text-zinc-300 hover:text-brand-neon hover:underline transition-colors"
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
            <div className="px-5 pb-3 grid grid-cols-2 gap-3">
              <a
                href="/membership-calculator"
                onClick={() => setIsOpen(false)}
                className="rounded-xl border border-brand-sky/30 bg-white/5 px-4 py-3 text-center font-display text-xs font-black uppercase text-white hover:bg-white/10 transition-colors"
              >
                Fees
              </a>
              <a
                href="/shop"
                onClick={() => setIsOpen(false)}
                className="rounded-xl border border-brand-sky/30 bg-white/5 px-4 py-3 text-center font-display text-xs font-black uppercase text-white hover:bg-white/10 transition-colors"
              >
                Shop
              </a>
            </div>

            <div className="p-5 border-t border-brand-sky/20 space-y-3">
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
