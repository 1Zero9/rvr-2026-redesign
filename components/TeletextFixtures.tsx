'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { NormalisedMatch, SyncResponse } from '@/lib/ddsl/types';
import type { SeniorMatch, SeniorSyncResponse } from '@/lib/finalwhistle/types';

// ─── Internal types ───────────────────────────────────────────────────────────

type MatchSource = 'ddsl' | 'senior';
type MatchGender = 'Boys' | 'Girls' | 'Unknown';
type FilterKey = 'All' | 'DDSL Boys' | 'DDSL Girls' | 'Senior' | string;

interface UnifiedMatch {
  id: string;
  date: string;
  time: string;
  ageGroup: string;
  opponent: string;
  isHome: boolean;
  source: MatchSource;
  gender: MatchGender;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatHeaderDate(): string {
  return new Date()
    .toLocaleDateString('en-IE', {
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
    })
    .toUpperCase();
}

function formatRowDate(iso: string): string {
  return new Date(`${iso}T00:00:00`)
    .toLocaleDateString('en-IE', { weekday: 'short', day: 'numeric', month: 'short' })
    .toUpperCase();
}

function genderFrom(competition: string): MatchGender {
  if (/\bGirls\b/i.test(competition)) return 'Girls';
  if (/\bBoys\b/i.test(competition)) return 'Boys';
  return 'Unknown';
}

function fromDDSL(m: NormalisedMatch): UnifiedMatch {
  return {
    id:       String(m.id),
    date:     m.date,
    time:     m.time,
    ageGroup: m.ageGroup,
    opponent: m.isRvrHome ? m.awayTeam : m.homeTeam,
    isHome:   m.isRvrHome,
    source:   'ddsl',
    gender:   genderFrom(m.competition),
  };
}

function fromSenior(m: SeniorMatch): UnifiedMatch {
  return {
    id:       m.matchId,
    date:     m.date,
    time:     '',
    ageGroup: 'Senior',
    opponent: m.isRvrHome ? m.awayTeam : m.homeTeam,
    isHome:   m.isRvrHome,
    source:   'senior',
    gender:   'Unknown',
  };
}

function applyFilter(matches: UnifiedMatch[], filter: FilterKey): UnifiedMatch[] {
  if (filter === 'All') return matches;
  if (filter === 'DDSL Boys') return matches.filter((m) => m.source === 'ddsl' && m.gender === 'Boys');
  if (filter === 'DDSL Girls') return matches.filter((m) => m.source === 'ddsl' && m.gender === 'Girls');
  if (filter === 'Senior') return matches.filter((m) => m.source === 'senior');
  return matches.filter((m) => m.ageGroup === filter);
}

function badgeClass(m: UnifiedMatch): string {
  if (m.source === 'senior') return 'bg-brand-green text-white';
  if (m.gender === 'Girls')  return 'bg-brand-maroon text-white';
  return 'bg-brand-sky text-brand-charcoal';
}

function pillActiveClass(key: FilterKey): string {
  if (key === 'DDSL Boys')  return 'bg-brand-sky text-brand-charcoal';
  if (key === 'DDSL Girls') return 'bg-brand-maroon text-white';
  if (key === 'Senior')     return 'bg-brand-green text-white';
  return 'bg-brand-neon text-brand-charcoal';
}

const INACTIVE_PILL = 'bg-brand-navy border border-brand-sky/30 text-brand-sky/70';
const BASE_PILL     = 'text-[11px] font-mono font-bold uppercase px-3 rounded-none min-h-[44px] shrink-0 transition-colors';

const STATIC_PILLS: Array<{ key: FilterKey; label: string }> = [
  { key: 'All',        label: 'All' },
  { key: 'DDSL Boys',  label: 'DDSL Boys' },
  { key: 'DDSL Girls', label: 'DDSL Girls' },
  { key: 'Senior',     label: 'Senior' },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function TeletextFixtures() {
  const [allMatches,  setAllMatches]  = useState<UnifiedMatch[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterKey>('All');

  useEffect(() => {
    let active = true;

    const fetchDdsl = fetch('/api/fixtures/sync', { cache: 'no-store' })
      .then((r) => {
        if (!r.ok) throw new Error('ddsl sync failed');
        return r.json() as Promise<SyncResponse>;
      })
      .then((data) =>
        data.fixtures
          .filter((f) => f.status === 'upcoming')
          .map(fromDDSL),
      )
      .catch(() => [] as UnifiedMatch[]);

    const fetchSenior = fetch('/api/senior/sync', { cache: 'no-store' })
      .then((r) => {
        if (!r.ok) throw new Error('senior sync failed');
        return r.json() as Promise<SeniorSyncResponse>;
      })
      .then((data) => data.fixtures.map(fromSenior))
      .catch(() => [] as UnifiedMatch[]);

    Promise.all([fetchDdsl, fetchSenior]).then(([ddsl, senior]) => {
      if (!active) return;
      const combined = [...ddsl, ...senior].sort(
        (a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time),
      );
      setAllMatches(combined);
      setLoading(false);
    });

    return () => { active = false; };
  }, []);

  // ── Derived ────────────────────────────────────────────────────────────────

  const availableAgeGroups = [
    ...new Set(allMatches.filter((m) => m.source === 'ddsl').map((m) => m.ageGroup)),
  ].sort((a, b) => {
    const na = parseInt(a.replace(/\D/g, ''), 10) || 99;
    const nb = parseInt(b.replace(/\D/g, ''), 10) || 99;
    return na - nb;
  });

  const displayMatches = applyFilter(allMatches, activeFilter).slice(0, 6);

  const tickerItems = allMatches.map((m, i) => (
    <span key={m.id}>
      <span
        className={
          m.source === 'senior'
            ? 'bg-brand-green text-white px-1'
            : m.gender === 'Girls'
            ? 'bg-brand-maroon text-white px-1'
            : 'text-brand-charcoal'
        }
      >
        {m.ageGroup} {m.isHome ? 'H' : 'A'} vs{' '}
        {m.opponent.toUpperCase()}
      </span>
      {i < allMatches.length - 1 && (
        <span className="text-brand-charcoal mx-2">·</span>
      )}
    </span>
  ));

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="bg-black font-mono text-sm w-full">

      {/* Header bar */}
      <div className="bg-brand-navy text-brand-neon font-mono font-bold uppercase text-xs tracking-widest px-3 py-1 flex items-center justify-between gap-2">
        <span>RVR FIXTURES</span>
        <span className="text-brand-neon font-mono text-xs shrink-0">P302</span>
        <span className="text-brand-sky/70 text-right">{formatHeaderDate()}</span>
      </div>

      {/* Filter bar */}
      {loading ? (
        <div className="flex gap-2 px-3 py-2 overflow-x-auto">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-brand-sky/20 rounded-none min-h-[44px] w-16 shrink-0"
            />
          ))}
        </div>
      ) : (
        <div className="flex gap-2 px-3 py-2 overflow-x-auto">
          {STATIC_PILLS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveFilter(key)}
              className={`${BASE_PILL} ${activeFilter === key ? pillActiveClass(key) : INACTIVE_PILL}`}
            >
              {label}
            </button>
          ))}
          {availableAgeGroups.map((ag) => (
            <button
              key={ag}
              type="button"
              onClick={() => setActiveFilter(ag)}
              className={`${BASE_PILL} ${activeFilter === ag ? pillActiveClass(ag) : INACTIVE_PILL}`}
            >
              {ag}
            </button>
          ))}
        </div>
      )}

      {/* Board body */}
      {loading ? (
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
      ) : displayMatches.length === 0 ? (
        <div className="bg-black px-3 py-4 text-brand-sky/50 text-xs font-mono">
          {allMatches.length === 0
            ? 'NO FIXTURE DATA · SYNC RUNS DAILY 07:00 UTC'
            : 'NO FIXTURES MATCH THIS FILTER'}
        </div>
      ) : (
        <div>
          {displayMatches.map((m, i) => (
            <div
              key={m.id}
              className={`px-3 py-2 flex items-center gap-2 min-h-11 border-b border-brand-sky/20 ${
                i % 2 === 0 ? 'bg-black' : 'bg-brand-navy/40'
              }`}
            >
              {/* 1. Age badge */}
              <span className={`font-bold text-[10px] px-1.5 py-0.5 w-9 text-center shrink-0 ${badgeClass(m)}`}>
                {m.ageGroup}
              </span>

              {/* 2. H/A indicator */}
              <span
                className={`text-[10px] font-bold w-5 shrink-0 ${
                  m.isHome ? 'text-brand-neon' : 'text-brand-sky/60'
                }`}
              >
                {m.isHome ? 'H' : 'A'}
              </span>

              {/* 3. Opponent */}
              <span className="flex-1 text-white text-xs truncate min-w-0">
                <span className="text-brand-sky/50">vs </span>
                {m.opponent}
              </span>

              {/* 4. Date */}
              <span className="text-brand-neon text-[10px] font-mono shrink-0 w-16 text-right">
                {formatRowDate(m.date)}
              </span>

              {/* 5. Time */}
              <span className="text-brand-sky/70 text-[10px] font-mono shrink-0 w-10 text-right">
                {m.time || 'TBC'}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Footer bar */}
      <div className="bg-brand-navy/60 px-3 flex items-center justify-between text-[10px] font-mono min-h-11">
        <span className="flex items-center gap-3">
          <a
            href="https://ddsl.ie"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-sky/40 hover:text-brand-sky text-[10px] font-mono uppercase tracking-wide transition-colors"
          >
            Powered by DDSL.ie
          </a>
          <span className="text-brand-sky/20">·</span>
          <a
            href="https://www.finalwhistle.ie/soccer/team/rivervalley-rangers-afc/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-sky/40 hover:text-brand-sky text-[10px] font-mono uppercase tracking-wide transition-colors"
          >
            FinalWhistle.ie
          </a>
        </span>
        <Link
          href="/fixtures"
          className="text-brand-neon hover:underline inline-flex items-center min-h-11"
        >
          ALL FIXTURES »
        </Link>
      </div>

      {/* Scrolling ticker — all upcoming, unfiltered */}
      {!loading && allMatches.length > 0 && (
        <div className="bg-brand-neon text-brand-charcoal text-[10px] font-mono font-bold uppercase overflow-hidden whitespace-nowrap">
          <span className="inline-block animate-ticker hover:[animation-play-state:paused] px-4 py-1">
            {tickerItems}
          </span>
        </div>
      )}
    </div>
  );
}
