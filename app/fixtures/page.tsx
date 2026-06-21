import type { Metadata } from 'next';
import Header from '@/components/Header';
import FixturesPageClient from '@/components/fixtures/FixturesPageClient';
import type { SyncResponse, NormalisedMatch, LeagueTable } from '@/lib/ddsl/types';
import { prisma } from '@/lib/prisma';
import { CLUB_SEASON } from '@/config/club-season';

export const metadata: Metadata = {
  title: 'Fixtures & Results | Rivervalley Rangers AFC',
  description: `Upcoming fixtures and recent results for all RVR DDSL teams — ${CLUB_SEASON.currentSeason} season.`,
};

async function getSyncData(): Promise<SyncResponse | null> {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
    const res = await fetch(`${base}/api/fixtures/sync`, {
      next: { revalidate: 900 },
    });
    if (!res.ok) return null;
    return res.json() as Promise<SyncResponse>;
  } catch (_err) {
    return null;
  }
}

export type HistoricalStandingEntry = {
  divisionName: string;
  teamName:     string;
  position:     number;
  played:       number;
  won:          number;
  drawn:        number;
  lost:         number;
  points:       number;
};

export default async function FixturesPage() {
  const data = await getSyncData();

  const fixtures: NormalisedMatch[] = data?.fixtures ?? [];
  const results:  NormalisedMatch[] = data?.results  ?? [];
  const tables:   LeagueTable[]     = data?.tables   ?? [];

  // Two-step historical standings query — avoids nested relation filter
  let historicalStandings: HistoricalStandingEntry[] = [];
  try {
    const activeSeason = await prisma.season.findFirst({
      where: { isActive: true },
      select: { id: true },
    });

    if (activeSeason) {
      historicalStandings = await prisma.historicalStanding.findMany({
        where: {
          seasonId: activeSeason.id,
          source:   'DDSL',
        },
        select: {
          divisionName: true,
          teamName:     true,
          position:     true,
          played:       true,
          won:          true,
          drawn:        true,
          lost:         true,
          points:       true,
        },
        orderBy: { position: 'asc' },
      });
    }
  } catch {
    // DB unavailable — historicalStandings stays empty
  }

  return (
    <div
      className="bg-brand-cream min-h-screen"
      style={{
        backgroundImage: `linear-gradient(rgba(11,31,59,0.04) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(11,31,59,0.04) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }}
    >
      <Header />
      <main>
        <div className="max-w-2xl mx-auto px-4 pt-8">
          <h1 className="text-brand-navy font-display font-black italic text-4xl lg:text-6xl uppercase tracking-tight leading-none mb-1">
            Fixtures &amp; Results
          </h1>
          <p className="text-zinc-500 text-sm font-semibold mb-6">
            {CLUB_SEASON.currentSeason} Season
          </p>
        </div>
        <FixturesPageClient
          fixtures={fixtures}
          results={results}
          tables={tables}
          historicalStandings={historicalStandings}
        />
      </main>
    </div>
  );
}
