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

      {/* Age group quick-reference — birth year for the current DDSL season */}
      <div className="bg-brand-cream border-b border-brand-navy/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5">
          <p className="font-display font-black text-[10px] uppercase tracking-widest text-brand-green mb-3">
            Which age group is my child?
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { group: 'Academy', born: '2020–2022' },
              { group: 'U7',  born: '2019' },
              { group: 'U8',  born: '2018' },
              { group: 'U9',  born: '2017' },
              { group: 'U10', born: '2016' },
              { group: 'U11', born: '2015' },
              { group: 'U12', born: '2014' },
              { group: 'U13', born: '2013' },
              { group: 'U14', born: '2012' },
              { group: 'U15', born: '2011' },
              { group: 'U16', born: '2010' },
              { group: 'U17', born: '2009' },
            ].map(({ group, born }) => (
              <div key={group} className="flex items-center gap-1.5 rounded-full border border-brand-navy/15 bg-white px-3 py-1.5 text-xs font-bold text-brand-charcoal">
                <span className="font-display font-black uppercase text-brand-navy">{group}</span>
                <span className="text-brand-muted">·</span>
                <span className="text-brand-muted">b. {born}</span>
              </div>
            ))}
          </div>
          <p className="mt-2.5 text-xs text-brand-muted">
            Based on {CLUB_SEASON.currentSeason} DDSL season. Not sure?{' '}
            <a href="/contact" className="font-bold text-brand-navy underline underline-offset-2 hover:text-brand-green">Contact us</a> and we&apos;ll find the right team for your child.
          </p>
        </div>
      </div>

        <TeamsClient
          youthDivisions={KNOWN_DIVISIONS}
          aflDivisions={AFL_DIVISIONS}
          initialFilter={initialFilter}
        />
    </PublicPageShell>
  );
}
