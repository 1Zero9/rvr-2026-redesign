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
  { id: 'OVER35S', label: 'OVER 35',  activeClass: 'bg-brand-neon text-brand-charcoal' },
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
      <div className="sticky top-16 z-40 bg-brand-cream/95 border-y-2 border-brand-sky/30 px-4 py-3 backdrop-blur sm:top-16">
        <div className="mx-auto flex max-w-5xl flex-wrap gap-2 sm:flex-nowrap sm:overflow-x-auto">
          {PILLS.map(({ id, label, activeClass }) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={`min-h-[44px] rounded-full px-3 py-2 text-xs font-bold whitespace-nowrap transition-colors sm:px-4 sm:text-sm ${
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
      <div className="mx-auto max-w-5xl px-4 pb-36 md:px-6 md:pb-16">

        {/* SECTION 1 — DDSL BOYS */}
        {showBoys && (
          <section>
            <div className="mb-4 mt-7 flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="h-8 w-1 shrink-0 bg-brand-sky" />
              <h2 className="font-display text-2xl italic uppercase text-brand-charcoal">
                DDSL Boys
              </h2>
              <span className="rounded-full bg-brand-sky px-2 py-1 text-xs font-bold text-brand-charcoal">
                {boys.length} teams
              </span>
            </div>

            {boysGroups.map(({ ageGroup, divisions }) => {
              const isDev = DEVELOPMENT_AGES.has(ageGroup);
              return (
                <div key={ageGroup}>
                  <h3 className="mb-3 mt-6 flex items-center gap-2 border-b border-brand-sky/30 pb-2 font-display text-lg italic text-brand-charcoal">
                    {ageGroup}
                    <span className="rounded-full bg-brand-sky px-2 py-1 font-sans text-xs font-bold not-italic text-brand-charcoal">
                      {isDev ? 'Development' : 'Competitive'}
                    </span>
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {divisions.map((div) => (
                      <div key={div.slug} className="relative">
                        <Link
                          href={`/teams/${div.slug}`}
                          className="group flex min-h-[100px] flex-col border-2 border-brand-sky bg-brand-navy shadow-[4px_4px_0_#0B1F3B] transition-colors hover:border-brand-neon sm:min-h-[88px] sm:shadow-brutalist"
                        >
                          <div className={`h-1 w-full shrink-0 ${isDev ? 'bg-brand-sky/50' : 'bg-brand-neon'}`} />
                          <div className="flex flex-1 flex-col justify-between p-4 pr-14">
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
            <div className="mb-4 mt-7 flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="h-8 w-1 shrink-0 bg-brand-maroon" />
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
                  <h3 className="mb-3 mt-6 flex items-center gap-2 border-b border-brand-maroon/30 pb-2 font-display text-lg italic text-brand-charcoal">
                    {ageGroup}
                    <span className="rounded-full bg-brand-maroon px-2 py-1 font-sans text-xs font-bold not-italic text-white">
                      {isDev ? 'Development' : 'Competitive'}
                    </span>
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {divisions.map((div) => (
                      <div key={div.slug} className="relative">
                        <Link
                          href={`/teams/${div.slug}`}
                          className="group flex min-h-[100px] flex-col border-2 border-brand-maroon bg-brand-navy shadow-[4px_4px_0_#0B1F3B] transition-colors hover:border-brand-neon sm:min-h-[88px] sm:shadow-brutalist"
                        >
                          <div className={`h-1 w-full shrink-0 ${isDev ? 'bg-brand-maroon/40' : 'bg-brand-maroon'}`} />
                          <div className="flex flex-1 flex-col justify-between p-4 pr-14">
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
            <div className="mb-4 mt-7 flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="h-8 w-1 shrink-0 bg-brand-green" />
              <h2 className="font-display italic uppercase text-brand-charcoal text-2xl">
                Senior
              </h2>
              <span className="bg-brand-green text-white text-xs font-bold px-2 py-1 rounded-full">
                3 teams
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

              <div className="relative">
                <Link
                  href="/seniors/first-team"
                  className="group flex min-h-[112px] flex-col border-2 border-brand-green bg-brand-navy shadow-[4px_4px_0_#0B1F3B] transition-colors hover:border-brand-neon sm:min-h-[88px] sm:shadow-brutalist"
                >
                  <div className="h-1 w-full shrink-0 bg-brand-green" />
                  <div className="flex flex-1 flex-col justify-between p-4 pr-14">
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
                  className="group flex min-h-[112px] flex-col border-2 border-brand-green bg-brand-navy shadow-[4px_4px_0_#0B1F3B] transition-colors hover:border-brand-neon sm:min-h-[88px] sm:shadow-brutalist"
                >
                  <div className="h-1 w-full shrink-0 bg-brand-green" />
                  <div className="flex flex-1 flex-col justify-between p-4 pr-14">
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
                  className="group flex min-h-[112px] flex-col border-2 border-brand-green bg-brand-navy shadow-[4px_4px_0_#0B1F3B] transition-colors hover:border-brand-neon sm:min-h-[88px] sm:shadow-brutalist"
                >
                  <div className="h-1 w-full shrink-0 bg-brand-green" />
                  <div className="flex flex-1 flex-col justify-between p-4 pr-14">
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
            <div className="mb-4 mt-7 flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="h-8 w-1 shrink-0 bg-brand-neon" />
              <h2 className="font-display italic uppercase text-brand-charcoal text-2xl">
                Over 35s
              </h2>
              <span className="bg-brand-neon text-brand-charcoal text-xs font-bold px-2 py-1 rounded-full">
                {aflDivisions.length} teams
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {aflDivisions.map((division) => (
                <div key={division.id} className="relative">
                  <Link
                    href={`/seniors/over-35s/${division.id}`}
                    className="group flex min-h-[112px] flex-col border-2 border-brand-neon bg-brand-navy shadow-[4px_4px_0_#0B1F3B] transition-colors hover:border-brand-sky sm:min-h-[88px] sm:shadow-brutalist"
                  >
                    <div className="h-1 w-full shrink-0 bg-brand-neon" />
                    <div className="flex flex-1 flex-col justify-between p-4 pr-14">
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
