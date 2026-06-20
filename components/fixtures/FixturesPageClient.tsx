'use client';

import { useState } from 'react';
import Link from 'next/link';
import FixtureList from './FixtureList';
import SeniorFixtureList from './SeniorFixtureList';
import type { NormalisedMatch, LeagueTable } from '@/lib/ddsl/types';
import { KNOWN_DIVISIONS, competitionNameToSlug } from '@/config/ddsl-competitions';
import type { HistoricalStandingEntry } from '@/app/fixtures/page';

// ─── Types ────────────────────────────────────────────────────────────────────

type PrimaryFilter = 'all' | 'youth' | 'senior' | 'matchday';
type SecondaryFilter =
  | 'all-youth' | 'boys' | 'girls' | 'u8-u11' | 'u12-plus'
  | 'all-senior' | 'lsl' | 'afl' | 'fai'
  | 'upcoming' | 'results';

type SeniorFilterProp = 'all' | 'upcoming' | 'results' | 'lsl' | 'afl' | 'fai';

interface Props {
  fixtures:             NormalisedMatch[];
  results:              NormalisedMatch[];
  tables:               LeagueTable[];
  historicalStandings:  HistoricalStandingEntry[];
}

// ─── Pill configs ─────────────────────────────────────────────────────────────

const PRIMARY_PILLS: Array<{ key: PrimaryFilter; label: string }> = [
  { key: 'all',      label: 'All'      },
  { key: 'youth',    label: 'Youth'    },
  { key: 'senior',   label: 'Senior'   },
  { key: 'matchday', label: 'Matchday' },
];

const YOUTH_SECONDARY_PILLS: Array<{ key: SecondaryFilter; label: string }> = [
  { key: 'all-youth', label: 'All Youth' },
  { key: 'boys',      label: 'Boys' },
  { key: 'girls',     label: 'Girls' },
  { key: 'u8-u11',    label: 'U8–U11' },
  { key: 'u12-plus',  label: 'U12+' },
  { key: 'upcoming',  label: 'Upcoming' },
  { key: 'results',   label: 'Results' },
];

const SENIOR_SECONDARY_PILLS: Array<{ key: SecondaryFilter; label: string }> = [
  { key: 'all-senior', label: 'All Senior' },
  { key: 'lsl',        label: 'LSL' },
  { key: 'afl',        label: 'AFL' },
  { key: 'fai',        label: 'FAI Cups' },
  { key: 'upcoming',   label: 'Upcoming' },
  { key: 'results',    label: 'Results' },
];

// ─── Matchday division sets ───────────────────────────────────────────────────

const COMPETITIVE_AGES = new Set(['U12', 'U13', 'U14', 'U15', 'U17']);
const DEVELOPMENT_AGES = new Set(['U8', 'U9', 'U10', 'U11']);

const competitiveDivisions = KNOWN_DIVISIONS.filter((d) => COMPETITIVE_AGES.has(d.ageGroup));
const developmentDivisions = KNOWN_DIVISIONS.filter((d) => DEVELOPMENT_AGES.has(d.ageGroup));

// ─── Pill class helpers ───────────────────────────────────────────────────────

const PRIMARY_BASE = 'flex-1 min-h-[44px] flex items-center justify-center font-display font-black uppercase text-sm tracking-wide border-2 rounded-none transition-all';
const SECONDARY_BASE = 'min-h-[44px] min-w-[44px] px-4 flex items-center justify-center text-sm font-mono font-bold uppercase border-2 rounded-none transition-all whitespace-nowrap';

