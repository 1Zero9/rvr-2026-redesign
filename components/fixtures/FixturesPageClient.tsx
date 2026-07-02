'use client';

import { useState } from 'react';
import FixtureList from './FixtureList';
import SeniorFixtureList from './SeniorFixtureList';
import Over35sFixtureList from './Over35sFixtureList';
import { CLUB_SEASON } from '@/config/club-season';
import type { NormalisedMatch, LeagueTable } from '@/lib/ddsl/types';
import type { HistoricalStandingEntry } from '@/app/fixtures/page';
import { useFavourites } from '@/lib/favourites/context';
import { KNOWN_DIVISIONS } from '@/config/ddsl-competitions';

// ─── Types ────────────────────────────────────────────────────────────────────

type PrimaryFilter = 'all' | 'youth' | 'senior' | 'over35s';
type SecondaryFilter =
  | 'all-youth' | 'boys' | 'girls' | 'u8-u11' | 'u12-plus'
  | 'all-senior' | 'lsl' | 'afl' | 'fai'
  | 'upcoming' | 'results';

type SeniorFilterProp = 'all' | 'upcoming' | 'results' | 'lsl' | 'afl' | 'fai';

interface Props {
  fixtures:            NormalisedMatch[];
  results:             NormalisedMatch[];
  tables:              LeagueTable[];
  historicalStandings: HistoricalStandingEntry[];
}

// ─── Pill configs ─────────────────────────────────────────────────────────────

const PRIMARY_PILLS: Array<{ key: PrimaryFilter; label: string }> = [
  { key: 'all',     label: 'All'      },
  { key: 'youth',   label: 'Youth'    },
  { key: 'senior',  label: 'Senior'   },
  { key: 'over35s', label: 'Over 35s' },
];

const YOUTH_SECONDARY_PILLS: Array<{ key: SecondaryFilter; label: string }> = [
  { key: 'all-youth', label: 'All Youth' },
  { key: 'boys',      label: 'Boys'      },
  { key: 'girls',     label: 'Girls'     },
  { key: 'u8-u11',    label: 'U8–U11'   },
  { key: 'u12-plus',  label: 'U12+'      },
  { key: 'upcoming',  label: 'Upcoming'  },
  { key: 'results',   label: 'Results'   },
];

const SENIOR_SECONDARY_PILLS: Array<{ key: SecondaryFilter; label: string }> = [
  { key: 'all-senior', label: 'All Senior' },
  { key: 'lsl',        label: 'LSL'        },
  { key: 'afl',        label: 'AFL'        },
  { key: 'fai',        label: 'FAI Cups'   },
  { key: 'upcoming',   label: 'Upcoming'   },
  { key: 'results',    label: 'Results'    },
];

// ─── Pill class helpers ───────────────────────────────────────────────────────

const PRIMARY_BASE   = 'flex-1 min-h-[44px] flex items-center justify-center font-display font-black uppercase text-sm tracking-wide border-2 rounded-none transition-all';
const SECONDARY_BASE = 'min-h-[44px] min-w-[44px] px-4 flex items-center justify-center text-sm font-mono font-bold uppercase border-2 rounded-none transition-all whitespace-nowrap';

function primaryPillClass(key: PrimaryFilter, active: PrimaryFilter): string {
  if (key !== active) return `${PRIMARY_BASE} border-brand-navy/20 text-brand-navy/40 bg-transparent`;
  if (key === 'all')     return `${PRIMARY_BASE} bg-brand-navy text-brand-cream border-brand-navy`;
  if (key === 'youth')   return `${PRIMARY_BASE} bg-brand-sky text-brand-charcoal border-brand-sky`;
  if (key === 'over35s') return `${PRIMARY_BASE} bg-brand-neon text-brand-charcoal border-brand-neon`;
  return `${PRIMARY_BASE} bg-brand-green text-white border-brand-green`; // senior
}

function secondaryPillClass(
  key: SecondaryFilter,
  active: SecondaryFilter,
  primary: PrimaryFilter,
): string {
  const isActive = key === active;
  if (primary === 'senior') {
    return `${SECONDARY_BASE} ${isActive
      ? 'bg-brand-green text-white border-brand-green'
      : 'border-brand-green/30 text-brand-green/60 bg-transparent'}`;
  }
  return `${SECONDARY_BASE} ${isActive
    ? 'bg-brand-sky text-brand-charcoal border-brand-sky'
    : 'border-brand-sky/30 text-brand-sky/60 bg-transparent'}`;
}

// ─── Filtering helpers ────────────────────────────────────────────────────────

function ageFromAgeGroup(ageGroup: string): number {
  const m = ageGroup.match(/U(\d+)/i);
  return m ? parseInt(m[1], 10) : 99;
}

function filterDDSLMatches(arr: NormalisedMatch[], secondary: SecondaryFilter): NormalisedMatch[] {
  switch (secondary) {
    case 'boys':     return arr.filter((m) => !m.competition.includes('Girls'));
    case 'girls':    return arr.filter((m) => m.competition.includes('Girls'));
    case 'u8-u11':   return arr.filter((m) => ageFromAgeGroup(m.ageGroup) <= 11);
    case 'u12-plus': return arr.filter((m) => ageFromAgeGroup(m.ageGroup) >= 12);
    default:         return arr;
  }
}

