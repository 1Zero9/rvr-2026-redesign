import type { Metadata } from 'next';
import Link from 'next/link';
import PublicPageShell from '@/components/layout/PublicPageShell';
import PageHeroNavy from '@/components/layout/PageHeroNavy';
import { KNOWN_DIVISIONS } from '@/config/ddsl-competitions';
import { AFL_DIVISIONS } from '@/config/afl-competitions';
import { CLUB_SEASON } from '@/config/club-season';
import TeamsClient from './TeamsClient';

const totalTeams = KNOWN_DIVISIONS.length + 1 + AFL_DIVISIONS.length;

export const metadata: Metadata = {
  title: 'Our Teams',
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
      <PageHeroNavy
        title="Our Teams"
        description={`${CLUB_SEASON.currentSeason} Season · ${totalTeams} teams across youth, senior, and Over 35s football.`}
        links={
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Link href="/teams?filter=boys" className="group flex min-h-[44px] items-center justify-between border border-brand-sky/30 bg-white/10 p-4">
              <div>
                <p className="font-display text-base font-black italic text-brand-cream">DDSL Boys</p>
                <p className="mt-0.5 text-xs text-brand-sky/70">Youth football · Development and competitive</p>
              </div>
              <span className="text-sm text-brand-neon transition-transform group-hover:translate-x-1">View →</span>
            </Link>
            <Link href="/teams?filter=girls" className="group flex min-h-[44px] items-center justify-between border border-brand-sky/30 bg-white/10 p-4">
              <div>
                <p className="font-display text-base font-black italic text-brand-cream">DDSL Girls</p>
                <p className="mt-0.5 text-xs text-brand-sky/70">Girls teams across DDSL divisions</p>
              </div>
              <span className="text-sm text-brand-neon transition-transform group-hover:translate-x-1">View →</span>
            </Link>
          </div>
        }
      />

        <TeamsClient
          youthDivisions={KNOWN_DIVISIONS}
          aflDivisions={AFL_DIVISIONS}
          initialFilter={initialFilter}
        />
    </PublicPageShell>
  );
}
