'use client';

import { useEffect, useState } from 'react';
import type { SeniorMatch, SeniorSyncResponse } from '@/lib/finalwhistle/types';

type Tab = 'Results' | 'Upcoming';

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`)
    .toLocaleDateString('en-IE', { weekday: 'short', day: 'numeric', month: 'short' })
    .toUpperCase();
}

function groupByCompetition(matches: SeniorMatch[]): [string, SeniorMatch[]][] {
  const map = new Map<string, SeniorMatch[]>();
  for (const m of matches) {
    const arr = map.get(m.competition) ?? [];
    arr.push(m);
    map.set(m.competition, arr);
  }
  for (const arr of map.values()) {
    arr.sort((a, b) => b.date.localeCompare(a.date));
  }
  return [...map.entries()].sort(([, a], [, b]) => {
    const latestA = a[0]?.date ?? '';
    const latestB = b[0]?.date ?? '';
    return latestB.localeCompare(latestA);
  });
}

interface Props {
  filter?: 'all' | 'upcoming' | 'results' | 'lsl' | 'afl' | 'fai';
}

export default function SeniorFixtureList({ filter }: Props) {
  const [allResults,  setAllResults]  = useState<SeniorMatch[]>([]);
  const [allFixtures, setAllFixtures] = useState<SeniorMatch[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [activeTab,   setActiveTab]   = useState<Tab>('Results');

  useEffect(() => {
    let active = true;
    fetch('/api/senior/sync', { cache: 'no-store' })
      .then((r) => {
        if (!r.ok) throw new Error('senior sync failed');
        return r.json() as Promise<SeniorSyncResponse>;
      })
      .then((data) => {
        if (!active) return;
        const today = new Date().toLocaleDateString('en-CA');
        setAllResults(
          data.results
            .filter((m) => m.status === 'Result' || m.status === 'Postponed')
            .sort((a, b) => b.date.localeCompare(a.date))
            .slice(0, 30),
        );
        setAllFixtures(
          data.fixtures
            .filter((m) => m.status === 'Fixture' && m.date >= today)
            .sort((a, b) => a.date.localeCompare(b.date))
            .slice(0, 10),
        );
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  // ── Loading ───────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div>
        <div className="flex min-h-11 items-center border-b border-brand-navy/10 bg-brand-cream px-3 py-2">
          <span className="inline-block h-3 w-32 animate-pulse bg-brand-navy/15" />
        </div>
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex min-h-11 items-center border-b border-brand-navy/10 bg-white px-3 py-2">
            <span className="inline-block h-3 w-48 animate-pulse bg-brand-navy/15" />
          </div>
        ))}
      </div>
    );
  }

  // ── Empty ─────────────────────────────────────────────────────────────────

  if (allResults.length === 0 && allFixtures.length === 0) {
    return (
      <div className="rounded-xl border-2 border-brand-navy/15 bg-brand-cream p-6 text-center">
        <p className="font-display font-bold text-brand-navy">No senior data available.</p>
      </div>
    );
  }

  // ── Content ───────────────────────────────────────────────────────────────

  const showTabs    = filter !== 'upcoming' && filter !== 'results';
  const effectiveTab: Tab =
    filter === 'upcoming' ? 'Upcoming' :
    filter === 'results'  ? 'Results'  :
    activeTab;

  function filterByCompetition(matches: SeniorMatch[]): SeniorMatch[] {
    if (filter === 'lsl') return matches.filter((m) => m.competition.toUpperCase().startsWith('LSL'));
    if (filter === 'afl') return matches.filter((m) => m.competition.toUpperCase().startsWith('AFL'));
    if (filter === 'fai') return matches.filter((m) => m.competition.toUpperCase().includes('FAI'));
    return matches;
  }

  const filteredResults  = filterByCompetition(allResults);
  const filteredFixtures = filterByCompetition(allFixtures);

  const resultGroups = groupByCompetition(filteredResults);

  return (
    <div>
      {/* Tabs — hidden when a filter prop forces the content */}
      {showTabs && (
        <div className="mb-4 flex border-b-2 border-brand-navy/10">
          {(['Results', 'Upcoming'] as Tab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex-1 min-h-[44px] py-3 font-display font-black uppercase text-sm tracking-wide transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? 'text-brand-navy border-brand-green'
                  : 'text-zinc-400 border-transparent hover:text-brand-navy'
              }`}
            >
              {tab}
              <span className="ml-1.5 text-xs font-bold opacity-60">
                ({tab === 'Results' ? filteredResults.length : filteredFixtures.length})
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Results tab */}
      {effectiveTab === 'Results' && (
        <div>
          {resultGroups.length === 0 ? (
            <div className="rounded-xl border-2 border-brand-navy/15 bg-brand-cream p-6 text-center">
              <p className="font-display font-bold text-brand-navy">No results yet.</p>
            </div>
          ) : (
            resultGroups.map(([competition, matches]) => (
              <div key={competition}>
                <h3 className="mb-2 mt-6 border-l-4 border-brand-neon pl-3 font-display text-base font-bold italic text-brand-navy">
                  {competition}
                </h3>
                {matches.map((m, i) => {
                  const opp = m.isRvrHome ? m.awayTeam : m.homeTeam;
                  return (
                    <div
                      key={m.matchId}
                      className={`flex min-h-11 items-center gap-2 border-b border-brand-navy/10 px-3 py-2 ${
                        i % 2 === 0 ? 'bg-brand-cream' : 'bg-white'
                      }`}
                    >
                      {/* H/A */}
                      <span
                        className={`w-5 text-[10px] font-bold shrink-0 ${
                          m.isRvrHome ? 'text-brand-green' : 'text-zinc-400'
                        }`}
                      >
                        {m.isRvrHome ? 'H' : 'A'}
                      </span>

                      {/* Opponent */}
                      <span className="min-w-0 flex-1 truncate text-xs text-brand-navy">
                        <span className="text-zinc-400">vs </span>
                        {opp}
                      </span>

                      {/* Score or PPD */}
                      <span
                        className={`shrink-0 w-12 text-right font-mono text-xs ${
                          m.status === 'Result' ? 'text-brand-green font-bold' : 'text-zinc-400 italic'
                        }`}
                      >
                        {m.status === 'Result' && m.score
                          ? `${m.score.home} – ${m.score.away}`
                          : m.status === 'Postponed'
                          ? 'PPD'
                          : ''}
                      </span>

                      {/* Date */}
                      <span className="w-16 shrink-0 text-right font-mono text-[10px] text-zinc-500">
                        {formatDate(m.date)}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
      )}

      {/* Upcoming tab */}
      {effectiveTab === 'Upcoming' && (
        <div>
          {filteredFixtures.length === 0 ? (
            <div className="rounded-xl border-2 border-brand-navy/15 bg-brand-cream p-6 text-center">
              <p className="font-display font-bold text-brand-navy">No upcoming senior fixtures.</p>
            </div>
          ) : (
            filteredFixtures.map((m, i) => {
              const opp = m.isRvrHome ? m.awayTeam : m.homeTeam;
              return (
                <div
                  key={m.matchId}
                  className={`flex min-h-11 items-center gap-2 border-b border-brand-navy/10 px-3 py-2 ${
                    i % 2 === 0 ? 'bg-brand-cream' : 'bg-white'
                  }`}
                >
                  {/* H/A */}
                  <span
                    className={`w-5 text-[10px] font-bold shrink-0 ${
                      m.isRvrHome ? 'text-brand-green' : 'text-zinc-400'
                    }`}
                  >
                    {m.isRvrHome ? 'H' : 'A'}
                  </span>

                  {/* Opponent */}
                  <span className="min-w-0 flex-1 truncate text-xs text-brand-navy">
                    <span className="text-zinc-400">vs </span>
                    {opp}
                  </span>

                  {/* Time */}
                  <span className="w-10 shrink-0 text-right font-mono text-[10px] text-zinc-400">
                    TBC
                  </span>

                  {/* Date */}
                  <span className="w-16 shrink-0 text-right font-mono text-[10px] text-brand-green">
                    {formatDate(m.date)}
                  </span>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Attribution */}
      <div className="mt-3 text-right text-[10px] font-mono">
        <a
          href="https://www.finalwhistle.ie/soccer/team/rivervalley-rangers-afc/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center uppercase tracking-wide text-zinc-400 transition-colors hover:text-brand-navy"
        >
          Powered by FinalWhistle.ie
        </a>
      </div>
    </div>
  );
}
