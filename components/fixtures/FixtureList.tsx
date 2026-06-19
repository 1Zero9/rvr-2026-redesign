'use client';

import { useState } from 'react';
import type { NormalisedMatch } from '@/lib/ddsl/types';
import FixtureCard from './FixtureCard';

// ─────────────────────────────────────────────────────────────────────────────
// Grouping + sorting helpers
// ─────────────────────────────────────────────────────────────────────────────

function ageGroupNumber(competitionName: string): number {
  const m = competitionName.match(/U(\d+)/i);
  return m ? parseInt(m[1], 10) : 99;
}

function isCompetitive(competitionName: string): boolean {
  return ageGroupNumber(competitionName) >= 12;
}

function groupAndSort(
  matches: NormalisedMatch[],
  dateOrder: 'asc' | 'desc',
): [string, NormalisedMatch[]][] {
  const map = new Map<string, NormalisedMatch[]>();
  for (const m of matches) {
    const group = map.get(m.competition) ?? [];
    group.push(m);
    map.set(m.competition, group);
  }

  for (const group of map.values()) {
    group.sort((a, b) => {
      const cmp = a.date.localeCompare(b.date) || a.time.localeCompare(b.time);
      return dateOrder === 'asc' ? cmp : -cmp;
    });
  }

  return [...map.entries()].sort(([nameA], [nameB]) => {
    const aComp = isCompetitive(nameA);
    const bComp = isCompetitive(nameB);
    if (aComp !== bComp) return aComp ? -1 : 1;
    return ageGroupNumber(nameA) - ageGroupNumber(nameB);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────

interface FixtureListProps {
  fixtures: NormalisedMatch[];
  results: NormalisedMatch[];
}

type Tab = 'Upcoming' | 'Results';

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function FixtureList({ fixtures, results }: FixtureListProps) {
  const [activeTab, setActiveTab] = useState<Tab>('Upcoming');

  const upcomingGroups = groupAndSort(
    fixtures.filter((f) => f.status === 'upcoming'),
    'asc',
  );
  const resultGroups = groupAndSort(
    results.filter((r) => r.status === 'completed'),
    'desc',
  );

  const activeGroups = activeTab === 'Upcoming' ? upcomingGroups : resultGroups;

  return (
    <div>
      {/* Tabs */}
      <div className="flex mb-6 border-b-2 border-brand-sky/30">
        {(['Upcoming', 'Results'] as Tab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex-1 min-h-11 py-3 font-display font-black uppercase text-sm tracking-wide transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? 'text-brand-navy border-brand-neon'
                : 'text-zinc-400 border-transparent hover:text-brand-navy'
            }`}
          >
            {tab}
            <span className="ml-1.5 text-xs font-bold opacity-60">
              ({tab === 'Upcoming' ? fixtures.length : results.length})
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      {activeGroups.length === 0 ? (
        <div className="bg-brand-navy border border-brand-sky rounded-none p-8 text-center">
          <p className="text-brand-sky font-display font-bold text-lg">
            No fixtures found. Check back soon.
          </p>
        </div>
      ) : (
        activeGroups.map(([competition, matches]) => (
          <div key={competition}>
            <h3 className="border-l-4 border-brand-neon pl-3 text-brand-navy font-display font-bold italic text-xl my-4 mt-6">
              {competition}
            </h3>
            {matches.map((match) => (
              <FixtureCard key={match.id} match={match} />
            ))}
          </div>
        ))
      )}
    </div>
  );
}
