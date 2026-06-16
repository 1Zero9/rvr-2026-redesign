'use client';

import { Fragment, useState } from 'react';
import { ChevronDown, ShieldCheck } from 'lucide-react';
import type { LeagueTable } from '@/lib/ddsl/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type FormResult = 'W' | 'D' | 'L';

interface DDSLTableWidgetProps {
  table: LeagueTable;
  /**
   * Optional last-5 match form keyed by exact team name string.
   * Each array is ordered most-recent first: ['W', 'D', 'L', 'W', 'W'].
   * When absent for a team the form strip shows a "not available" notice.
   */
  form?: Record<string, FormResult[]>;
  /** Hex accent colour used for RVR highlights. Defaults to brand neon green. */
  accent?: string;
}

// Converts a 6-digit hex colour to an rgba() string for inline style opacity variants.
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

const DEFAULT_ACCENT = '#85E320';

// Total number of <th>/<td> columns in the table (including mobile-only chevron
// and desktop-only stat columns). The accordion <td> uses this as its colSpan
// so it always stretches the full row width regardless of which columns are
// currently visible.
const TOTAL_COLS = 11;

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function FormBadge({ result, accent }: { result: FormResult; accent: string }) {
  const label = result === 'W' ? 'Win' : result === 'D' ? 'Draw' : 'Loss';
  if (result === 'W') {
    return (
      <span
        aria-label={label}
        title={label}
        className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-display text-xs font-black text-brand-charcoal"
        style={{ backgroundColor: accent }}
      >
        {result}
      </span>
    );
  }
  const cls: Record<'D' | 'L', string> = {
    D: 'bg-brand-sky/60 text-brand-navy',
    L: 'bg-brand-maroon text-white',
  };
  return (
    <span
      aria-label={label}
      title={label}
      className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-display text-xs font-black ${cls[result]}`}
    >
      {result}
    </span>
  );
}

function GDCell({ value }: { value: number }) {
  if (value > 0) {
    return <span className="font-black text-brand-green">+{value}</span>;
  }
  if (value < 0) {
    return <span className="font-black text-brand-maroon">{value}</span>;
  }
  return <span className="text-zinc-400">0</span>;
}

// ---------------------------------------------------------------------------
// Main widget
// ---------------------------------------------------------------------------

export default function DDSLTableWidget({ table, form, accent = DEFAULT_ACCENT }: DDSLTableWidgetProps) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  function toggleRow(position: number) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(position)) {
        next.delete(position);
      } else {
        next.add(position);
      }
      return next;
    });
  }

  // ---------------------------------------------------------------------------
  // Empty state
  // ---------------------------------------------------------------------------

  if (table.rows.length === 0) {
    return (
      <div className="overflow-hidden rounded-2xl border-4 border-brand-navy bg-white shadow-brutalist">
        <div className="border-b-4 border-brand-navy bg-brand-navy px-5 py-4">
          <p className="font-display text-xs font-black uppercase tracking-wider" style={{ color: accent }}>
            DDSL League Table
          </p>
          <h3 className="mt-0.5 font-display text-lg font-black uppercase leading-tight text-white">
            {table.competitionName}
          </h3>
        </div>
        <div className="px-5 py-10 text-center">
          <p className="font-display text-base font-black uppercase text-brand-navy">
            No standings available yet
          </p>
          <p className="mt-2 text-sm font-semibold text-zinc-500">
            {table.season} season data will appear here once matches have been played.
          </p>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Full table
  // ---------------------------------------------------------------------------

  return (
    <div className="overflow-hidden rounded-2xl border-4 border-brand-navy bg-white shadow-brutalist">

      {/* ── Widget header ──────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2 border-b-4 border-brand-navy bg-brand-navy px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="font-display text-xs font-black uppercase tracking-wider" style={{ color: accent }}>
            DDSL League Table
          </p>
          <h3 className="mt-0.5 font-display text-lg font-black uppercase leading-tight text-white sm:text-xl">
            {table.competitionName}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border-2 border-brand-sky/40 px-3 py-1 font-display text-xs font-black uppercase text-brand-sky">
            {table.season}
          </span>
          <span
            className="flex items-center gap-1 rounded-full px-3 py-1 font-display text-xs font-black uppercase"
            style={{ backgroundColor: hexToRgba(accent, 0.2), color: accent }}
          >
            <ShieldCheck className="h-3 w-3" aria-hidden="true" />
            DDSL
          </span>
        </div>
      </div>

      {/* ── Scrollable table wrapper ───────────────────────────────────────── */}
      {/* overflow-x-auto prevents horizontal clipping on very narrow viewports */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[300px] border-collapse text-sm">

          {/* ── Column headers ──────────────────────────────────────────────── */}
          <thead>
            <tr className="border-b-2 border-brand-navy/15 bg-brand-cream">

              {/* # */}
              <th
                scope="col"
                className="w-10 py-3 pl-4 pr-2 text-center font-display text-xs font-black uppercase text-brand-navy sm:pl-6"
              >
                #
              </th>

              {/* Team */}
              <th
                scope="col"
                className="py-3 pr-4 text-left font-display text-xs font-black uppercase text-brand-navy"
              >
                Team
              </th>

              {/* P — always visible */}
              <th
                scope="col"
                className="w-10 px-2 py-3 text-center font-display text-xs font-black uppercase text-brand-navy"
                title="Matches played"
              >
                P
              </th>

              {/* W — desktop only */}
              <th
                scope="col"
                className="hidden w-10 px-2 py-3 text-center font-display text-xs font-black uppercase text-brand-navy md:table-cell"
                title="Wins"
              >
                W
              </th>

              {/* D — desktop only */}
              <th
                scope="col"
                className="hidden w-10 px-2 py-3 text-center font-display text-xs font-black uppercase text-brand-navy md:table-cell"
                title="Draws"
              >
                D
              </th>

              {/* L — desktop only */}
              <th
                scope="col"
                className="hidden w-10 px-2 py-3 text-center font-display text-xs font-black uppercase text-brand-navy md:table-cell"
                title="Losses"
              >
                L
              </th>

              {/* GF — desktop only */}
              <th
                scope="col"
                className="hidden w-10 px-2 py-3 text-center font-display text-xs font-black uppercase text-brand-navy md:table-cell"
                title="Goals scored"
              >
                GF
              </th>

              {/* GA — desktop only */}
              <th
                scope="col"
                className="hidden w-10 px-2 py-3 text-center font-display text-xs font-black uppercase text-brand-navy md:table-cell"
                title="Goals conceded"
              >
                GA
              </th>

              {/* GD — desktop only */}
              <th
                scope="col"
                className="hidden w-12 px-2 py-3 text-center font-display text-xs font-black uppercase text-brand-navy md:table-cell"
                title="Goal difference"
              >
                GD
              </th>

              {/* PTS — always visible */}
              <th
                scope="col"
                className="w-12 py-3 pl-2 pr-4 text-center font-display text-xs font-black uppercase text-brand-navy sm:pr-6"
                title="Points"
              >
                PTS
              </th>

              {/* Expand-row toggle header — mobile only */}
              <th
                scope="col"
                className="w-8 py-3 pr-3 md:hidden"
                aria-label="Expand row"
              >
                <span className="sr-only">Row details</span>
              </th>

            </tr>
          </thead>

          {/* ── Data rows ───────────────────────────────────────────────────── */}
          <tbody>
            {table.rows.map((row, index) => {
              const open = expanded.has(row.position);
              const teamForm = form?.[row.teamName];
              const isAlternate = index % 2 === 1;

              // RVR row gets a left accent border and tinted background
              const rvrRowStyle = row.isRvr
                ? { borderLeftColor: accent, backgroundColor: hexToRgba(accent, 0.1) }
                : undefined;
              const rowBase = row.isRvr
                ? 'border-l-4'
                : isAlternate
                ? 'border-l-4 border-transparent bg-brand-cream/50'
                : 'border-l-4 border-transparent bg-white';

              return (
                <Fragment key={row.position}>

                  {/* ── Primary data row ──────────────────────────────────── */}
                  <tr
                    onClick={() => toggleRow(row.position)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleRow(row.position);
                      }
                    }}
                    aria-expanded={open}
                    aria-label={`${row.teamName} — tap to ${open ? 'collapse' : 'expand'} match details`}
                    className={`cursor-pointer border-b border-brand-navy/10 transition-colors md:cursor-auto ${rowBase}`}
                    style={rvrRowStyle}
                  >

                    {/* Position */}
                    <td className="py-3 pl-4 pr-2 text-center sm:pl-6">
                      <span
                        className="font-display text-sm font-black"
                        style={row.isRvr ? { color: accent } : undefined}
                      >
                        {row.position}
                      </span>
                    </td>

                    {/* Team name */}
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`leading-tight ${row.isRvr ? 'font-black' : 'font-semibold text-brand-navy'}`}
                          style={row.isRvr ? { color: accent } : undefined}
                        >
                          {row.teamName}
                        </span>
                        {row.isRvr && (
                          <span
                            className="shrink-0 rounded border-2 px-1.5 py-0.5 font-display text-[10px] font-black uppercase leading-none text-brand-charcoal"
                            style={{ backgroundColor: accent, borderColor: accent }}
                          >
                            RVR
                          </span>
                        )}
                      </div>
                    </td>

                    {/* P */}
                    <td className="px-2 py-3 text-center font-semibold text-brand-navy">
                      {row.played}
                    </td>

                    {/* W — desktop only */}
                    <td className="hidden px-2 py-3 text-center font-semibold text-brand-navy md:table-cell">
                      {row.won}
                    </td>

                    {/* D — desktop only */}
                    <td className="hidden px-2 py-3 text-center font-semibold text-brand-navy md:table-cell">
                      {row.drawn}
                    </td>

                    {/* L — desktop only */}
                    <td className="hidden px-2 py-3 text-center font-semibold text-brand-navy md:table-cell">
                      {row.lost}
                    </td>

                    {/* GF — desktop only */}
                    <td className="hidden px-2 py-3 text-center font-semibold text-brand-navy md:table-cell">
                      {row.goalsFor}
                    </td>

                    {/* GA — desktop only */}
                    <td className="hidden px-2 py-3 text-center font-semibold text-brand-navy md:table-cell">
                      {row.goalsAgainst}
                    </td>

                    {/* GD — desktop only */}
                    <td className="hidden px-2 py-3 text-center md:table-cell">
                      <GDCell value={row.goalDifference} />
                    </td>

                    {/* PTS */}
                    <td className="py-3 pl-2 pr-4 text-center sm:pr-6">
                      <span
                        className="font-display text-sm font-black"
                        style={row.isRvr ? { color: accent } : { color: '#0B1F3B' }}
                      >
                        {row.points}
                      </span>
                    </td>

                    {/* Chevron — mobile only */}
                    <td className="py-3 pr-3 md:hidden" aria-hidden="true">
                      <ChevronDown
                        className={`ml-auto h-4 w-4 text-brand-navy/40 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                      />
                    </td>

                  </tr>

                  {/* ── Accordion drawer — mobile only ────────────────────── */}
                  <tr className="md:hidden">
                    <td colSpan={TOTAL_COLS} className="p-0">
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          open ? 'max-h-56 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                        aria-hidden={!open}
                        inert={!open ? ('' as unknown as boolean) : undefined}
                      >
                        <div
                          className="border-b-2 border-brand-navy/10 px-4 py-4"
                          style={row.isRvr ? { backgroundColor: hexToRgba(accent, 0.08) } : { backgroundColor: 'rgba(11,31,59,0.05)' }}
                        >

                          {/* Expanded stat tiles: W / D / L / GD */}
                          <div className="mb-4 grid grid-cols-4 gap-2">
                            {[
                              { label: 'Won',   value: row.won,            isGd: false },
                              { label: 'Drawn', value: row.drawn,          isGd: false },
                              { label: 'Lost',  value: row.lost,           isGd: false },
                              { label: 'GD',    value: row.goalDifference, isGd: true  },
                            ].map(({ label, value, isGd }) => (
                              <div
                                key={label}
                                className="rounded-xl border-2 border-brand-navy/10 bg-white px-2 py-2 text-center"
                              >
                                <p className="font-display text-[10px] font-black uppercase tracking-wider text-brand-navy/50">
                                  {label}
                                </p>
                                <p className="mt-0.5 font-display text-lg font-black leading-none text-brand-navy">
                                  {isGd ? <GDCell value={value} /> : value}
                                </p>
                              </div>
                            ))}
                          </div>

                          {/* Last 5 form strip */}
                          <div>
                            <p className="mb-2 font-display text-[10px] font-black uppercase tracking-wider text-brand-navy/50">
                              Last 5
                            </p>
                            {teamForm && teamForm.length > 0 ? (
                              <div className="flex gap-1.5">
                                {teamForm.slice(0, 5).map((result, i) => (
                                  <FormBadge key={i} result={result} accent={accent} />
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs font-semibold text-zinc-400">
                                Form data not available
                              </p>
                            )}
                          </div>

                        </div>
                      </div>
                    </td>
                  </tr>

                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-t-2 border-brand-navy/10 bg-brand-cream/50 px-4 py-3 sm:px-6">
        <p className="text-xs font-semibold text-zinc-500">
          {table.rows.length} {table.rows.length === 1 ? 'team' : 'teams'} · {table.season}
        </p>
        <p className="text-xs font-semibold text-zinc-400 md:hidden">
          Tap any row for full stats
        </p>
      </div>

    </div>
  );
}
