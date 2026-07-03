'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export type SpotlightItem = {
  id: string;
  kind: 'campaign' | 'news';
  label: string;
  labelClass: string;
  title: string;
  subtitle: string | null;
  imageUrl: string | null;
  mobileImageUrl: string | null;
  objectPosition: string;
  href: string;
  ctaLabel: string;
};

export default function ClubSpotlight({
  items,
  intervalMs = 7000,
}: {
  items: SpotlightItem[];
  intervalMs?: number;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const next = useCallback(
    () => setIndex((i) => (i + 1) % items.length),
    [items.length],
  );

  useEffect(() => {
    if (items.length < 2 || paused || reducedMotion.current) return;
    const t = setInterval(next, intervalMs);
    return () => clearInterval(t);
  }, [items.length, paused, next, intervalMs]);

  if (items.length === 0) return null;
  const item = items[index];

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Club spotlight"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="relative overflow-hidden border-3 border-brand-charcoal bg-brand-navy min-h-[340px] md:min-h-[420px] flex flex-col justify-end shadow-brutalist-charcoal">
        {item.imageUrl && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={`m-${item.id}`}
              src={item.mobileImageUrl || item.imageUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover md:hidden"
              style={{ objectPosition: item.objectPosition }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={`d-${item.id}`}
              src={item.imageUrl}
              alt=""
              className="absolute inset-0 hidden h-full w-full object-cover md:block"
              style={{ objectPosition: item.objectPosition }}
            />
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/95 via-brand-navy/40 to-brand-navy/10" />

        <div className="relative p-6 md:p-10" aria-live="polite">
          <span className={`inline-block px-2.5 py-1 text-[10px] md:text-xs font-display font-black uppercase tracking-widest ${item.labelClass}`}>
            {item.label}
          </span>
          <h3 className="mt-3 font-display font-black italic text-3xl md:text-5xl uppercase tracking-tight text-brand-cream leading-none max-w-3xl">
            {item.title}
          </h3>
          {item.subtitle && (
            <p className="mt-3 text-sm md:text-base font-semibold text-brand-sky/90 max-w-xl line-clamp-2">
              {item.subtitle}
            </p>
          )}
          <Link
            href={item.href}
            className="mt-5 inline-flex min-h-[48px] items-center gap-2 border-3 border-brand-charcoal bg-brand-neon px-6 text-sm font-display font-black italic uppercase text-brand-charcoal hover:translate-x-[2px] hover:translate-y-[2px] transition-transform"
          >
            {item.ctaLabel} →
          </Link>
        </div>
      </div>

      {/* Controls */}
      {items.length > 1 && (
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous item"
              onClick={() => setIndex((i) => (i - 1 + items.length) % items.length)}
              className="inline-flex h-11 w-11 items-center justify-center border-2 border-brand-charcoal bg-white text-brand-charcoal hover:bg-brand-neon transition-colors"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Next item"
              onClick={next}
              className="inline-flex h-11 w-11 items-center justify-center border-2 border-brand-charcoal bg-white text-brand-charcoal hover:bg-brand-neon transition-colors"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
            <div className="ml-2 flex items-center gap-1.5" role="tablist" aria-label="Spotlight items">
              {items.map((it, i) => (
                <button
                  key={it.id}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Item ${i + 1}: ${it.title}`}
                  onClick={() => setIndex(i)}
                  className={`h-2.5 transition-all ${
                    i === index ? 'w-7 bg-brand-neon border border-brand-charcoal' : 'w-2.5 bg-brand-charcoal/25 hover:bg-brand-charcoal/50'
                  }`}
                />
              ))}
            </div>
          </div>
          <Link
            href="/news"
            className="min-h-[44px] inline-flex items-center px-2 text-xs font-display font-black uppercase tracking-wide text-brand-charcoal/40 hover:text-brand-navy transition-colors"
          >
            See all →
          </Link>
        </div>
      )}
    </section>
  );
}
