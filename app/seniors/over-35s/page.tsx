import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import type { SeniorMatch, SeniorSyncResponse } from '@/lib/finalwhistle/types';

export const metadata: Metadata = {
  title: 'Over 35s | Rivervalley Rangers AFC',
  description: 'Over 35s results and fixtures for Rivervalley Rangers AFC — AFL Division 1 North and AFL Division 3 North.',
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

function groupByCompetition(matches: SeniorMatch[]): Map<string, SeniorMatch[]> {
  const groups = new Map<string, SeniorMatch[]>();
  for (const match of matches) {
    const existing = groups.get(match.competition);
    if (existing) {
      existing.push(match);
    } else {
      groups.set(match.competition, [match]);
    }
  }
  return groups;
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
        <WDLPill match={match} />
        <span className="text-brand-sky text-xs">{formatDate(match.date)}</span>
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
        <span className="text-brand-green text-xs uppercase font-bold tracking-wide">Upcoming</span>
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

export default async function Over35sPage() {
  const data = await getSeniorData();

  const allResults  = (data?.results  ?? [])
    .filter((m) => m.competition.startsWith('AFL'))
    .sort((a, b) => b.date.localeCompare(a.date));
  const allFixtures = (data?.fixtures ?? [])
    .filter((m) => m.competition.startsWith('AFL'))
    .sort((a, b) => a.date.localeCompare(b.date));

  const resultGroups  = groupByCompetition(allResults);
  const fixtureGroups = groupByCompetition(allFixtures);

  const hasResults  = allResults.length > 0;
  const hasFixtures = allFixtures.length > 0;

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
              Over 35s
            </h1>
            <p className="text-brand-sky text-sm mb-3">
              Rivervalley Rangers AFC · AFL Over 35s Football
            </p>
            <span className="inline-block px-3 py-1 text-xs font-display font-black uppercase tracking-wider bg-brand-green text-white">
              OVER 35s
            </span>
          </div>
        </div>
        <div className="h-1 w-full bg-brand-green" />

        <div className="max-w-2xl mx-auto px-4 py-8 space-y-10">

          {!hasResults && !hasFixtures && (
            <div className="bg-brand-navy border border-brand-green/30 p-6">
              <p className="text-brand-cream text-sm">
                No fixture or result data available. Check back soon.
              </p>
            </div>
          )}

          {/* ── Section A: Results grouped by competition ─────────────────── */}
          {hasResults && (
            <section>
              <h2 className="font-display italic font-black uppercase text-xl text-brand-charcoal border-l-4 border-brand-green pl-3 mb-4">
                Results
              </h2>
              {Array.from(resultGroups.entries()).map(([competition, matches]) => (
                <div key={competition} className="mb-6">
                  <p className="font-display italic font-black uppercase text-base text-brand-green border-l-4 border-brand-green pl-2 mb-2">
                    {competition}
                  </p>
                  {matches.map((match) => (
                    <ResultCard key={match.matchId} match={match} />
                  ))}
                </div>
              ))}
            </section>
          )}

          {/* ── Section B: Upcoming fixtures grouped by competition ───────── */}
          {hasFixtures && (
            <section>
              <h2 className="font-display italic font-black uppercase text-xl text-brand-charcoal border-l-4 border-brand-green pl-3 mb-4">
                Upcoming Fixtures
              </h2>
              {Array.from(fixtureGroups.entries()).map(([competition, matches]) => (
                <div key={competition} className="mb-6">
                  <p className="font-display italic font-black uppercase text-base text-brand-green border-l-4 border-brand-green pl-2 mb-2">
                    {competition}
                  </p>
                  {matches.map((match) => (
                    <FixtureCard key={match.matchId} match={match} />
                  ))}
                </div>
              ))}
            </section>
          )}

          <p className="text-brand-sky text-xs text-right mt-4">
            Data sourced from FinalWhistle.ie · Updated on page load
          </p>

        </div>
      </main>
    </div>
  );
}