function primaryPillClass(key: PrimaryFilter, active: PrimaryFilter): string {
  if (key !== active) return `${PRIMARY_BASE} border-brand-navy/20 text-brand-navy/40 bg-transparent`;
  if (key === 'all')      return `${PRIMARY_BASE} bg-brand-navy text-brand-cream border-brand-navy`;
  if (key === 'youth')    return `${PRIMARY_BASE} bg-brand-sky text-brand-charcoal border-brand-sky`;
  if (key === 'matchday') return `${PRIMARY_BASE} bg-brand-neon text-brand-charcoal border-brand-neon`;
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

function stripDdsl(name: string): string {
  return name.replace(/^DDSL\s+/i, '');
}

function isRVR(name: string): boolean {
  return /rivervalley|river valley/i.test(name);
}

function ordinal(n: number): string {
  if (n % 100 >= 11 && n % 100 <= 13) return `${n}th`;
  switch (n % 10) {
    case 1: return `${n}st`;
    case 2: return `${n}nd`;
    case 3: return `${n}rd`;
    default: return `${n}th`;
  }
}

// ─── Matchday card ────────────────────────────────────────────────────────────

function MatchdayCard({
  competitionName,
  isCompetitive,
  latestResult,
  leaguePosition,
  totalTeams,
}: {
  competitionName: string;
  isCompetitive:   boolean;
  latestResult:    NormalisedMatch | undefined;
  leaguePosition:  number | undefined;
  totalTeams:      number;
}) {
  const slug = competitionNameToSlug(competitionName);

  return (
    <div className="bg-white border-2 border-brand-sky shadow-brutalist flex flex-col">
      {/* Top colour bar */}
      <div className={`h-1 w-full ${isCompetitive ? 'bg-brand-neon' : 'bg-brand-sky'}`} />

      <div className="p-4 flex flex-col gap-2 flex-1">
        {/* Division name */}
        <p className="font-display italic font-black text-base leading-tight text-brand-navy">
          {stripDdsl(competitionName)}
        </p>

        {/* Latest result */}
        {latestResult ? (
          <p className="text-sm leading-snug">
            <span className={isRVR(latestResult.homeTeam) ? 'font-bold text-brand-green' : 'text-brand-charcoal'}>
              {latestResult.homeTeam}
            </span>
            {latestResult.score && (
              <span className="mx-1.5 font-bold text-brand-neon">
                {latestResult.score.home}–{latestResult.score.away}
              </span>
            )}
            <span className={isRVR(latestResult.awayTeam) ? 'font-bold text-brand-green' : 'text-brand-charcoal'}>
              {latestResult.awayTeam}
            </span>
          </p>
        ) : (
          <p className="text-sm text-gray-400">No results yet this season</p>
        )}

        {/* League position (competitive only) */}
        {isCompetitive && leaguePosition !== undefined && totalTeams > 0 && (
          <p className="text-brand-sky text-sm">
            League position: {ordinal(leaguePosition)} of {totalTeams}
          </p>
        )}

        {/* View team link */}
        <div className="mt-auto pt-2">
          <Link
            href={`/teams/${slug}`}
            className="inline-block min-h-[44px] flex items-center text-sm font-semibold text-brand-neon hover:underline"
          >
            View team →
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Matchday view ────────────────────────────────────────────────────────────

function MatchdayView({
  results,
  tables,
  historicalStandings,
}: {
  results:             NormalisedMatch[];
  tables:              LeagueTable[];
  historicalStandings: HistoricalStandingEntry[];
}) {
  function resolvePosition(competitionName: string): { position: number | undefined; total: number } {
    // Prefer historicalStandings (full-season data from daily cron)
    const divRows = historicalStandings.filter((h) => h.divisionName === competitionName);
    if (divRows.length > 0) {
      const rvrRow = divRows.find((h) => isRVR(h.teamName));
      return { position: rvrRow?.position, total: divRows.length };
    }
    // Fall back to sync-cache tables
    const syncTable = tables.find((t) => t.competitionName === competitionName);
    if (syncTable) {
      const rvrRow = syncTable.rows.find((r) => r.isRvr);
      return { position: rvrRow?.position, total: syncTable.rows.length };
    }
    return { position: undefined, total: 0 };
  }

  function latestResultFor(competitionName: string): NormalisedMatch | undefined {
    return results
      .filter((m) => m.competition === competitionName && m.status === 'completed')
      .sort((a, b) => b.date.localeCompare(a.date))[0];
  }

  return (
    <div className="max-w-2xl mx-auto px-4 pb-12 space-y-10">

      {/* ── Competitive ───────────────────────────────────────────────────── */}
      <section>
        <div className="border-l-4 border-brand-neon pl-4 py-1 mb-4">
          <h2 className="font-display italic font-black uppercase text-xl text-brand-charcoal">
            Competitive
          </h2>
          <p className="text-zinc-400 text-xs font-mono uppercase tracking-wide">
            U12 – U17 · League standings
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {competitiveDivisions.map((div) => {
            const { position, total } = resolvePosition(div.competitionName);
            return (
              <MatchdayCard
                key={div.slug}
                competitionName={div.competitionName}
                isCompetitive
                latestResult={latestResultFor(div.competitionName)}
                leaguePosition={position}
                totalTeams={total}
              />
            );
          })}
        </div>
      </section>

      {/* ── Development ───────────────────────────────────────────────────── */}
      <section>
        <div className="border-l-4 border-brand-sky pl-4 py-1 mb-4">
          <h2 className="font-display italic font-black uppercase text-xl text-brand-charcoal">
            Development
          </h2>
          <p className="text-zinc-400 text-xs font-mono uppercase tracking-wide">
            U8 – U11 · No standings published
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {developmentDivisions.map((div) => (
            <MatchdayCard
              key={div.slug}
              competitionName={div.competitionName}
              isCompetitive={false}
              latestResult={latestResultFor(div.competitionName)}
              leaguePosition={undefined}
              totalTeams={0}
            />
          ))}
        </div>
      </section>

    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function FixturesPageClient({ fixtures, results, tables, historicalStandings }: Props) {
  const [primary,   setPrimary]   = useState<PrimaryFilter>('all');
  const [secondary, setSecondary] = useState<SecondaryFilter>('upcoming');

  function handlePrimaryChange(p: PrimaryFilter) {
    setPrimary(p);
    if (p === 'youth')  setSecondary('all-youth');
    if (p === 'senior') setSecondary('all-senior');
  }

  // ── Derived ──────────────────────────────────────────────────────────────

  let ddslFixtures: NormalisedMatch[] = fixtures;
  let ddslResults:  NormalisedMatch[] = results;

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

  const ddslEmpty    = ddslFixtures.length === 0 && ddslResults.length === 0;
  const showDdsl     = primary === 'all' || primary === 'youth';
  const showSenior   = primary === 'all' || primary === 'senior';
  const showMatchday = primary === 'matchday';
  const showDdslHdr  = primary === 'all';
  const showSnrHdr   = primary === 'all';
  const seniorFilter = getSeniorFilter(primary, secondary);

  const secondaryPills = primary === 'youth' ? YOUTH_SECONDARY_PILLS : SENIOR_SECONDARY_PILLS;

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <>
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
          {primary !== 'all' && primary !== 'matchday' && (
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

      {/* MATCHDAY view */}
      {showMatchday && (
        <MatchdayView
          results={results}
          tables={tables}
          historicalStandings={historicalStandings}
        />
      )}

      {/* DDSL Youth section */}
      {showDdsl && (
        <div className="max-w-2xl mx-auto px-4 pb-8">
          {showDdslHdr && (
            <>
              <h2 className="font-display font-black italic text-2xl text-brand-navy mb-1">
                Youth Teams
              </h2>
              <p className="text-zinc-500 text-xs font-mono uppercase tracking-wide mb-4">
                DDSL 2025/26 · U8 – U17
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
    </>
  );
}
