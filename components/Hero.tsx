'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { UserPlus, Route, Trophy, Newspaper, Pause, Play } from 'lucide-react';
import { computeClubStats } from '@/lib/club-stats';
import { CLUB_SEASON } from '@/config/club-season';

export type HeroMotionEffect = 'NONE' | 'ZOOM_IN' | 'ZOOM_OUT' | 'PIXELATE';

export type HeroMediaItem = {
  id: string;
  type: 'IMAGE' | 'VIDEO';
  url: string;
  mobileImageUrl: string | null;
  posterUrl: string | null;
  focalX: number;
  focalY: number;
  motionEffect: HeroMotionEffect;
};

// Built-in fallback — used whenever the admin hasn't added anything to the
// hero rotation yet, so the homepage never ships blank.
const DEFAULT_ITEM: HeroMediaItem = {
  id: 'default-hero-video',
  type: 'VIDEO',
  url: '/videos/hero.mp4',
  mobileImageUrl: null,
  posterUrl: '/images/home2.jpg',
  focalX: 50,
  focalY: 50,
  motionEffect: 'NONE',
};

const HERO_CTAS = [
  { label: 'Join the Club',   sub: `Register for ${CLUB_SEASON.registrationSeason}`, href: '/register', icon: UserPlus },
  { label: 'Match Day',       sub: 'Fixtures & results',       href: '/fixtures',      icon: Trophy       },
  { label: 'Club News',       sub: 'Latest updates',           href: '/news',          icon: Newspaper    },
  { label: 'Player Pathway',  sub: 'Academy to seniors',       href: '/pathway',       icon: Route        },
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

export default function Hero({ items = [] }: { items?: HeroMediaItem[] }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [videoPaused, setVideoPaused] = useState(false);
  const [ready, setReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const pool = items.length > 0 ? items : [DEFAULT_ITEM];
  // SSR and the first client render both use pool[0] — deterministic, so no
  // hydration mismatch. The random pick below only runs after mount.
  const [active, setActive] = useState(pool[0]);

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  // Randomised on page load only — fires once after mount, then the choice
  // stays fixed for the rest of the visit (no auto-advancing afterwards).
  useEffect(() => {
    if (pool.length < 2) return;
    setActive(pool[Math.floor(Math.random() * pool.length)]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (reducedMotion) {
      v.pause();
      setVideoPaused(true);
    } else {
      setVideoPaused(v.paused);
    }
  }, [active, reducedMotion]);

  // Trigger explode-in animation when stat cards enter the viewport
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setReady(true); obs.disconnect(); } },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Pixelate-in reveal for images: draw a tiny low-res snapshot, then
  // crossfade it out to reveal the sharp image underneath.
  const [pixelSrc, setPixelSrc] = useState<string | null>(null);
  const [pixelRevealed, setPixelRevealed] = useState(false);

  useEffect(() => {
    setPixelSrc(null);
    setPixelRevealed(false);
    if (reducedMotion) return;
    if (active.type !== 'IMAGE' || active.motionEffect !== 'PIXELATE') return;

    let cancelled = false;
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (cancelled) return;
      try {
        const w = 24;
        const h = Math.max(1, Math.round(w * ((img.naturalHeight || 1) / (img.naturalWidth || 1))));
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
        if (cancelled) return;
        setPixelSrc(dataUrl);
        // Two rAFs so the browser paints the pixelated frame before the
        // opacity transition to it starts.
        requestAnimationFrame(() => requestAnimationFrame(() => { if (!cancelled) setPixelRevealed(true); }));
      } catch {
        // Cross-origin source without permissive CORS taints the canvas —
        // skip the reveal and just show the sharp image.
      }
    };
    img.src = active.url;
    return () => { cancelled = true; };
  }, [active, reducedMotion]);

  const toggleVideo = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setVideoPaused(false); }
    else          { v.pause(); setVideoPaused(true); }
  };

  const objectPosition = `${active.focalX}% ${active.focalY}%`;
  const zoomClass =
    active.motionEffect === 'ZOOM_IN'  ? 'animate-hero-zoom-in'  :
    active.motionEffect === 'ZOOM_OUT' ? 'animate-hero-zoom-out' :
    'scale-105';

  return (
    <section className="relative min-h-[80vh] w-full flex items-start justify-center bg-brand-navy text-white border-b border-brand-sky/20">
      <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
        {active.type === 'VIDEO' ? (
          <video
            key={active.id}
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            poster={active.posterUrl ?? undefined}
            className={`w-full h-full object-cover opacity-35 ${zoomClass}`}
            style={{ objectPosition }}
          >
            <source src={active.url} type="video/mp4" />
          </video>
        ) : active.mobileImageUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={`m-${active.id}`}
              src={active.mobileImageUrl}
              alt=""
              className={`w-full h-full object-cover opacity-35 md:hidden ${zoomClass}`}
              style={{ objectPosition }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={`d-${active.id}`}
              src={active.url}
              alt=""
              className={`w-full h-full object-cover opacity-35 hidden md:block ${zoomClass}`}
              style={{ objectPosition }}
            />
          </>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={active.id}
            src={active.url}
            alt=""
            className={`w-full h-full object-cover opacity-35 ${zoomClass}`}
            style={{ objectPosition }}
          />
        )}

        {pixelSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={pixelSrc}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              objectPosition,
              imageRendering: 'pixelated',
              opacity: pixelRevealed ? 0 : 0.35,
              transition: 'opacity 1200ms ease-out',
            }}
          />
        )}

        <div className="absolute inset-0 z-10 bg-gradient-to-b from-brand-navy/55 via-brand-navy/30 to-brand-navy/65" />
        {/* Neon hairline grid — centred to avoid edge-alignment artefacts on mobile */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            backgroundImage: `linear-gradient(rgba(133,227,32,0.10) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(133,227,32,0.10) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            backgroundPosition: 'center center',
          }}
        />
      </div>


      {/* Video pause control — WCAG 2.2.2 */}
      {active.type === 'VIDEO' && (
        <button
          type="button"
          onClick={toggleVideo}
          aria-label={videoPaused ? 'Play background video' : 'Pause background video'}
          className="absolute bottom-4 left-4 z-30 flex items-center justify-center w-9 h-9 rounded-full border border-white/25 bg-brand-navy/60 text-white/60 hover:text-white hover:bg-brand-navy/80 transition-colors backdrop-blur-sm"
        >
          {videoPaused
            ? <Play  className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
            : <Pause className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
          }
        </button>
      )}

      <div className="relative z-20 max-w-5xl mx-auto px-6 text-center py-10 md:py-20 flex flex-col items-center">
        <span className="inline-block bg-brand-neon text-brand-charcoal font-display font-black text-xs md:text-sm px-5 py-2 rounded-full uppercase tracking-wider mb-5 md:mb-8 border-3 border-brand-charcoal shadow-brutalist rotate-[-2deg] hover:rotate-0 transition-transform cursor-default whitespace-nowrap">
          <span className="sm:hidden">Swords, Dublin &bull; Est. 1981</span>
          <span className="hidden sm:inline">Swords, Dublin &bull; Rivervalley Rangers AFC</span>
        </span>

        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 mb-8 w-full justify-center">

          <Image
            src="/river-valley-rangers-logo-pack-v2/RVR-New-White2.png"
            alt="Rivervalley Rangers AFC crest"
            width={288}
            height={288}
            className="w-28 h-28 md:w-36 md:h-36 lg:w-48 lg:h-48 object-contain shrink-0 select-none"
          />

          <h1 className="font-display font-black text-4xl md:text-5xl lg:text-6xl tracking-tighter uppercase leading-none italic select-none skew-x-[-4deg] text-center md:text-left flex-1">
            SWORDS FOOTBALL<br className="hidden md:block" /> <span className="text-brand-neon">SINCE 1981.</span>
          </h1>
        </div>

        <p className="font-sans text-lg md:text-2xl text-zinc-200 max-w-2xl mx-auto mb-4 md:mb-6 leading-relaxed font-medium">
          22 teams. Ages 4 to 55+. Boys, girls, adults, and community programmes — all in Swords. From €115 per season.
        </p>

        {/* Age-group quick-find */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mb-6 md:mb-8">
          <span className="w-full text-center md:w-auto text-zinc-500 text-[10px] font-bold uppercase tracking-widest md:mr-1 mb-1 md:mb-0">Find your team:</span>
          {[
            { label: 'Ages 4–6',  href: '/academy'            },
            { label: 'U7–U17',    href: '/teams'              },
            { label: 'Girls',     href: '/teams?filter=girls' },
            { label: 'Adult',     href: '/seniors'            },
            { label: 'Community', href: '/community'          },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="px-2.5 py-1 rounded-full border border-white/20 bg-white/8 text-white/80 text-[10px] font-display font-black uppercase tracking-wide hover:bg-brand-neon hover:text-brand-charcoal hover:border-brand-neon transition-all"
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-xl mb-10 md:mb-16">
          {HERO_CTAS.map(({ label, sub, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-2 rounded-2xl border-2 border-white/20 px-3 py-5 text-center bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm transition-all duration-200 select-none"
            >
              <Icon className="w-6 h-6 shrink-0" aria-hidden="true" />
              <span className="font-display font-black text-[11px] uppercase tracking-wide leading-tight">{label}</span>
              <span className="text-[10px] font-bold leading-tight text-white/75">{sub}</span>
            </Link>
          ))}
        </div>

        {/* Stat cards — scatter-then-snap entrance, fires when scrolled into view */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 w-full">
          {heroStats.map((stat, i) => {
            const ep = explodeProps[i];
            return (
              <div
                key={i}
                className={`${ready ? 'animate-explode-in' : ''} bg-white text-brand-charcoal border-3 border-brand-charcoal rounded-2xl shadow-brutalist p-4 flex flex-col gap-1 text-left${i === 4 ? ' hidden md:flex' : ''}`}
                style={{
                  '--explode-x': ep.x,
                  '--explode-y': ep.y,
                  '--explode-r': ep.r,
                  '--explode-delay': ep.delay,
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
