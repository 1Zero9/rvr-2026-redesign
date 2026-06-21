import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import type { SeniorMatch, SeniorSyncResponse } from '@/lib/finalwhistle/types';

export const metadata: Metadata = {
  title: 'Senior Football | Rivervalley Rangers AFC',
  description: 'Senior football at Rivervalley Rangers AFC — First Team and Over 35s results, fixtures, and teams.',
};

// ─── Data ─────────────────────────────────────────────────────────────────────

async function getSeniorData(): Promise<SeniorSyncResponse | null> {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
    const res = await fetch(`${base}/api/senior/sync`, { next: { revalidate: 900 } });
    if (!res.ok) return null;
    return res.json() as Promise<SeniorSyncResponse>;
  } catch {
    return null;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isRVR(name: string): boolean {
  return /rivervalley|river valley/i.test(name);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IE', {
    weekday: 'short', day: 'numeric', month: 'short',
  });
}

type WDL = 'W' | 'D' | 'L';

function getWDL(match: SeniorMatch): WDL | null {
  if (!match.score) return null;
  const { home, away } = match.score;
  if (home === away) return 'D';
  return (match.isRvrHome ? home > away : away > home) ? 'W' : 'L';
}

// ─── Sub-components (Server) ──────────────────────────────────────────────────

function WDLPill({ match }: { match: SeniorMatch }) {
  const wdl = getWDL(match);
  if (!wdl) return null;
  const cls =
    wdl === 'W' ? 'bg-brand-green text-white' :
    wdl === 'D' ? 'bg-brand-sky text-brand-charcoal' :
                  'bg-brand-maroon text-white';
  return (
    <span className={`${cls} text-xs font-bold px-1.5 py-0.5 min-w-[20px] text-center inline-block`}>
      {wdl}
    </span>
  );
}

function ResultCard({ match }: { match: SeniorMatch }) {
  return (
    <div className="bg-brand-navy border border-brand-green/30 p-3 mb-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-brand-green text-xs uppercase font-bold tracking-wide">
          {match.competition}
        </span>
        <div className="flex items-center gap-2">
          <WDLPill match={match} />
          <span className="text-brand-sky text-xs">{formatDate(match.date)}</span>
        </div>
      </div>
      <p className="text-brand-cream text-sm leading-snug">
        <span className={isRVR(match.homeTeam) ? 'text-brand-neon font-bold' : 'text-brand-cream'}>
          {match.homeTeam}
        </span>
        {match.score && (
          <span className="mx-2 text-brand-neon font-bold text-lg">
            {match.score.home}–{match.score.away}
          </span>
        )}
        <span className={isRVR(match.awayTeam) ? 'text-brand-neon font-bold' : 'text-brand-cream'}>
          {match.awayTeam}
        </span>
      </p>
      {match.venue && (
        <p className="text-brand-sky/60 text-xs mt-1">{match.venue}</p>
      )}
    </div>
  );
}

