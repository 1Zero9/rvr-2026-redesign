'use client';

import { useEffect, useState } from 'react';
import type { AflDivision } from '@/config/afl-competitions';
import type { AflStandingsTable } from '@/lib/afl/scraper';

interface DivisionResult {
  division: AflDivision;
  table: AflStandingsTable | null;
}

function isRVR(name: string): boolean {
  return /rivervalley/i.test(name);
}

export default function Over35sFixtureList() {
  const [data,    setData]    = useState<DivisionResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/over35s/standings')
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-2">
        {[0, 1].map((i) => (
          <div key={i} className="h-12 w-full animate-pulse rounded-lg bg-brand-navy/10" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-xl border-2 border-brand-navy/15 bg-brand-cream p-6 text-center">
        <p className="font-display font-bold text-brand-navy">
          No Over 35s data available.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {data.map(({ division, table }) => (
        <div key={division.id}>
          <h3 className="mb-3 border-l-4 border-brand-neon pl-3 font-display text-base font-bold italic text-brand-navy">
            {division.competitionName}
          </h3>
          {!table ? (
            <p className="text-sm text-zinc-500">
              Standings unavailable — check back soon.
            </p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full table-fixed text-xs">
                  <colgroup>
                    <col style={{ width: '2rem' }} />
                    <col />
                    <col style={{ width: '2rem' }} />
                    <col style={{ width: '2rem' }} />
                    <col style={{ width: '2rem' }} />
                    <col style={{ width: '2rem' }} />
                    <col style={{ width: '2.5rem' }} />
                  </colgroup>
                  <thead>
                    <tr className="bg-brand-navy text-brand-neon uppercase text-[10px] tracking-wide">
                      <th className="py-2 text-center font-bold">#</th>
                      <th className="py-2 pl-2 text-left font-bold">Team</th>
                      <th className="py-2 text-center font-bold">P</th>
                      <th className="py-2 text-center font-bold">W</th>
                      <th className="py-2 text-center font-bold">D</th>
                      <th className="py-2 text-center font-bold">L</th>
                      <th className="py-2 text-center font-bold">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.standings.map((row, i) => {
                      const rvr = isRVR(row.teamName);
                      return (
                        <tr
                          key={row.position}
                          className={
                            rvr
                              ? 'bg-brand-neon text-brand-charcoal font-bold border-l-4 border-brand-navy'
                              : i % 2 === 0
                              ? 'bg-brand-cream text-brand-navy'
                              : 'bg-white text-brand-navy'
                          }
                        >
                          <td className="py-2.5 text-center">{row.position}</td>
                          <td className="py-2.5 pl-2 pr-1 whitespace-normal break-words">
                            {row.teamName}
                          </td>
                          <td className="py-2.5 text-center">{row.played}</td>
                          <td className="py-2.5 text-center">{row.won}</td>
                          <td className="py-2.5 text-center">{row.drawn}</td>
                          <td className="py-2.5 text-center">{row.lost}</td>
                          <td className={`py-2.5 text-center font-bold ${rvr ? '' : 'text-brand-green'}`}>
                            {row.points}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-right font-mono text-[10px] uppercase tracking-wide text-zinc-400">
                Data from Amateur Football League
              </p>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
