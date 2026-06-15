'use client';

import React from 'react';

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
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-soccer-player-kicking-ball-in-rain-4893-large.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/80 via-transparent to-brand-navy/95" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <div className="absolute top-12 left-10 hidden lg:block rotate-12 scale-90 animate-pulse">
        <div className="bg-brand-neon text-brand-charcoal font-display font-black text-xs px-4 py-2 border-3 border-brand-charcoal rounded-xl shadow-brutalist">
          EST. 1981
        </div>
      </div>
      <div className="absolute bottom-16 right-12 hidden lg:block -rotate-6 scale-95 hover:rotate-2 transition-transform duration-300">
        <div className="bg-white text-brand-green font-display font-black text-sm px-5 py-3 border-3 border-brand-charcoal rounded-2xl shadow-brutalist-green">
          DUBLIN&apos;S BEST Astro Pitch
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center py-20 flex flex-col items-center">
        <span className="inline-block bg-brand-neon text-brand-charcoal font-display font-black text-xs md:text-sm px-5 py-2 rounded-full uppercase tracking-wider mb-8 border-3 border-brand-charcoal shadow-brutalist rotate-[-2deg] hover:rotate-0 transition-transform cursor-default">
          Dublin, Ireland &bull; Rivervalley Rangers AFC
        </span>

        <h1 className="font-display font-black text-5xl sm:text-7xl md:text-8xl tracking-tighter uppercase leading-none italic mb-8 select-none skew-x-[-4deg] max-w-4xl text-center">
          FEEL THE <span className="text-brand-neon underline decoration-brand-neon decoration-wavy underline-offset-4">RVR</span> ENERGY
        </h1>

        <p className="font-sans text-lg md:text-2xl text-zinc-200 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
          Rivervalley Rangers AFC is Swords&apos; premier soccer club. Empowering local athletes across all ages, formats, and levels.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-lg">
          <a
            href="/register"
            className="btn-brutalist-neon px-8 py-4.5 text-lg w-full sm:w-auto text-center inline-flex items-center justify-center gap-2 group"
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
            className="btn-brutalist-green px-8 py-4.5 text-lg w-full sm:w-auto text-center inline-flex items-center justify-center gap-2 group"
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
        </div>
      </div>
    </section>
  );
}
