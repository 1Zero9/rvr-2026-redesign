import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import { AFL_DIVISIONS } from '@/config/afl-competitions';

export const metadata: Metadata = {
  title: 'Over 35s | Rivervalley Rangers AFC',
  description: 'Over 35s squads at Rivervalley Rangers AFC competing in the Amateur Football League.',
};

export default function Over35sHubPage() {
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

        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <div className="relative bg-brand-navy overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(rgba(133,227,32,0.12) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(133,227,32,0.12) 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
          />
          <div className="relative max-w-2xl mx-auto px-4 pt-6 pb-8">
            <Link
              href="/seniors"
              className="inline-block text-brand-sky text-sm mb-5 hover:text-brand-neon transition-colors"
            >
              ← Senior Teams
            </Link>
            <h1 className="font-display font-black italic text-4xl md:text-5xl uppercase tracking-tight leading-none text-brand-neon mb-2">
              OVER 35s
            </h1>
            <p className="text-brand-sky text-sm mb-3">
              Rivervalley Rangers AFC · Amateur Football League
            </p>
            <span className="inline-block px-3 py-1 text-xs font-display font-black uppercase tracking-wider bg-brand-neon text-brand-charcoal">
              OVER 35s
            </span>
          </div>
        </div>
        <div className="h-1 w-full bg-brand-neon" />

        {/* ── Team cards ──────────────────────────────────────────────────── */}
        <div className="max-w-2xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {AFL_DIVISIONS.map((division, i) => (
            <div
              key={division.id}
              className="bg-brand-navy border-2 border-brand-neon shadow-brutalist p-5 flex flex-col gap-3"
            >
              <p className="text-brand-neon text-xs font-display font-black uppercase tracking-wider">
                {i === 0 ? 'A TEAM' : 'B TEAM'}
              </p>
              <p className="text-brand-cream font-bold text-lg">
                {division.competitionName}
              </p>
              <Link
                href={`/seniors/over-35s/${division.id}`}
                className="inline-flex items-center min-h-[44px] px-4 bg-brand-neon text-brand-charcoal font-bold text-sm border-2 border-brand-charcoal shadow-brutalist hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
              >
                View Table →
              </Link>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
