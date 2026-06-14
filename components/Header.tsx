'use client'; // Next.js Client Component

import React, { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [activeMenu, setActiveMenu] = useState<'none' | 'equality' | 'format'>('none');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileEqualityOpen, setMobileEqualityOpen] = useState(false);
  const [mobileFormatOpen, setMobileFormatOpen] = useState(false);

  const toggleMenu = (menu: 'equality' | 'format') => {
    if (activeMenu === menu) {
      setActiveMenu('none');
    } else {
      setActiveMenu(menu);
    }
  };

  return (
    <>
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full glass-frosted border-b-4 border-brand-charcoal transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          
          {/* Logo Brand area */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-brand-green border-2 border-brand-charcoal flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(18,18,18,1)] group-hover:-translate-y-0.5 group-hover:shadow-[3px_3px_0px_0px_rgba(18,18,18,1)] transition-all">
              <span className="font-display font-black text-brand-neon text-xl italic select-none">R</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-lg md:text-xl leading-none tracking-tight uppercase italic text-brand-charcoal">
                RIVERVALLEY
              </span>
              <span className="font-display font-bold text-xs leading-none tracking-wider text-brand-green uppercase">
                Rangers AFC
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => toggleMenu('equality')}
              className={`font-display font-bold text-sm uppercase tracking-wide px-3 py-2 rounded-lg flex items-center gap-1.5 border-2 transition-all ${
                activeMenu === 'equality'
                  ? 'bg-brand-green text-white border-brand-charcoal shadow-brutalist-neon'
                  : 'text-brand-charcoal border-transparent hover:border-brand-charcoal hover:bg-brand-cream'
              }`}
            >
              Teams (Equality-First)
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className={`w-4 h-4 transition-transform duration-200 ${activeMenu === 'equality' ? 'rotate-180' : ''}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            <button
              onClick={() => toggleMenu('format')}
              className={`font-display font-bold text-sm uppercase tracking-wide px-3 py-2 rounded-lg flex items-center gap-1.5 border-2 transition-all ${
                activeMenu === 'format'
                  ? 'bg-brand-green text-white border-brand-charcoal shadow-brutalist-neon'
                  : 'text-brand-charcoal border-transparent hover:border-brand-charcoal hover:bg-brand-cream'
              }`}
            >
              Squads by Format
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className={`w-4 h-4 transition-transform duration-200 ${activeMenu === 'format' ? 'rotate-180' : ''}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            <a href="/news" className="font-display font-bold text-sm uppercase tracking-wide text-brand-charcoal hover:text-brand-green px-2 py-1 transition-colors">
              News
            </a>
            
            <a href="/contact" className="font-display font-bold text-sm uppercase tracking-wide text-brand-charcoal hover:text-brand-green px-2 py-1 transition-colors">
              Contact
            </a>
          </nav>

          {/* Right Action Button (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <a href="/membership-calculator" className="font-display font-bold text-sm uppercase tracking-wide text-brand-charcoal hover:text-brand-green px-2 py-1 transition-colors">
              Fees Calculator
            </a>
            <a href="/astro-booking" className="btn-brutalist-neon px-5 py-2.5 text-sm">
              Book Astro
            </a>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 border-3 border-brand-charcoal rounded-xl bg-brand-neon shadow-[3px_3px_0px_0px_rgba(18,18,18,1)] active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(18,18,18,1)] transition-all"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6 text-brand-charcoal">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6 text-brand-charcoal">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>

        </div>

        {/* Desktop Mega-Menu Overlays */}
        {activeMenu === 'equality' && (
          <div className="hidden md:block absolute left-0 w-full bg-white border-b-4 border-brand-charcoal shadow-brutalist py-8 animate-bounce-spring">
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 gap-10">
              
              {/* Girls & Women's Section (Priority Left Position) */}
              <div className="p-6 bg-[#F3FAF6] border-3 border-brand-charcoal rounded-2xl shadow-brutalist-green relative overflow-hidden">
                <div className="absolute right-3 top-3 bg-brand-green text-white font-display font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider border border-brand-charcoal rotate-3">
                  Equality First
                </div>
                <h3 className="font-display font-black text-2xl text-brand-green italic uppercase mb-6 flex items-center gap-2">
                  <span className="text-3xl">♀</span> Girls &amp; Women&apos;s Pathway
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-display font-bold text-xs uppercase tracking-wider text-brand-charcoal/60 mb-2">Senior Squads</h4>
                    <ul className="space-y-2.5">
                      <li>
                        <a href="/teams/womens-firsts" className="group flex items-center justify-between text-brand-charcoal hover:text-brand-green font-semibold text-sm">
                          <span>Womens First Team</span>
                          <span className="bg-brand-neon text-brand-charcoal text-[9px] font-black px-1.5 py-0.5 rounded uppercase border border-brand-charcoal">WNL Open</span>
                        </a>
                      </li>
                      <li>
                        <a href="/teams/womens-dev" className="text-brand-charcoal hover:text-brand-green font-semibold text-sm block">Womens Dev Squad</a>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-xs uppercase tracking-wider text-brand-charcoal/60 mb-2">Girls Academy</h4>
                    <ul className="space-y-2">
                      <li><a href="/teams/girls-u18" className="text-brand-charcoal hover:text-brand-green text-sm font-medium block">Under 18s</a></li>
                      <li><a href="/teams/girls-u16" className="text-brand-charcoal hover:text-brand-green text-sm font-medium block">Under 16s</a></li>
                      <li><a href="/teams/girls-u14" className="text-brand-charcoal hover:text-brand-green text-sm font-medium block">Under 14s</a></li>
                      <li>
                        <a href="/teams/girls-stars" className="group flex items-center justify-between text-brand-charcoal hover:text-brand-green text-sm font-medium">
                          <span>U8 - U12 Stars</span>
                          <span className="w-2 h-2 rounded-full bg-brand-neon animate-ping"></span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Boys & Men's Section (Secondary Right Position) */}
              <div className="p-6 bg-white border-3 border-brand-charcoal rounded-2xl shadow-brutalist relative overflow-hidden">
                <h3 className="font-display font-black text-2xl text-brand-charcoal italic uppercase mb-6 flex items-center gap-2">
                  <span className="text-3xl">♂</span> Boys &amp; Men&apos;s Pathway
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-display font-bold text-xs uppercase tracking-wider text-brand-charcoal/60 mb-2">Senior Squads</h4>
                    <ul className="space-y-2.5">
                      <li>
                        <a href="/teams/mens-firsts" className="group flex items-center justify-between text-brand-charcoal hover:text-brand-green font-semibold text-sm">
                          <span>Mens First Team</span>
                          <span className="bg-zinc-100 text-brand-charcoal text-[9px] font-black px-1.5 py-0.5 rounded border border-zinc-300">LSL</span>
                        </a>
                      </li>
                      <li><a href="/teams/mens-saturday" className="text-brand-charcoal hover:text-brand-green text-sm font-medium block">Saturday Squad</a></li>
                      <li><a href="/teams/mens-over35" className="text-brand-charcoal hover:text-brand-green text-sm font-medium block">Over 35s Vets</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-xs uppercase tracking-wider text-brand-charcoal/60 mb-2">Boys Academy</h4>
                    <ul className="space-y-2">
                      <li><a href="/teams/boys-u18" className="text-brand-charcoal hover:text-brand-green text-sm font-medium block">Under 18s Major</a></li>
                      <li><a href="/teams/boys-u16" className="text-brand-charcoal hover:text-brand-green text-sm font-medium block">Under 16s</a></li>
                      <li><a href="/teams/boys-u14" className="text-brand-charcoal hover:text-brand-green text-sm font-medium block">Under 14s</a></li>
                      <li><a href="/teams/boys-u8" className="text-brand-charcoal hover:text-brand-green text-sm font-medium block">U7 - U12 Academy</a></li>
                    </ul>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {activeMenu === 'format' && (
          <div className="hidden md:block absolute left-0 w-full bg-white border-b-4 border-brand-charcoal shadow-brutalist py-8 animate-bounce-spring">
            <div className="max-w-6xl mx-auto px-6">
              
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-display font-black text-xl text-brand-charcoal uppercase italic">
                  Bloomsbury Inspired Squad Structure
                </h3>
                <span className="text-xs font-bold text-brand-green bg-[#E8F4F0] px-3 py-1 rounded-full border border-brand-green/30">
                  Select a Level to View Schedules
                </span>
              </div>

              {/* 4 Quadrants Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                
                {/* Q1: Junior Academy */}
                <div className="p-4 border-2 border-dashed border-zinc-300 rounded-xl hover:border-brand-green hover:bg-[#FDFBF7] transition-all">
                  <div className="w-8 h-8 rounded-lg bg-[#E0F2FE] border border-sky-300 flex items-center justify-center mb-3">
                    <span className="text-lg">👶</span>
                  </div>
                  <h4 className="font-display font-bold text-base text-brand-charcoal uppercase leading-tight mb-1">
                    Junior Academy
                  </h4>
                  <span className="font-display font-extrabold text-[10px] text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                    AGES U7 - U12
                  </span>
                  <p className="text-xs text-brand-muted mt-3 mb-4 leading-tight">
                    Introductory technical training focused on fun and ball mastery.
                  </p>
                  <a href="/programmes/juniors" className="text-xs font-extrabold text-brand-green hover:underline flex items-center gap-1">
                    View Pathways →
                  </a>
                </div>

                {/* Q2: Youth Competitive */}
                <div className="p-4 border-2 border-dashed border-zinc-300 rounded-xl hover:border-brand-green hover:bg-[#FDFBF7] transition-all">
                  <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] border border-amber-300 flex items-center justify-center mb-3">
                    <span className="text-lg">⚡</span>
                  </div>
                  <h4 className="font-display font-bold text-base text-brand-charcoal uppercase leading-tight mb-1">
                    Youth Competitive
                  </h4>
                  <span className="font-display font-extrabold text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    AGES U13 - U18
                  </span>
                  <p className="text-xs text-brand-muted mt-3 mb-4 leading-tight">
                    Competitive leagues, high-performance coaching and fitness modules.
                  </p>
                  <div className="flex flex-col gap-2">
                    <a href="/programmes/youths" className="text-xs font-extrabold text-brand-green hover:underline flex items-center gap-1">
                      View Leagues →
                    </a>
                    <a href="/ddsl-jmo" className="text-xs font-extrabold text-brand-ddsl hover:underline flex items-center gap-1">
                      Referee Program (16+) →
                    </a>
                  </div>
                </div>

                {/* Q3: Seniors */}
                <div className="p-4 border-2 border-dashed border-zinc-300 rounded-xl hover:border-brand-green hover:bg-[#FDFBF7] transition-all">
                  <div className="w-8 h-8 rounded-lg bg-[#FEE2E2] border border-red-300 flex items-center justify-center mb-3">
                    <span className="text-lg">🏆</span>
                  </div>
                  <h4 className="font-display font-bold text-base text-brand-charcoal uppercase leading-tight mb-1">
                    Seniors
                  </h4>
                  <span className="font-display font-extrabold text-[10px] text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                    ADULT AMATEUR
                  </span>
                  <p className="text-xs text-brand-muted mt-3 mb-4 leading-tight">
                    Top-tier amateur divisions including LSL, DWSL and veteran leagues.
                  </p>
                  <a href="/programmes/seniors" className="text-xs font-extrabold text-brand-green hover:underline flex items-center gap-1">
                    View Adult squads →
                  </a>
                </div>

                {/* Q4: Inclusive Football */}
                <div className="p-4 border-2 border-dashed border-zinc-300 rounded-xl hover:border-brand-green hover:bg-[#FDFBF7] transition-all">
                  <div className="w-8 h-8 rounded-lg bg-[#E9D5FF] border border-purple-300 flex items-center justify-center mb-3">
                    <span className="text-lg">🤝</span>
                  </div>
                  <h4 className="font-display font-bold text-base text-brand-charcoal uppercase leading-tight mb-1">
                    Inclusive Football
                  </h4>
                  <span className="font-display font-extrabold text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    FOOTBALL FOR ALL
                  </span>
                  <p className="text-xs text-brand-muted mt-3 mb-4 leading-tight">
                    Pan-disability programs, sensory sessions, and accessibility football.
                  </p>
                  <a href="/football-for-all" className="text-xs font-extrabold text-brand-green hover:underline flex items-center gap-1">
                    View Accessibility →
                  </a>
                </div>

              </div>

            </div>
          </div>
        )}

      </header>

      {/* Mobile Menu Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-20 z-40 w-full h-[calc(100vh-5rem)] bg-brand-cream overflow-y-auto border-t-4 border-brand-charcoal flex flex-col md:hidden">
          
          <div className="flex-1 p-6 space-y-6">
            
            {/* Equality Section (Mobile) */}
            <div className="border-3 border-brand-charcoal rounded-2xl bg-white p-4 shadow-brutalist">
              <button
                onClick={() => setMobileEqualityOpen(!mobileEqualityOpen)}
                className="w-full flex items-center justify-between font-display font-black text-lg text-brand-green uppercase italic"
              >
                <span>♀/♂ Teams Pathway</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className={`w-5 h-5 transition-transform ${mobileEqualityOpen ? 'rotate-180' : ''}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              {mobileEqualityOpen && (
                <div className="mt-4 pt-4 border-t border-zinc-200 space-y-6">
                  <div>
                    <h4 className="font-display font-black text-sm text-brand-green uppercase italic mb-2">Girls & Women</h4>
                    <ul className="space-y-2 text-sm pl-2">
                      <li><a href="/teams/womens-firsts" className="text-brand-charcoal hover:text-brand-green font-semibold block">Womens First Team (WNL)</a></li>
                      <li><a href="/teams/womens-dev" className="text-brand-charcoal hover:text-brand-green block">Womens Development</a></li>
                      <li><a href="/teams/girls-academy" className="text-brand-charcoal hover:text-brand-green block">Girls Academy (U8-U18)</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-display font-black text-sm text-brand-charcoal uppercase italic mb-2">Boys & Men</h4>
                    <ul className="space-y-2 text-sm pl-2">
                      <li><a href="/teams/mens-firsts" className="text-brand-charcoal hover:text-brand-green font-semibold block">Mens First Team (LSL)</a></li>
                      <li><a href="/teams/mens-academy" className="text-brand-charcoal hover:text-brand-green block">Boys Academy (U7-U18)</a></li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Format Section (Mobile) */}
            <div className="border-3 border-brand-charcoal rounded-2xl bg-white p-4 shadow-brutalist">
              <button
                onClick={() => setMobileFormatOpen(!mobileFormatOpen)}
                className="w-full flex items-center justify-between font-display font-black text-lg text-brand-charcoal uppercase italic"
              >
                <span>Format & Level</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className={`w-5 h-5 transition-transform ${mobileFormatOpen ? 'rotate-180' : ''}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              {mobileFormatOpen && (
                <div className="mt-4 pt-4 border-t border-zinc-200 space-y-4 text-sm font-semibold pl-2">
                  <a href="/programmes/juniors" className="block text-brand-charcoal hover:text-brand-green">Junior Academy [U7-U12]</a>
                  <a href="/programmes/youths" className="block text-brand-charcoal hover:text-brand-green">Youth Competitive [U13-U18]</a>
                  <a href="/ddsl-jmo" className="block text-brand-ddsl hover:text-brand-green font-bold">Join JMO Referee Program (16+)</a>
                  <a href="/programmes/seniors" className="block text-brand-charcoal hover:text-brand-green">Seniors [Adult]</a>
                  <a href="/football-for-all" className="block text-brand-charcoal hover:text-brand-green font-bold">Inclusive Football For All</a>
                </div>
              )}
            </div>

            {/* General Links (Mobile) */}
            <div className="flex flex-col gap-4 font-display font-bold uppercase tracking-wider pl-4">
              <a href="/news" className="text-brand-charcoal text-base">News</a>
              <a href="/contact" className="text-brand-charcoal text-base">Contact</a>
            </div>

          </div>

          {/* Footer Call to Action (Mobile) */}
          <div className="p-6 bg-white border-t-4 border-brand-charcoal flex flex-col gap-3">
            <a href="/astro-booking" className="btn-brutalist-neon py-3 text-center text-base">
              Book Astro Pitch
            </a>
            <a href="/membership-calculator" className="btn-brutalist-green py-3 text-center text-base">
              Fees Calculator
            </a>
          </div>

        </div>
      )}
    </>
  );
}