function FixtureCard({ match }: { match: SeniorMatch }) {
  return (
    <div className="bg-brand-navy border border-brand-green/30 p-3 mb-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-brand-green text-xs uppercase font-bold tracking-wide">
          {match.competition}
        </span>
        <span className="text-brand-neon text-xs font-bold">{formatDate(match.date)}</span>
      </div>
      <p className="text-brand-cream text-sm leading-snug">
        <span className={isRVR(match.homeTeam) ? 'text-brand-neon font-bold' : 'text-brand-cream'}>
          {match.homeTeam}
        </span>
        <span className="mx-2 text-brand-sky/60 text-xs">vs</span>
        <span className={isRVR(match.awayTeam) ? 'text-brand-neon font-bold' : 'text-brand-cream'}>
          {match.awayTeam}
        </span>
      </p>
      {match.venue && (
        <p className="text-brand-sky/60 text-xs mt-1">{match.venue}</p>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function SeniorsPage() {
  const data     = await getSeniorData();
  const results  = (data?.results  ?? []).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  const fixtures = data?.fixtures ?? [];

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
            <h1 className="font-display font-black italic text-4xl md:text-5xl uppercase tracking-tight leading-none text-brand-neon mb-2">
              Senior Football
            </h1>
            <p className="text-brand-sky text-sm mb-6">
              Rivervalley Rangers AFC · Adult Teams
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Link
                href="/seniors/first-team"
                className="bg-white/10 border border-brand-sky/30 p-4 min-h-[44px] flex items-center justify-between group"
              >
                <div>
                  <p className="font-display italic font-black text-brand-cream text-base">First Team</p>
                  <p className="text-brand-sky/70 text-xs mt-0.5">LSL · AFL Cup · Senior Football</p>
                </div>
                <span className="text-brand-neon text-sm group-hover:translate-x-1 transition-transform">
                  View →
                </span>
              </Link>
              <Link
                href="/seniors/over-35s"
                className="bg-white/10 border border-brand-sky/30 p-4 min-h-[44px] flex items-center justify-between group"
              >
                <div>
                  <p className="font-display italic font-black text-brand-cream text-base">Over 35s</p>
                  <p className="text-brand-sky/70 text-xs mt-0.5">AFL Division 2 North · AFL Division 4 North</p>
                </div>
                <span className="text-brand-neon text-sm group-hover:translate-x-1 transition-transform">
                  View →
                </span>
              </Link>
            </div>
          </div>
        </div>
        {/* Senior green accent line */}
        <div className="h-1 w-full bg-brand-green" />

        <div className="max-w-2xl mx-auto px-4 py-8 space-y-10">

          {/* ── Section 1: Latest Results ────────────────────────────────── */}
          <section>
            <h2 className="font-display italic font-black uppercase text-xl text-brand-charcoal border-l-4 border-brand-green pl-3 mb-4">
              Latest Results
            </h2>
            {results.length === 0 ? (
              <div className="bg-brand-navy border border-brand-green/30 p-4">
                <p className="text-brand-cream text-sm">No results available yet.</p>
              </div>
            ) : (
              <div>
                {results.map((match) => (
                  <ResultCard key={match.matchId} match={match} />
                ))}
              </div>
            )}
          </section>

          {/* ── Section 2: Upcoming Fixtures ─────────────────────────────── */}
          <section>
            <h2 className="font-display italic font-black uppercase text-xl text-brand-charcoal border-l-4 border-brand-green pl-3 mb-4">
              Upcoming Fixtures
            </h2>
            {fixtures.length === 0 ? (
              <div className="bg-brand-navy border border-brand-green/30 p-4">
                <p className="text-brand-cream text-sm">No upcoming fixtures scheduled.</p>
              </div>
            ) : (
              <div>
                {fixtures.map((match) => (
                  <FixtureCard key={match.matchId} match={match} />
                ))}
              </div>
            )}
          </section>

          {/* ── Section 3: Our Teams ─────────────────────────────────────── */}
          <section>
            <h2 className="font-display italic font-black uppercase text-xl text-brand-charcoal border-l-4 border-brand-green pl-3 mb-4">
              Our Teams
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-brand-navy border-2 border-brand-green shadow-brutalist overflow-hidden">
                <div className="h-1 bg-brand-green" />
                <div className="p-5">
                  <p className="font-display italic font-black text-brand-neon text-xl mb-1">
                    FIRST TEAM
                  </p>
                  <p className="text-brand-sky text-sm mb-4">
                    LSL · AFL Cup · Senior Football
                  </p>
                  <Link
                    href="/seniors/first-team"
                    className="text-brand-neon font-bold min-h-[44px] flex items-center text-sm hover:underline"
                  >
                    View Team →
                  </Link>
                </div>
              </div>
              <div className="bg-brand-navy border-2 border-brand-green shadow-brutalist overflow-hidden">
                <div className="h-1 bg-brand-neon" />
                <div className="p-5">
                  <p className="font-display italic font-black text-brand-neon text-xl mb-1">
                    OVER 35s
                  </p>
                  <p className="text-brand-sky text-sm mb-4">
                    AFL Division 2 North · AFL Division 4 North
                  </p>
                  <Link
                    href="/seniors/over-35s"
                    className="text-brand-neon font-bold min-h-[44px] flex items-center text-sm hover:underline"
                  >
                    View Teams →
                  </Link>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
