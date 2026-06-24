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
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {AFL_DIVISIONS.map((division, i) => (
                <Link
                  key={division.id}
                  href={`/seniors/over-35s/${division.id}`}
                  className="group flex min-h-[44px] items-center justify-between border border-brand-sky/30 bg-white/10 p-4"
                >
                  <div>
                    <p className="font-display text-base font-black italic text-brand-cream">
                      {i === 0 ? 'Over 35s A' : 'Over 35s B'}
                    </p>
                    <p className="mt-0.5 text-xs text-brand-sky/70">{division.competitionName}</p>
                  </div>
                  <span className="text-sm text-brand-neon transition-transform group-hover:translate-x-1">
                    View →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="h-1 w-full bg-brand-green" />

        {/* ── Team cards ──────────────────────────────────────────────────── */}
        <div className="max-w-2xl mx-auto px-4 py-8 pb-36 md:pb-16">
          <section>
            <h2 className="font-display italic font-black uppercase text-xl text-brand-charcoal border-l-4 border-brand-green pl-3 mb-4">
              Our Teams
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {AFL_DIVISIONS.map((division, i) => (
                <div
                  key={division.id}
                  className="bg-brand-navy border-2 border-brand-green shadow-brutalist overflow-hidden"
                >
                  <div className="h-1 bg-brand-green" />
                  <div className="p-5">
                    <p className="font-display italic font-black text-brand-neon text-xl mb-1">
                      {i === 0 ? 'OVER 35s A' : 'OVER 35s B'}
                    </p>
                    <p className="text-brand-sky text-sm mb-4">
                      {division.competitionName}
                    </p>
                    <Link
                      href={`/seniors/over-35s/${division.id}`}
                      className="text-brand-neon font-bold min-h-[44px] flex items-center text-sm hover:underline"
                    >
                      View Team →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

      </main>
    </div>
  );
}
