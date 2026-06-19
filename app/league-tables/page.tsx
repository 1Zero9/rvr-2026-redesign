import type { Metadata } from 'next';
import Header from '@/components/Header';
import { prisma } from '@/lib/prisma';
import { CLUB_SEASON } from '@/config/club-season';
import LeagueTablesClient from './LeagueTablesClient';

export const metadata: Metadata = {
  title: `League Tables | Rivervalley Rangers AFC`,
  description: `DDSL league standings for all RVR competitive divisions — ${CLUB_SEASON.currentSeason} season.`,
};

// ─── Types ────────────────────────────────────────────────────────────────────

const COMPETITIVE_AGE_GROUPS = ['U12', 'U13', 'U14', 'U15', 'U17'] as const;
export type AgeGroup = (typeof COMPETITIVE_AGE_GROUPS)[number];

export type StandingRow = {
  position: number;
  teamName: string;
  played:   number;
  won:      number;
  drawn:    number;
  lost:     number;
  points:   number;
  isRVR:    boolean;
};

export type DivisionGroup = {
  divisionName: string;
  ageGroup:     AgeGroup;
  rows:         StandingRow[];
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const AGE_ORDER: Record<AgeGroup, number> = {
  U12: 0, U13: 1, U14: 2, U15: 3, U17: 4,
};

function extractAgeGroup(divisionName: string): AgeGroup | null {
  for (const ag of COMPETITIVE_AGE_GROUPS) {
    if (divisionName.includes(ag)) return ag;
  }
  return null;
}

function isRVR(teamName: string): boolean {
  return /rivervalley|river valley/i.test(teamName);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function LeagueTablesPage() {
  let divisions: DivisionGroup[] = [];

  try {
    const season = await prisma.season.findFirst({
      where: { isActive: true },
      include: {
        historicalStandings: {
          orderBy: [{ divisionName: 'asc' }, { position: 'asc' }],
        },
      },
    });

    const divisionMap = new Map<string, DivisionGroup>();

    for (const row of season?.historicalStandings ?? []) {
      const ageGroup = extractAgeGroup(row.divisionName);
      if (!ageGroup) continue;

      const entry: StandingRow = {
        position: row.position,
        teamName: row.teamName,
        played:   row.played,
        won:      row.won,
        drawn:    row.drawn,
        lost:     row.lost,
        points:   row.points,
        isRVR:    isRVR(row.teamName),
      };

      const existing = divisionMap.get(row.divisionName);
      if (existing) {
        existing.rows.push(entry);
      } else {
        divisionMap.set(row.divisionName, {
          divisionName: row.divisionName,
          ageGroup,
          rows: [entry],
        });
      }
    }

    divisions = [...divisionMap.values()].sort((a, b) => {
      const ageDiff = AGE_ORDER[a.ageGroup] - AGE_ORDER[b.ageGroup];
      return ageDiff !== 0 ? ageDiff : a.divisionName.localeCompare(b.divisionName);
    });
  } catch {
    // DB unavailable — fall through to empty state
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      <Header />
      <main>
        {/* Full-width navy banner */}
        <div className="bg-brand-navy">
          <div className="max-w-2xl mx-auto px-4 pt-8 pb-6">
            <h1 className="font-display font-black italic text-4xl lg:text-6xl uppercase tracking-tight leading-none text-brand-neon mb-1">
              League Tables
            </h1>
            <p className="text-brand-sky text-sm font-mono uppercase tracking-wide">
              {CLUB_SEASON.currentSeason} Season
            </p>
          </div>
        </div>

        {divisions.length === 0 ? (
          <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="bg-brand-navy border-2 border-brand-navy p-8 text-center shadow-brutalist">
              <p className="text-brand-cream font-display font-bold text-lg">
                No standings available for the current season.
              </p>
            </div>
          </div>
        ) : (
          <LeagueTablesClient divisions={divisions} />
        )}
      </main>
    </div>
  );
}
