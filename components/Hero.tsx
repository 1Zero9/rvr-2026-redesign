'use client';

import React from 'react';
import Link from 'next/link';
import { UserPlus, CalendarDays, Trophy, Newspaper } from 'lucide-react';
import { computeClubStats } from '@/lib/club-stats';

const HERO_CTAS = [
  { label: 'Join the Club',   sub: 'Register for 2026/27',    href: '/register',      icon: UserPlus    },
  { label: 'Match Day',       sub: 'Fixtures & results',       href: '/fixtures',      icon: Trophy       },
  { label: 'Club News',       sub: 'Latest updates',           href: '/news',          icon: Newspaper    },
  { label: 'Book Astro Pitch', sub: 'Reserve your slot online', href: '/astro-booking', icon: CalendarDays },
] as const;

const { yearsActive, totalTeams, estimatedPlayers } = computeClubStats();

const heroStats = [
  { value: `${yearsActive} Yrs`, label: 'Strong legacy' },
  { value: `${totalTeams}`, label: 'Active teams' },
  { value: `${Math.floor(estimatedPlayers / 10) * 10}+`, label: 'Local players' },
  { value: '25+', label: 'Qualified coaches' },
  { value: 'Vetted', label: 'Garda vetted' },
];

const explodeProps = [
  { x: '-60px', y: '-40px', r: '-8deg', delay: '0.5s' },
  { x: '40px',  y: '-60px', r: '6deg',  delay: '0.65s' },
  { x: '80px',  y: '20px',  r: '-5deg', delay: '0.8s' },
  { x: '-40px', y: '60px',  r: '10deg', delay: '0.95s' },
  { x: '0px',   y: '-80px', r: '-12deg', delay: '1.1s' },
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


      <div className="relative z-20 max-w-5xl mx-auto px-6 text-center py-10 md:py-20 flex flex-col items-center">
        <span className="inline-block bg-brand-neon text-brand-charcoal font-display font-black text-xs md:text-sm px-5 py-2 rounded-full uppercase tracking-wider mb-5 md:mb-8 border-3 border-brand-charcoal shadow-brutalist rotate-[-2deg] hover:rotate-0 transition-transform cursor-default">
          Swords, Dublin &bull; Rivervalley Rangers AFC
        </span>

        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 mb-8 w-full justify-center">

          <img
            src="/river-valley-rangers-logo-pack-v2/RVR-New-White2.png"
            alt="Rivervalley Rangers AFC crest"
            width={288}
            height={288}
            className="w-28 h-28 md:w-36 md:h-36 lg:w-48 lg:h-48 object-contain shrink-0 select-none"
          />

          <h1 className="font-display font-black text-5xl md:text-7xl lg:text-8xl tracking-tighter uppercase leading-none italic select-none skew-x-[-4deg] text-center md:text-left flex-1">
            FEEL THE <span className="text-brand-neon">RVR</span> ENERGY
          </h1>
        </div>

        <p className="font-sans text-lg md:text-2xl text-zinc-200 max-w-2xl mx-auto mb-6 md:mb-12 leading-relaxed font-medium">
          Rivervalley Rangers AFC is Swords&apos; premier soccer club. Empowering local athletes across all ages, formats, and levels.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-xl mb-16">
          {HERO_CTAS.map(({ label, sub, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-2 rounded-2xl border-2 border-white/20 px-3 py-5 text-center bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm transition-all duration-200 select-none"
            >
              <Icon className="w-6 h-6 shrink-0" aria-hidden="true" />
              <span className="font-display font-black text-[11px] uppercase tracking-wide leading-tight">{label}</span>
              <span className="text-[9px] font-bold leading-tight text-white/50">{sub}</span>
            </Link>
          ))}
        </div>

        {/* Stat cards — scatter-then-snap entrance */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 w-full">
          {heroStats.map((stat, i) => {
            const ep = explodeProps[i];
            return (
              <div
                key={i}
                className={`animate-explode-in bg-white text-brand-charcoal border-3 border-brand-charcoal rounded-2xl shadow-brutalist p-4 flex flex-col gap-1 text-left${i === 4 ? ' hidden md:flex' : ''}`}
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
