'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { KnownDivision } from '@/config/ddsl-competitions';
import type { AflDivision } from '@/config/afl-competitions';
import FavouriteButton from '@/components/FavouriteButton';

// ─── Types ────────────────────────────────────────────────────────────────────

type Filter = 'ALL' | 'BOYS' | 'GIRLS' | 'SENIOR' | 'OVER35S';

// ─── Constants ────────────────────────────────────────────────────────────────

const DEVELOPMENT_AGES = new Set(['U8', 'U9', 'U10', 'U11']);

const AGE_ORDER: Record<string, number> = {
  U8: 0, U9: 1, U10: 2, U11: 3, U12: 4, U13: 5, U14: 6, U15: 7, U17: 8,
};

const PILLS: { id: Filter; label: string; activeClass: string }[] = [
  { id: 'ALL',     label: 'ALL',      activeClass: 'bg-brand-charcoal text-white' },
  { id: 'BOYS',    label: 'BOYS',     activeClass: 'bg-brand-sky text-brand-charcoal' },
  { id: 'GIRLS',   label: 'GIRLS',    activeClass: 'bg-brand-maroon text-white' },
  { id: 'SENIOR',  label: 'SENIOR',   activeClass: 'bg-brand-green text-white' },
  { id: 'OVER35S', label: 'OVER 35s', activeClass: 'bg-brand-neon text-brand-charcoal' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function stripDdsl(name: string): string {
  return name.replace(/^DDSL\s+/i, '');
}

function groupByAge(divisions: KnownDivision[]) {
  const map = new Map<string, KnownDivision[]>();
  for (const d of divisions) {
    const bucket = map.get(d.ageGroup) ?? [];
    bucket.push(d);
    map.set(d.ageGroup, bucket);
  }
  return [...map.entries()]
    .sort(([a], [b]) => (AGE_ORDER[a] ?? 99) - (AGE_ORDER[b] ?? 99))
    .map(([ageGroup, divs]) => ({
      ageGroup,
      divisions: [...divs].sort((a, b) => a.competitionName.localeCompare(b.competitionName)),
    }));
}

// ─── Props ───────────────────────────────────────────────────────────────────

interface Props {
  youthDivisions: KnownDivision[];
  aflDivisions:   AflDivision[];
  initialFilter?: 'ALL' | 'BOYS' | 'GIRLS' | 'SENIOR' | 'OVER35S';
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function TeamsClient({ youthDivisions, aflDivisions, initialFilter }: Props) {
  const [filter, setFilter] = useState<Filter>(initialFilter ?? 'ALL');

  const boys  = youthDivisions.filter((d) => !d.competitionName.includes('Girls'));
  const girls = youthDivisions.filter((d) =>  d.competitionName.includes('Girls'));

  const boysGroups  = groupByAge(boys);
  const girlsGroups = groupByAge(girls);

  const showBoys   = filter === 'ALL' || filter === 'BOYS';
  const showGirls  = filter === 'ALL' || filter === 'GIRLS';
  const showSenior = filter === 'ALL' || filter === 'SENIOR';
  const showOver35 = filter === 'ALL' || filter === 'OVER35S';

  return (
    <div>
      {/* ── Filter bar ────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-10 bg-brand-cream border-b-2 border-brand-sky/30 py-3 px-4">
        <div className="max-w-5xl mx-auto flex gap-2 overflow-x-auto scrollbar-hide">
          {PILLS.map(({ id, label, activeClass }) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={`rounded-full px-4 py-2 min-h-[44px] text-sm font-bold whitespace-nowrap transition-colors ${
                filter === id
                  ? activeClass
                  : 'bg-brand-navy text-brand-cream border border-brand-sky/30'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Sections ──────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 pb-12">

        {/* SECTION 1 — DDSL BOYS */}
        {showBoys && (
          <section>
            <div className="flex items-center gap-3 mb-4 mt-8">
              <div className="h-8 w-1 bg-brand-sky" />
              <h2 className="font-display italic uppercase text-brand-charcoal text-2xl">
                DDSL Boys
              </h2>
              <span className="bg-brand-sky text-brand-charcoal text-xs font-bold px-2 py-1 rounded-full">
                {boys.length} teams
              </span>
            </div>

            {boysGroups.map(({ ageGroup, divisions }) => {
              const isDev = DEVELOPMENT_AGES.has(ageGroup);
              return (
                <div key={ageGroup}>
                  <h3 className="text-brand-charcoal font-display italic text-lg border-b border-brand-sky/30 pb-1 mb-3 mt-6">
                    {ageGroup}
                    <span className="text-brand-sky text-sm ml-2 font-sans font-normal">
                      · {isDev ? 'Development' : 'Competitive'}
                    </span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {divisions.map((div) => (
                      <div key={div.slug} className="relative">
                        <Link
                          href={`/teams/${div.slug}`}
                          className="group flex flex-col bg-brand-navy border-2 border-brand-sky shadow-brutalist min-h-[88px] hover:border-brand-neon transition-colors"
                        >
                          <div className={`h-1 w-full shrink-0 ${isDev ? 'bg-brand-sky/50' : 'bg-brand-neon'}`} />
                          <div className="p-4 flex flex-col flex-1 justify-between">
                            <p className="font-display italic text-brand-cream text-base leading-tight mb-2">
                              {stripDdsl(div.competitionName)}
                            </p>
                            <p className={`text-sm ${isDev ? 'text-brand-sky' : 'text-brand-neon'}`}>
                              {isDev ? 'View Fixtures →' : 'View Table & Fixtures →'}
                            </p>
                          </div>
                        </Link>
                        <FavouriteButton teamId={div.slug} label={div.competitionName} variant="icon" />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </section>
        )}

        {/* SECTION 2 — DDSL GIRLS */}
        {showGirls && (
          <section>
            <div className="flex items-center gap-3 mb-4 mt-8">
              <div className="h-8 w-1 bg-brand-maroon" />
              <h2 className="font-display italic uppercase text-brand-charcoal text-2xl">
                DDSL Girls
              </h2>
              <span className="bg-brand-maroon text-white text-xs font-bold px-2 py-1 rounded-full">
                {girls.length} teams
              </span>
            </div>

            {girlsGroups.map(({ ageGroup, divisions }) => {
              const isDev = DEVELOPMENT_AGES.has(ageGroup);
              return (
                <div key={ageGroup}>
                  <h3 className="text-brand-charcoal font-display italic text-lg border-b border-brand-maroon/30 pb-1 mb-3 mt-6">
                    {ageGroup}
                    <span className="text-brand-maroon text-sm ml-2 font-sans font-normal">
                      · {isDev ? 'Development' : 'Competitive'}
                    </span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {divisions.map((div) => (
                      <div key={div.slug} className="relative">
                        <Link
                          href={`/teams/${div.slug}`}
                          className="group flex flex-col bg-brand-navy border-2 border-brand-maroon shadow-brutalist min-h-[88px] hover:border-brand-neon transition-colors"
                        >
                          <div className={`h-1 w-full shrink-0 ${isDev ? 'bg-brand-maroon/40' : 'bg-brand-maroon'}`} />
                          <div className="p-4 flex flex-col flex-1 justify-between">
                            <p className="font-display italic text-brand-cream text-base leading-tight mb-2">
                              {stripDdsl(div.competitionName)}
                            </p>
                            <p className="text-sm text-white">
                              {isDev ? 'View Fixtures →' : 'View Table & Fixtures →'}
                            </p>
                          </div>
                        </Link>
                        <FavouriteButton teamId={div.slug} label={div.competitionName} variant="icon" />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </section>
        )}

        {/* SECTION 3 — SENIOR */}
        {showSenior && (
          <section>
            <div className="flex items-center gap-3 mb-4 mt-8">
              <div className="h-8 w-1 bg-brand-green" />
              <h2 className="font-display italic uppercase text-brand-charcoal text-2xl">
                Senior
              </h2>
              <span className="bg-brand-green text-white text-xs font-bold px-2 py-1 rounded-full">
                3 teams
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

              <div className="relative">
                <Link
                  href="/seniors/first-team"
                  className="group flex flex-col bg-brand-navy border-2 border-brand-green shadow-brutalist min-h-[88px] hover:border-brand-neon transition-colors"
                >
                  <div className="h-1 w-full shrink-0 bg-brand-green" />
                  <div className="p-4 flex flex-col flex-1 justify-between">
                    <div>
                      <p className="font-display italic text-brand-cream text-xl leading-tight mb-1">
                        FIRST TEAM
                      </p>
                      <p className="text-brand-green text-sm">LSL Senior 1B Sunday</p>
                    </div>
                    <p className="text-brand-neon text-sm font-bold mt-2">
                      View Fixtures & Results →
                    </p>
                  </div>
                </Link>
                <FavouriteButton teamId="first-team" label="First Team" variant="icon" />
              </div>

              <div className="relative">
                <Link
                  href="/seniors/lsl-div3b"
                  className="group flex flex-col bg-brand-navy border-2 border-brand-green shadow-brutalist min-h-[88px] hover:border-brand-neon transition-colors"
                >
                  <div className="h-1 w-full shrink-0 bg-brand-green" />
                  <div className="p-4 flex flex-col flex-1 justify-between">
                    <div>
                      <p className="font-display italic text-brand-cream text-xl leading-tight mb-1">
                        DIV 3B SATURDAY
                      </p>
                      <p className="text-brand-green text-sm">LSL Division 3B Saturday</p>
                    </div>
                    <p className="text-brand-neon text-sm font-bold mt-2">
                      View Fixtures & Results →
                    </p>
                  </div>
                </Link>
                <FavouriteButton teamId="lsl-div3b" label="LSL Division 3B Saturday" variant="icon" />
              </div>

              <div className="relative">
                <Link
                  href="/seniors/lsl-div3c"
                  className="group flex flex-col bg-brand-navy border-2 border-brand-green shadow-brutalist min-h-[88px] hover:border-brand-neon transition-colors"
                >
                  <div className="h-1 w-full shrink-0 bg-brand-green" />
                  <div className="p-4 flex flex-col flex-1 justify-between">
                    <div>
                      <p className="font-display italic text-brand-cream text-xl leading-tight mb-1">
                        DIV 3C SATURDAY
                      </p>
                      <p className="text-brand-green text-sm">LSL Division 3C Saturday</p>
                    </div>
                    <p className="text-brand-neon text-sm font-bold mt-2">
                      View Fixtures & Results →
                    </p>
                  </div>
                </Link>
                <FavouriteButton teamId="lsl-div3c" label="LSL Division 3C Saturday" variant="icon" />
              </div>

            </div>
          </section>
        )}

        {/* SECTION 4 — OVER 35s */}
        {showOver35 && (
          <section>
            <div className="flex items-center gap-3 mb-4 mt-8">
              <div className="h-8 w-1 bg-brand-neon" />
              <h2 className="font-display italic uppercase text-brand-charcoal text-2xl">
                Over 35s
              </h2>
              <span className="bg-brand-neon text-brand-charcoal text-xs font-bold px-2 py-1 rounded-full">
                {aflDivisions.length} teams
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {aflDivisions.map((division) => (
                <div key={division.id} className="relative">
                  <Link
                    href={`/seniors/over-35s/${division.id}`}
                    className="group flex flex-col bg-brand-navy border-2 border-brand-neon shadow-brutalist min-h-[88px] hover:border-brand-sky transition-colors"
                  >
                    <div className="h-1 w-full shrink-0 bg-brand-neon" />
                    <div className="p-4 flex flex-col flex-1 justify-between">
                      <div>
                        <p className="font-display italic text-brand-cream text-xl leading-tight mb-1">
                          {division.id === 'over35s-a' ? 'OVER 35s A' : 'OVER 35s B'}
                        </p>
                        <p className="text-brand-neon text-sm">{division.competitionName}</p>
                      </div>
                      <p className="text-brand-neon text-sm font-bold mt-2">
                        View Table & Fixtures →
                      </p>
                    </div>
                  </Link>
                  <FavouriteButton teamId={division.id} label={division.competitionName} variant="icon" />
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
