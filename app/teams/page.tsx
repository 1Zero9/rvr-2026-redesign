import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
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
    <div
      className="min-h-screen bg-brand-cream"
      style={{
        backgroundImage: `
          linear-gradient(rgba(11,31,59,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(11,31,59,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      }}
    >
      <Header />

      <main>
        <div className="relative overflow-hidden bg-brand-navy">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(rgba(133,227,32,0.12) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(133,227,32,0.12) 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
          />
          <div className="relative mx-auto max-w-2xl px-4 pb-8 pt-6">
            <h1 className="mb-2 font-display text-4xl font-black italic uppercase leading-none tracking-tight text-brand-neon md:text-5xl">
              Our Teams
            </h1>
            <p className="mb-6 text-sm text-brand-sky">
              {CLUB_SEASON.currentSeason} Season · {totalTeams} teams across youth, senior, and Over 35s football.
            </p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Link
                href="/teams?filter=boys"
                className="group flex min-h-[44px] items-center justify-between border border-brand-sky/30 bg-white/10 p-4"
              >
                <div>
                  <p className="font-display text-base font-black italic text-brand-cream">DDSL Boys</p>
                  <p className="mt-0.5 text-xs text-brand-sky/70">Youth football · Development and competitive</p>
                </div>
                <span className="text-sm text-brand-neon transition-transform group-hover:translate-x-1">
                  View →
                </span>
              </Link>
              <Link
                href="/teams?filter=girls"
                className="group flex min-h-[44px] items-center justify-between border border-brand-sky/30 bg-white/10 p-4"
              >
                <div>
                  <p className="font-display text-base font-black italic text-brand-cream">DDSL Girls</p>
                  <p className="mt-0.5 text-xs text-brand-sky/70">Girls teams across DDSL divisions</p>
                </div>
                <span className="text-sm text-brand-neon transition-transform group-hover:translate-x-1">
                  View →
                </span>
              </Link>
            </div>
          </div>
        </div>
        <div className="h-1 w-full bg-brand-green" />

        <TeamsClient
          youthDivisions={KNOWN_DIVISIONS}
          aflDivisions={AFL_DIVISIONS}
          initialFilter={initialFilter}
        />
      </main>
    </div>
  );
}
