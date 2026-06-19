'use client';

import { useState } from 'react';
import type { AgeGroup, DivisionGroup } from './page';

// ─── Types ────────────────────────────────────────────────────────────────────

type FilterKey = 'All' | AgeGroup;

interface Props {
  divisions: DivisionGroup[];
}

// ─── Age group order for pill display ────────────────────────────────────────

const AGE_GROUP_DISPLAY: AgeGroup[] = ['U12', 'U13', 'U14', 'U15', 'U17'];

// ─── Component ───────────────────────────────────────────────────────────────

export default function LeagueTablesClient({ divisions }: Props) {
  const [active, setActive] = useState<FilterKey>('All');

  const availableGroups = AGE_GROUP_DISPLAY.filter((ag) =>
    divisions.some((d) => d.ageGroup === ag),
  );

  const displayed =
    active === 'All' ? divisions : divisions.filter((d) => d.ageGroup === active);

  return (
    <>
      {/* ── Filter bar ─────────────────────────────────────────────────────── */}
      <div className="sticky top-16 z-10 bg-brand-cream border-b-2 border-brand-sky py-3">
        <div
          className="max-w-2xl mx-auto px-4 flex gap-2 overflow-x-auto"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
        >
          {(['All', ...availableGroups] as FilterKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setActive(key)}
              className={`shrink-0 min-h-[44px] min-w-[44px] px-4 rounded-full text-sm font-mono font-bold uppercase tracking-wide transition-colors ${
                active === key
                  ? 'bg-brand-neon text-brand-charcoal font-bold'
                  : 'bg-brand-navy text-brand-cream border-2 border-brand-sky hover:border-brand-neon hover:text-brand-neon'
              }`}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {/* ── Division tables ────────────────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 pb-24">
        {displayed.map((division) => (
          <div
            key={division.divisionName}
            className="bg-brand-navy border-2 border-brand-navy shadow-brutalist overflow-hidden"
          >
            {/* Division heading */}
            <div className="px-4 py-3 border-b border-brand-sky/20">
              <h2 className="font-display italic font-black uppercase text-brand-neon text-lg leading-tight">
                {division.divisionName}
              </h2>
            </div>

            {/* Standings table */}
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
                <tr className="bg-brand-green text-brand-cream uppercase text-[10px] tracking-wide">
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
                {division.rows.map((row, i) => (
                  <tr
                    key={`${row.position}-${row.teamName}`}
                    className={
                      row.isRVR
                        ? 'bg-brand-green text-brand-cream font-bold border-l-4 border-brand-neon'
                        : i % 2 === 0
                        ? 'bg-brand-navy text-brand-cream'
                        : 'bg-[#0d2444] text-brand-cream'
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
                    <td className={`py-2.5 text-center font-bold ${row.isRVR ? '' : 'text-brand-neon'}`}>
                      {row.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </>
  );
}
