import type { Metadata } from 'next';
import FixturesPageClient from '@/components/fixtures/FixturesPageClient';
import PublicPageShell from '@/components/layout/PublicPageShell';
import PageHeroNavy from '@/components/layout/PageHeroNavy';
import type { SyncResponse, NormalisedMatch, LeagueTable } from '@/lib/ddsl/types';
import { prisma } from '@/lib/prisma';
import { CLUB_SEASON } from '@/config/club-season';
import { getFixtureSyncData } from '@/lib/ddsl/sync-service';

export const metadata: Metadata = {
  title: 'Fixtures & Results',
  description: `Upcoming fixtures and recent results for all RVR DDSL teams — ${CLUB_SEASON.currentSeason} season.`,
};

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
  const data: SyncResponse = await getFixtureSyncData();

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
    <PublicPageShell>
      <PageHeroNavy
        eyebrow={`${CLUB_SEASON.currentSeason} Season`}
        title="Fixtures & Results"
        description="Youth, senior, and Over 35s fixtures, results, and standings in one consistent match centre."
      />
      <FixturesPageClient
        fixtures={fixtures}
        results={results}
        tables={tables}
        historicalStandings={historicalStandings}
      />
    </PublicPageShell>
  );
}
