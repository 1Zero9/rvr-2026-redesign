'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, ChevronRight, Shield, Heart, Trophy, Activity, Calendar, Users, HelpCircle } from 'lucide-react';

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

  // Prevent background scrolling when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleDropdown = (sectionTitle: string) => {
    setActiveDropdown(activeDropdown === sectionTitle ? null : sectionTitle);
  };

  // Structured exactly according to the requested 'Equality-First' hierarchy
  const sections: NavSection[] = [
    {
      title: 'Girls & Women',
      icon: <Users className="w-5 h-5 text-brand-green-aaa" />,
      links: [
        { label: 'Womens First Team', path: '/teams/womens-firsts' },
        { label: 'Womens Development Squad', path: '/teams/womens-dev' },
        { label: 'Girls Academy U12-U18', path: '/teams/girls-academy' },
        { label: 'Girls Soccer Academy U8-U11', path: '/teams/girls-stars' },
      ],
    },
    {
      title: 'Junior Academy',
      icon: <HelpCircle className="w-5 h-5 text-brand-green-aaa" />,
      links: [
        { label: 'Boden Óg Junior Academy', path: '/programmes/juniors' },
        { label: 'Under 7 to Under 12 Training', path: '/teams/juniors-training' },
        { label: 'Fun Skills Development', path: '/programmes/skills' },
      ],
    },
    {
      title: 'Youth Competitive',
      icon: <Activity className="w-5 h-5 text-brand-green-aaa" />,
      links: [
        { label: 'Boys Under 13 to Under 18', path: '/teams/boys-academy' },
        { label: 'Girls Under 13 to Under 18', path: '/teams/girls-academy' },
        { label: 'DDSL Match Schedules', path: '/ddsl-jmo' },
      ],
    },
    {
      title: 'Senior Divisions',
      icon: <Trophy className="w-5 h-5 text-brand-green-aaa" />,
      links: [
        { label: 'Mens First Team LSL', path: '/teams/mens-firsts' },
        { label: 'Mens Saturday/Sunday Squads', path: '/teams/mens-academy' },
        { label: 'Over 35s Veterans', path: '/teams/mens-over35' },
      ],
    },
    {
      title: 'Inclusive Programs',
      icon: <Heart className="w-5 h-5 text-brand-green-aaa" />,
      links: [
        { label: 'Football For All Academy', path: '/football-for-all' },
        { label: 'Sensory-Friendly Sessions', path: '/football-for-all#sensory' },
        { label: 'Walking Football', path: '/football-for-all#walking' },
      ],
    },
    {
      title: 'Welfare & Compliance',
      icon: <Shield className="w-5 h-5 text-brand-green-aaa" />,
      links: [
        { label: 'Garda Vetting Submission', path: '/membership-calculator' },
        { label: 'Child Safeguarding Statement', path: '/safeguarding' },
        { label: 'FAI Club Mark Certification', path: '/compliance' },
      ],
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full glass-frosted border-b-4 border-brand-charcoal">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          
          {/* Logo brand signature */}
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-brand-green border-2 border-brand-charcoal flex items-center justify-center shadow-[2px_2px_0px_0px_#121212] group-hover:-translate-y-0.5 group-hover:shadow-[3px_3px_0px_0px_#121212] transition-all">
              <span className="font-display font-black text-brand-neon text-xl italic select-none">R</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-base md:text-lg leading-none tracking-tight uppercase italic text-brand-charcoal">
                RIVERVALLEY
              </span>
              <span className="font-display font-bold text-[10px] md:text-xs leading-none tracking-wider text-brand-green-aaa uppercase">
                Rangers AFC
              </span>
            </div>
          </a>

          {/* Desktop Navigation Link List */}
          <nav className="hidden lg:flex items-center gap-4">
            {sections.map((section) => (
              <div key={section.title} className="relative group/menu">
                <button
                  className="font-display font-extrabold text-xs uppercase tracking-wider text-brand-charcoal hover:text-brand-green-aaa py-2 px-2.5 rounded-lg flex items-center gap-1 transition-all"
                  aria-label={`Open dropdown for ${section.title}`}
                >
                  {section.title}
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {/* Dropdown list */}
                <div className="absolute left-0 mt-2 w-64 bg-white border-3 border-brand-charcoal rounded-xl shadow-brutalist py-3 opacity-0 pointer-events-none group-hover/menu:opacity-100 group-hover/menu:pointer-events-auto transition-all duration-200">
                  {section.links.map((link) => (
                    <a
                      key={link.path}
                      href={link.path}
                      className="flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-brand-charcoal hover:bg-brand-cream hover:text-brand-green-aaa transition-colors"
                    >
                      {link.label}
                      <ChevronRight className="w-3.5 h-3.5 opacity-0 hover:opacity-100 transition-opacity" />
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Desktop Call to Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <a href="/membership-calculator" className="font-display font-black text-xs uppercase tracking-wider text-brand-charcoal hover:underline">
              Fees Calculator
            </a>
            <a href="/membership-calculator" className="btn-brutalist-neon px-5 py-2.5 text-xs">
              Join the Team
            </a>
          </div>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden tap-target-comfort border-3 border-brand-charcoal rounded-xl bg-brand-neon shadow-[3px_3px_0px_0px_#121212] active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#121212] transition-all focus:ring-4 focus:ring-brand-green-aaa focus:outline-none"
            aria-label="Open navigation drawer"
          >
            {isOpen ? <X className="w-6 h-6 text-brand-charcoal" /> : <Menu className="w-6 h-6 text-brand-charcoal" />}
          </button>

        </div>
      </header>

      {/* Sliding mobile drawer */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-brand-charcoal/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="fixed top-20 right-0 bottom-0 w-80 max-w-[calc(100%-2rem)] bg-brand-cream border-l-4 border-brand-charcoal shadow-brutalist flex flex-col justify-between overflow-y-auto animate-bounce-spring"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Drawer list items ordered in the required Equality-First sequence */}
            <div className="p-6 space-y-4">
              {sections.map((section) => {
                const isDropdownActive = activeDropdown === section.title;

                return (
                  <div key={section.title} className="border-3 border-brand-charcoal rounded-2xl bg-white p-3 shadow-[3px_3px_0px_0px_#121212]">
                    <button
                      onClick={() => toggleDropdown(section.title)}
                      className="w-full flex items-center justify-between text-left focus:outline-none"
                      aria-expanded={isDropdownActive}
                    >
                      <div className="flex items-center gap-2.5">
                        {section.icon}
                        <span className="font-display font-black text-sm uppercase italic text-brand-charcoal tracking-wide">
                          {section.title}
                        </span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-brand-charcoal transition-transform duration-200 ${isDropdownActive ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Collapsible dropdown drawer links */}
                    {isDropdownActive && (
                      <div className="mt-3 pt-3 border-t-2 border-dashed border-zinc-200 space-y-2">
                        {section.links.map((link) => (
                          <a
                            key={link.path}
                            href={link.path}
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

            {/* Mobile Footer CTAs inside comfortable thumb reach (lower 40% drawer) */}
            <div className="p-6 bg-white border-t-4 border-brand-charcoal space-y-3 mt-auto">
              <a href="/membership-calculator" className="w-full btn-brutalist-neon py-3.5 text-center text-xs block">
                Join the Team
              </a>
              <a href="/ddsl-jmo" className="w-full btn-brutalist-green py-3.5 text-center text-xs block bg-brand-green text-white hover:bg-brand-greenDark">
                Become Junior Referee
              </a>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
