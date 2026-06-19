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
        setAllResults(
          data.results
            .filter((m) => m.status === 'Result' || m.status === 'Postponed')
            .sort((a, b) => b.date.localeCompare(a.date))
            .slice(0, 30),
        );
        setAllFixtures(
          data.fixtures
            .filter((m) => m.status === 'Fixture')
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
        <div className="bg-black border-b border-brand-sky/20 px-3 py-2 min-h-[44px] flex items-center">
          <span className="animate-pulse w-32 h-3 bg-brand-sky/30 inline-block" />
        </div>
        {[0, 1, 2].map((i) => (
          <div key={i} className="bg-black border-b border-brand-sky/20 px-3 py-2 min-h-[44px] flex items-center">
            <span className="animate-pulse w-48 h-3 bg-brand-sky/30 inline-block" />
          </div>
        ))}
      </div>
    );
  }

  // ── Empty ─────────────────────────────────────────────────────────────────

  if (allResults.length === 0 && allFixtures.length === 0) {
    return (
      <div className="bg-brand-navy border border-brand-sky/20 p-6 text-center">
        <p className="text-brand-sky font-display font-bold">No senior data available.</p>
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
        <div className="flex border-b-2 border-brand-sky/20 mb-4">
          {(['Results', 'Upcoming'] as Tab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex-1 min-h-[44px] py-3 font-display font-black uppercase text-sm tracking-wide transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? 'text-white border-brand-neon'
                  : 'text-zinc-400 border-transparent'
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
            <div className="bg-brand-navy border border-brand-sky/20 p-6 text-center">
              <p className="text-brand-sky font-display font-bold">No results yet.</p>
            </div>
          ) : (
            resultGroups.map(([competition, matches]) => (
              <div key={competition}>
                <h3 className="border-l-4 border-brand-neon pl-3 mt-6 mb-2 text-white font-display font-bold italic text-base">
                  {competition}
                </h3>
                {matches.map((m, i) => {
                  const opp = m.isRvrHome ? m.awayTeam : m.homeTeam;
                  return (
                    <div
                      key={m.matchId}
                      className={`px-3 py-2 flex items-center gap-2 min-h-[44px] border-b border-brand-sky/20 ${
                        i % 2 === 0 ? 'bg-black' : 'bg-brand-navy/40'
                      }`}
                    >
                      {/* H/A */}
                      <span
                        className={`w-5 text-[10px] font-bold shrink-0 ${
                          m.isRvrHome ? 'text-brand-neon' : 'text-brand-sky/60'
                        }`}
                      >
                        {m.isRvrHome ? 'H' : 'A'}
                      </span>

                      {/* Opponent */}
                      <span className="flex-1 text-white text-xs truncate min-w-0">
                        <span className="text-brand-sky/50">vs </span>
                        {opp}
                      </span>

                      {/* Score or PPD */}
                      <span
                        className={`shrink-0 w-12 text-right font-mono text-xs ${
                          m.status === 'Result' ? 'text-brand-neon font-bold' : 'text-brand-sky/50 italic'
                        }`}
                      >
                        {m.status === 'Result' && m.score
                          ? `${m.score.home} – ${m.score.away}`
                          : m.status === 'Postponed'
                          ? 'PPD'
                          : ''}
                      </span>

                      {/* Date */}
                      <span className="shrink-0 w-16 text-right text-[10px] font-mono text-brand-sky/70">
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
            <div className="bg-brand-navy border border-brand-sky/20 p-6 text-center">
              <p className="text-brand-sky font-display font-bold">No upcoming senior fixtures.</p>
            </div>
          ) : (
            filteredFixtures.map((m, i) => {
              const opp = m.isRvrHome ? m.awayTeam : m.homeTeam;
              return (
                <div
                  key={m.matchId}
                  className={`px-3 py-2 flex items-center gap-2 min-h-[44px] border-b border-brand-sky/20 ${
                    i % 2 === 0 ? 'bg-black' : 'bg-brand-navy/40'
                  }`}
                >
                  {/* H/A */}
                  <span
                    className={`w-5 text-[10px] font-bold shrink-0 ${
                      m.isRvrHome ? 'text-brand-neon' : 'text-brand-sky/60'
                    }`}
                  >
                    {m.isRvrHome ? 'H' : 'A'}
                  </span>

                  {/* Opponent */}
                  <span className="flex-1 text-white text-xs truncate min-w-0">
                    <span className="text-brand-sky/50">vs </span>
                    {opp}
                  </span>

                  {/* Time */}
                  <span className="text-brand-sky/50 text-[10px] shrink-0 w-10 text-right font-mono">
                    TBC
                  </span>

                  {/* Date */}
                  <span className="shrink-0 w-16 text-right text-[10px] font-mono text-brand-neon">
                    {formatDate(m.date)}
                  </span>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Attribution */}
      <div className="text-right mt-3 text-[10px] font-mono">
        <a
          href="https://www.finalwhistle.ie/soccer/team/rivervalley-rangers-afc/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-sky/30 hover:text-brand-sky transition-colors uppercase tracking-wide"
        >
          Powered by FinalWhistle.ie
        </a>
      </div>
    </div>
  );
}
