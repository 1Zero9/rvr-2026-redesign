import type { Metadata } from 'next';
import Link from 'next/link';
import PublicPageShell from '@/components/layout/PublicPageShell';
import PageHeroNavy from '@/components/layout/PageHeroNavy';
import { AFL_DIVISIONS } from '@/config/afl-competitions';

export const metadata: Metadata = {
  title: 'Over 35s',
  description: 'Over 35s squads at Rivervalley Rangers AFC competing in the Amateur Football League.',
};

export default function Over35sHubPage() {
  return (
    <PublicPageShell>
      <PageHeroNavy
        backHref="/seniors"
        backLabel="Senior Teams"
        title="Over 35s"
        description="Rivervalley Rangers AFC · Amateur Football League"
        links={
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
                <span className="text-sm text-brand-neon transition-transform group-hover:translate-x-1">View →</span>
              </Link>
            ))}
          </div>
        }
      />

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

    </PublicPageShell>
  );
}
