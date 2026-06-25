'use client';

import React from 'react';
import { CLUB_SEASON } from '@/config/club-season';
import { computeClubStats } from '@/lib/club-stats';
import AnnouncementTrigger from './announcements/AnnouncementTrigger';

const { yearsActive, totalTeams, estimatedPlayers } = computeClubStats();

const heroStats = [
  { value: `${yearsActive} Yrs`, label: 'Strong legacy' },
  { value: `${totalTeams}`, label: 'Active teams' },
  { value: `${Math.floor(estimatedPlayers / 10) * 10}+`, label: 'Local players' },
  { value: '25+', label: 'Qualified coaches' },
  { value: 'Vetted', label: 'Garda vetted' },
];

const explodeProps = [
  { x: '-60px', y: '-40px', r: '-8deg', delay: '0.1s' },
  { x: '40px',  y: '-60px', r: '6deg',  delay: '0.25s' },
  { x: '80px',  y: '20px',  r: '-5deg', delay: '0.4s' },
  { x: '-40px', y: '60px',  r: '10deg', delay: '0.55s' },
  { x: '0px',   y: '-80px', r: '-12deg', delay: '0.7s' },
];

export default function Hero() {
  return (
    <section className="relative min-h-[80vh] w-full overflow-hidden flex items-center justify-center bg-brand-navy text-white border-b border-brand-sky/20">
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-45 scale-105"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        {/* Strengthened gradient overlay for text legibility */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-brand-navy/70 via-brand-navy/50 to-brand-navy/80" />
        {/* Neon hairline grid — visible on dark video */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            backgroundImage: `linear-gradient(rgba(133,227,32,0.12) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(133,227,32,0.12) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="absolute top-12 left-10 hidden lg:block rotate-12 scale-90 animate-pulse z-20">
        <div className="bg-brand-neon text-brand-charcoal font-display font-black text-xs px-4 py-2 border-3 border-brand-charcoal rounded-xl shadow-brutalist">
          EST. {CLUB_SEASON.foundingYear}
        </div>
      </div>
      <div className="absolute bottom-16 right-12 hidden lg:block -rotate-6 scale-95 hover:rotate-2 transition-transform duration-300 z-20">
        <div className="bg-white text-brand-green font-display font-black text-sm px-5 py-3 border-3 border-brand-charcoal rounded-2xl shadow-brutalist-green">
          DUBLIN&apos;S BEST Astro Pitch
        </div>
      </div>

      <div className="relative z-20 max-w-5xl mx-auto px-6 text-center py-20 flex flex-col items-center">
        <span className="inline-block bg-brand-neon text-brand-charcoal font-display font-black text-xs md:text-sm px-5 py-2 rounded-full uppercase tracking-wider mb-8 border-3 border-brand-charcoal shadow-brutalist rotate-[-2deg] hover:rotate-0 transition-transform cursor-default">
          Dublin, Ireland &bull; Rivervalley Rangers AFC
        </span>

        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 mb-8 w-full justify-center">
          <img
            src="/river-valley-rangers-logo-pack-v2/RVR-New-White.png"
            alt="Rivervalley Rangers AFC crest"
            width={192}
            height={192}
            className="w-28 h-28 md:w-40 md:h-40 lg:w-48 lg:h-48 object-contain shrink-0 select-none"
          />
          <h1 className="font-display font-black text-5xl md:text-7xl lg:text-8xl tracking-tighter uppercase leading-none italic select-none skew-x-[-4deg] text-center md:text-left">
            FEEL THE <span className="text-brand-neon">RVR</span> ENERGY
          </h1>
        </div>

        <p className="font-sans text-lg md:text-2xl text-zinc-200 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
          Rivervalley Rangers AFC is Swords&apos; premier soccer club. Empowering local athletes across all ages, formats, and levels.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full max-w-2xl mb-16">
          <a
            href="/register"
            className="btn-brutalist-neon px-8 py-4.5 text-lg w-full md:w-auto text-center inline-flex items-center justify-center gap-2 group"
          >
            Join RVR Academy
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="3"
              stroke="currentColor"
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>

          <a
            href="/astro-booking"
            className="btn-brutalist-green px-8 py-4.5 text-lg w-full md:w-auto text-center inline-flex items-center justify-center gap-2 group"
          >
            Book Astro Pitch
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="3"
              stroke="currentColor"
              className="w-5 h-5 group-hover:rotate-12 transition-transform"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
              />
            </svg>
          </a>

          <AnnouncementTrigger heroMode />
        </div>

        {/* Stat cards — scatter-then-snap entrance */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 w-full">
          {heroStats.map((stat, i) => {
            const ep = explodeProps[i];
            return (
              <div
                key={i}
                className="animate-explode-in bg-white text-brand-charcoal border-3 border-brand-charcoal rounded-2xl shadow-brutalist p-4 flex flex-col gap-1 text-left"
                style={{
                  '--explode-x': ep.x,
                  '--explode-y': ep.y,
                  '--explode-r': ep.r,
                  animationDelay: ep.delay,
                  animationFillMode: 'both',
                } as React.CSSProperties}
              >
                <span className="font-display font-black text-2xl md:text-3xl uppercase tracking-tighter italic leading-none">
                  {stat.value}
                </span>
                <span className="font-sans text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                  {stat.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
