import type { Metadata } from 'next';
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

export default function TeamsPage() {
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
        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <div className="relative bg-brand-navy overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(rgba(133,227,32,0.12) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(133,227,32,0.12) 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
          />
          <div className="relative max-w-5xl mx-auto px-4 md:px-6 pt-10 pb-8">
            <h1 className="font-display font-black italic text-5xl md:text-7xl uppercase tracking-tight leading-none text-brand-neon mb-2">
              Our Teams
            </h1>
            <p className="text-brand-sky text-sm">
              Rivervalley Rangers AFC · {CLUB_SEASON.currentSeason} Season · {totalTeams} Teams
            </p>
          </div>
        </div>

        {/* Accent line */}
        <div className="h-1 w-full bg-brand-neon" />

        <TeamsClient
          youthDivisions={KNOWN_DIVISIONS}
          aflDivisions={AFL_DIVISIONS}
        />
      </main>
    </div>
  );
}