function getSeniorFilter(p: PrimaryFilter, s: SecondaryFilter): SeniorFilterProp | undefined {
  if (p !== 'senior') return undefined;
  if (s === 'all-senior') return 'all';
  if (s === 'lsl' || s === 'afl' || s === 'fai') return s;
  if (s === 'upcoming' || s === 'results') return s;
  return undefined;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function FixturesPageClient({ fixtures, results }: Props) {
  const [primary,   setPrimary]   = useState<PrimaryFilter>('all');
  const [secondary, setSecondary] = useState<SecondaryFilter>('upcoming');
  const { favourites, clear } = useFavourites();
  const isFavFiltered = favourites.length > 0;

  function handlePrimaryChange(p: PrimaryFilter) {
    setPrimary(p);
    if (p === 'youth')   setSecondary('all-youth');
    if (p === 'senior')  setSecondary('all-senior');
    if (p === 'over35s') setSecondary('all-youth'); // secondary unused for over35s
  }

  // ── Derived ──────────────────────────────────────────────────────────────

  function matchesFavourite(m: NormalisedMatch): boolean {
    const division = KNOWN_DIVISIONS.find((d) => d.competitionName === m.competition);
    return division ? favourites.includes(division.slug) : false;
  }

  const baseFixtures = isFavFiltered ? fixtures.filter(matchesFavourite) : fixtures;
  const baseResults  = isFavFiltered ? results.filter(matchesFavourite)  : results;

  let ddslFixtures: NormalisedMatch[] = baseFixtures;
  let ddslResults:  NormalisedMatch[] = baseResults;

  if (primary === 'youth') {
    if (secondary === 'upcoming') {
      ddslResults  = [];
    } else if (secondary === 'results') {
      ddslFixtures = [];
    } else {
      ddslFixtures = filterDDSLMatches(fixtures, secondary);
      ddslResults  = filterDDSLMatches(results,  secondary);
    }
  }

  const ddslEmpty   = ddslFixtures.length === 0 && ddslResults.length === 0;
  const showDdsl    = primary === 'all' || primary === 'youth';
  const showSenior  = (primary === 'all' || primary === 'senior') &&
    (!isFavFiltered || favourites.includes('first-team'));
  const showOver35s = primary === 'all' || primary === 'over35s';
  const showDdslHdr = primary === 'all';
  const showSnrHdr  = primary === 'all';
  const seniorFilter = getSeniorFilter(primary, secondary);

  const secondaryPills = primary === 'youth' ? YOUTH_SECONDARY_PILLS : SENIOR_SECONDARY_PILLS;

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      {/* Favourites banner */}
      {isFavFiltered && (
        <div className="mx-auto mt-6 flex max-w-4xl items-center justify-between border-2 border-brand-navy bg-white px-4 py-2 shadow-[3px_3px_0_#0B1F3B]">
          <span className="text-xs font-bold uppercase tracking-wide text-brand-green">
            ★ Showing your teams
          </span>
          <button
            type="button"
            onClick={clear}
            className="min-h-11 px-2 text-xs font-bold text-brand-navy underline"
          >
            Show all · Reset
          </button>
        </div>
      )}

      {/* Sticky two-row filter bar */}
      <div className="sticky top-16 z-10 border-y-2 border-brand-navy/10 bg-brand-cream/95 py-3 backdrop-blur-md">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">

          {/* Row 1 — Primary pills */}
          <div className="flex gap-2 w-full">
            {PRIMARY_PILLS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => handlePrimaryChange(key)}
                className={primaryPillClass(key, primary)}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Row 2 — Secondary pills (youth and senior only) */}
          {primary !== 'all' && primary !== 'over35s' && (
            <div className="mt-2 flex flex-wrap gap-2">
              {secondaryPills.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSecondary(key)}
                  className={secondaryPillClass(key, secondary, primary)}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* DDSL Youth section */}
      {showDdsl && (
        <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
          {showDdslHdr && (
            <>
              <h2 className="font-display font-black italic text-2xl text-brand-navy mb-1">
                Youth Teams
              </h2>
              <p className="text-zinc-500 text-xs font-mono uppercase tracking-wide mb-4">
                DDSL {CLUB_SEASON.currentSeason} · U8 – U15
              </p>
            </>
          )}

          {ddslEmpty ? (
            <div className="site-surface p-6 text-center">
              <p className="font-display font-bold text-brand-navy">No fixtures in this category.</p>
            </div>
          ) : (
            <FixtureList fixtures={ddslFixtures} results={ddslResults} />
          )}
        </section>
      )}

      {showSenior && (
        <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
          <div className="site-surface p-5 sm:p-7">
            {showSnrHdr && (
              <div className="mb-6">
                <h2 className="site-section-heading text-2xl sm:text-3xl">
                  Senior Teams
                </h2>
                <p className="mt-1 font-mono text-sm uppercase tracking-wide text-zinc-500">
                  LSL · AFL · FAI Cups
                </p>
              </div>
            )}
            <SeniorFixtureList filter={seniorFilter} />
          </div>
        </section>
      )}

      {/* Over 35s section */}
      {showOver35s && (
        <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
          <div className="site-surface p-5 sm:p-7">
            {primary === 'all' && (
              <div className="mb-6">
                <h2 className="site-section-heading text-2xl sm:text-3xl">
                  Over 35s
                </h2>
                <p className="mt-1 font-mono text-sm uppercase tracking-wide text-zinc-500">
                  AFL · {CLUB_SEASON.currentSeason}
                </p>
              </div>
            )}
            <Over35sFixtureList />
          </div>
        </section>
      )}
    </>
  );
}
