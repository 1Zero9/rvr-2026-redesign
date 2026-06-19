'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { NormalisedMatch, SyncResponse } from '@/lib/ddsl/types';

const RVR_NAMES = new Set([
  'Rivervalley Rangers',
  'River Valley Rangers',
  'River Valley Rangers FC',
]);

function formatHeaderDate(): string {
  return new Date()
    .toLocaleDateString('en-IE', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
    .toUpperCase();
}

function formatRowDate(iso: string): string {
  return new Date(`${iso}T00:00:00`)
    .toLocaleDateString('en-IE', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    })
    .toUpperCase();
}

function isRvr(name: string): boolean {
  return RVR_NAMES.has(name);
}

function opponent(match: NormalisedMatch): string {
  return match.isRvrHome ? match.awayTeam : match.homeTeam;
}

function tickerText(fixtures: NormalisedMatch[]): string {
  return fixtures
    .map((f) => {
      const day = formatRowDate(f.date).split(' ')[0];
      const opp = opponent(f).toUpperCase();
      return `${f.ageGroup} ${day} vs ${opp}`;
    })
    .join(' · ');
}

export default function TeletextFixtures() {
  const [fixtures, setFixtures] = useState<NormalisedMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    fetch('/api/fixtures/sync', { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error('sync failed');
        return res.json() as Promise<SyncResponse>;
      })
      .then((data) => {
        if (!active) return;
        const upcoming = data.fixtures
          .filter((f) => f.status === 'upcoming')
          .sort(
            (a, b) =>
              a.date.localeCompare(b.date) || a.time.localeCompare(b.time),
          )
          .slice(0, 6);
        setFixtures(upcoming);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const ticker = tickerText(fixtures);

  return (
    <div className="bg-black font-mono text-sm w-full">

      {/* Header bar */}
      <div className="bg-brand-navy text-brand-neon font-mono font-bold uppercase text-xs tracking-widest px-3 py-1 flex items-center justify-between gap-2">
        <span>RVR FIXTURES</span>
        <span className="text-brand-neon font-mono text-xs shrink-0">P302</span>
        <span className="text-brand-sky/70 text-right">{formatHeaderDate()}</span>
      </div>

      {/* Body */}
      {loading ? (
        /* Loading state */
        <div>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="bg-black border-b border-brand-sky/20 px-3 py-2 min-h-11 flex items-center"
            >
              <span className="animate-pulse w-48 h-3 bg-brand-sky/30 rounded-none inline-block" />
            </div>
          ))}
        </div>
      ) : error || fixtures.length === 0 ? (
        /* Error / empty state */
        <div className="bg-black px-3 py-4 text-brand-sky/50 text-xs">
          NO FIXTURE DATA · SYNC RUNS DAILY 07:00 UTC
        </div>
      ) : (
        /* Fixture rows */
        <div>
          {fixtures.map((f, i) => {
            const isHome = f.isRvrHome;
            const opp = opponent(f);
            return (
              <div
                key={f.id}
                className={`px-3 py-2 flex items-center gap-2 min-h-11 border-b border-brand-sky/20 ${
                  i % 2 === 0 ? 'bg-black' : 'bg-brand-navy/40'
                }`}
              >
                {/* 1. Age badge */}
                <span className="bg-brand-neon text-black font-bold text-[10px] px-1.5 py-0.5 w-9 text-center shrink-0">
                  {f.ageGroup}
                </span>

                {/* 2. H/A indicator */}
                <span
                  className={`text-[10px] font-bold w-5 shrink-0 ${
                    isHome ? 'text-brand-neon' : 'text-brand-sky/60'
                  }`}
                >
                  {isHome ? 'H' : 'A'}
                </span>

                {/* 3. Opponent */}
                <span className="flex-1 text-white text-xs truncate min-w-0">
                  <span className="text-brand-sky/50">vs </span>
                  {opp}
                </span>

                {/* 4. Date */}
                <span className="text-brand-neon text-[10px] font-mono shrink-0 w-16 text-right">
                  {formatRowDate(f.date)}
                </span>

                {/* 5. Time */}
                <span className="text-brand-sky/70 text-[10px] font-mono shrink-0 w-10 text-right">
                  {f.time || 'TBC'}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer bar */}
      <div className="bg-brand-navy/60 px-3 flex items-center justify-between text-[10px] font-mono min-h-11">
        <span className="text-brand-sky/50">LIVE DATA · DDSL 2025/26</span>
        <Link
          href="/fixtures"
          className="text-brand-neon hover:underline inline-flex items-center min-h-11"
        >
          ALL FIXTURES »
        </Link>
      </div>

      {/* Scrolling ticker */}
      {!loading && !error && fixtures.length > 0 && (
        <div className="bg-brand-neon text-brand-charcoal text-[10px] font-mono font-bold uppercase overflow-hidden whitespace-nowrap">
          <span className="inline-block animate-ticker hover:[animation-play-state:paused] px-4 py-1">
            {ticker}
          </span>
        </div>
      )}
    </div>
  );
}
