'use client';

import { useState } from 'react';
import FixtureList from './FixtureList';
import SeniorFixtureList from './SeniorFixtureList';
import Over35sFixtureList from './Over35sFixtureList';
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
        <div className="flex items-center justify-between px-4 py-2 bg-brand-neon/10 border-b border-brand-neon/30">
          <span className="text-brand-neon text-xs font-bold uppercase tracking-wide">
            ★ Showing your teams
          </span>
          <button
            type="button"
            onClick={clear}
            className="text-brand-sky text-xs underline min-h-[44px] px-2"
          >
            Show all · Reset
          </button>
        </div>
      )}

      {/* Sticky two-row filter bar */}
      <div className="sticky top-0 z-10 bg-brand-cream border-b-2 border-brand-navy/10 pt-3 pb-3 mb-6">
        <div className="max-w-2xl mx-auto px-4">

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
        <div className="max-w-2xl mx-auto px-4 pb-8">
          {showDdslHdr && (
            <>
              <h2 className="font-display font-black italic text-2xl text-brand-navy mb-1">
                Youth Teams
              </h2>
              <p className="text-zinc-500 text-xs font-mono uppercase tracking-wide mb-4">
                DDSL 2025/26 · U8 – U15
              </p>
            </>
          )}

          {ddslEmpty ? (
            <div className="bg-brand-navy border border-brand-sky/20 p-6 text-center rounded-none">
              <p className="text-brand-sky font-display font-bold">No fixtures in this category.</p>
            </div>
          ) : (
            <FixtureList fixtures={ddslFixtures} results={ddslResults} />
          )}
        </div>
      )}

      {/* Senior section — full viewport width */}
      {showSenior && (
        <section className="bg-brand-charcoal border-t-4 border-brand-neon">
          <div className="max-w-2xl mx-auto px-4 py-8">
            {showSnrHdr && (
              <div className="mb-6">
                <h2 className="font-display font-black italic text-3xl lg:text-4xl text-brand-cream">
                  Senior Teams
                </h2>
                <p className="text-brand-sky/60 text-sm font-mono mt-1 uppercase tracking-wide">
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
        <section className="bg-brand-navy border-t-4 border-brand-neon">
          <div className="max-w-2xl mx-auto px-4 py-8">
            {primary === 'all' && (
              <div className="mb-6">
                <h2 className="font-display font-black italic text-3xl lg:text-4xl text-brand-neon">
                  Over 35s
                </h2>
                <p className="text-brand-sky/60 text-sm font-mono mt-1 uppercase tracking-wide">
                  AFL · 2025/26
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
