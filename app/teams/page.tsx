import type { Metadata } from 'next';
import PublicPageShell from '@/components/layout/PublicPageShell';
import PageHero from '@/components/layout/PageHero';
import { KNOWN_DIVISIONS } from '@/config/ddsl-competitions';
import { AFL_DIVISIONS } from '@/config/afl-competitions';
import { CLUB_SEASON } from '@/config/club-season';
import TeamsClient from './TeamsClient';

const totalTeams = KNOWN_DIVISIONS.length + 1 + AFL_DIVISIONS.length;

export const metadata: Metadata = {
  title: 'Our Teams | Rivervalley Rangers AFC',
  description: `All ${totalTeams} teams at Rivervalley Rangers AFC — DDSL Youth, Senior, and Over 35s, ${CLUB_SEASON.currentSeason} season.`,
};

export default async function TeamsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter } = await searchParams;
  const initialFilter = (() => {
    switch (filter?.toLowerCase()) {
      case 'boys':    return 'BOYS'   as const;
      case 'girls':   return 'GIRLS'  as const;
      case 'senior':  return 'SENIOR' as const;
      case 'over35s': return 'OVER35S' as const;
      default:        return 'ALL'    as const;
    }
  })();

  return (
    <PublicPageShell>
      <PageHero
        eyebrow={`${CLUB_SEASON.currentSeason} Season`}
        title="Our Teams"
        description={`${totalTeams} teams across youth, senior, and Over 35s football.`}
        maxWidth="5xl"
      />
      <TeamsClient
        youthDivisions={KNOWN_DIVISIONS}
        aflDivisions={AFL_DIVISIONS}
        initialFilter={initialFilter}
      />
    </PublicPageShell>
  );
}
