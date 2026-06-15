'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, ChevronRight, Shield, Heart, Trophy, Activity, Users, HelpCircle } from 'lucide-react';

interface NavLink {
  label: string;
  path: string;
}

interface NavSection {
  title: string;
  icon: React.ReactNode;
  links: NavLink[];
}

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const toggleDropdown = (sectionTitle: string) => {
    setActiveDropdown(activeDropdown === sectionTitle ? null : sectionTitle);
  };

  const sections: NavSection[] = [
    {
      title: 'Girls & Women',
      icon: <Users className="w-5 h-5 text-brand-green-aaa" />,
      links: [
        { label: 'Womens First Team', path: '/teams/womens-firsts' },
        { label: 'Womens Development Squad', path: '/teams/womens-dev' },
        { label: 'Girls Academy U12–U18', path: '/teams/girls-academy' },
        { label: 'Girls Soccer Academy U8–U11', path: '/teams/girls-stars' },
      ],
    },
    {
      title: 'Junior Academy',
      icon: <HelpCircle className="w-5 h-5 text-brand-green-aaa" />,
      links: [
        { label: 'Junior Academy Programme', path: '/programmes/juniors' },
        { label: 'U7 to U12 Training', path: '/teams/juniors-training' },
        { label: 'Fun Skills Development', path: '/programmes/skills' },
      ],
    },
    {
      title: 'Youth Competitive',
      icon: <Activity className="w-5 h-5 text-brand-green-aaa" />,
      links: [
        { label: 'Boys U13 to U18', path: '/teams/boys-academy' },
        { label: 'Girls U13 to U18', path: '/teams/girls-academy' },
        { label: 'DDSL Match Schedules', path: '/ddsl-jmo' },
      ],
    },
    {
      title: 'Senior Divisions',
      icon: <Trophy className="w-5 h-5 text-brand-green-aaa" />,
      links: [
        { label: 'Mens First Team LSL', path: '/teams/mens-firsts' },
        { label: 'Saturday & Sunday Squads', path: '/teams/mens-academy' },
        { label: 'Over 35s Veterans', path: '/teams/mens-over35' },
      ],
    },
    {
      title: 'Inclusive',
      icon: <Heart className="w-5 h-5 text-brand-green-aaa" />,
      links: [
        { label: 'Football For All', path: '/football-for-all' },
        { label: 'Sensory-Friendly Sessions', path: '/football-for-all#sensory' },
        { label: 'Walking Football', path: '/football-for-all#walking' },
      ],
    },
    {
      title: 'Safeguarding',
      icon: <Shield className="w-5 h-5 text-brand-green-aaa" />,
      links: [
        { label: 'Garda Vetting', path: '/membership-calculator' },
        { label: 'Child Safeguarding Statement', path: '/club/safeguarding' },
        { label: 'FAI Club Mark', path: '/compliance' },
      ],
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full glass-frosted border-b-4 border-brand-charcoal">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">

          {/* Brand logo */}
          <a href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-brand-green border-2 border-brand-charcoal flex items-center justify-center shadow-[2px_2px_0px_0px_#121212] group-hover:-translate-y-0.5 group-hover:shadow-[3px_3px_0px_0px_#121212] transition-all">
              <span className="font-display font-black text-brand-neon text-xs italic select-none leading-none">RVR</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display font-black text-base leading-none tracking-tight uppercase italic text-brand-charcoal">
                RIVERVALLEY
              </span>
              <span className="font-display font-bold text-[10px] leading-none tracking-wider text-brand-green uppercase mt-0.5">
                RANGERS AFC
              </span>
            </div>
          </a>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center gap-0.5 min-w-0" aria-label="Main navigation">
            {sections.map((section) => (
              <div key={section.title} className="relative group/menu">
                <button
                  className="font-display font-extrabold text-[11px] uppercase tracking-wide text-brand-charcoal hover:text-brand-green-aaa py-2 px-2 rounded-lg flex items-center gap-1 transition-all whitespace-nowrap"
                  aria-label={`Open ${section.title} menu`}
                  aria-haspopup="true"
                >
                  {section.title}
                  <ChevronDown className="w-3 h-3 shrink-0" />
                </button>

                <div className="absolute left-0 mt-2 w-64 bg-white border-3 border-brand-charcoal rounded-xl shadow-brutalist py-3 opacity-0 pointer-events-none group-hover/menu:opacity-100 group-hover/menu:pointer-events-auto transition-all duration-200 z-50">
                  {section.links.map((link) => (
                    <a
                      key={link.path}
                      href={link.path}
                      className="flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-brand-charcoal hover:bg-brand-cream hover:text-brand-green-aaa transition-colors"
                    >
                      {link.label}
                      <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <a
              href="/membership-calculator"
              className="font-display font-black text-xs uppercase tracking-wider text-brand-charcoal hover:text-brand-green transition-colors"
            >
              Fees
            </a>
            <a href="/membership-calculator" className="btn-brutalist-neon px-5 py-2.5 text-xs whitespace-nowrap">
              Join the Team
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden tap-target-comfort border-3 border-brand-charcoal rounded-xl bg-brand-neon shadow-[3px_3px_0px_0px_#121212] active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#121212] transition-all focus:ring-4 focus:ring-brand-green-aaa focus:outline-none"
            aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-6 h-6 text-brand-charcoal" /> : <Menu className="w-6 h-6 text-brand-charcoal" />}
          </button>

        </div>
      </header>

      {/* Mobile drawer backdrop */}
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
                            key={link.path}
                            href={link.path}
                            onClick={() => setIsOpen(false)}
                            className="block px-2 py-1.5 text-xs font-semibold text-brand-charcoal hover:text-brand-green-aaa hover:underline transition-colors"
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

            <div className="p-6 bg-white border-t-4 border-brand-charcoal space-y-3">
              <a
                href="/membership-calculator"
                className="w-full btn-brutalist-neon py-3.5 text-center text-xs block"
              >
                Join the Team
              </a>
              <a
                href="/ddsl-jmo"
                className="w-full btn-brutalist-green py-3.5 text-center text-xs block"
              >
                DDSL Fixtures
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
