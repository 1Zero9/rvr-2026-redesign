import type { Metadata } from 'next';
import Link from 'next/link';
import PublicPageShell from '@/components/layout/PublicPageShell';
import PageHeroNavy from '@/components/layout/PageHeroNavy';
import TeamPageTabs from '@/components/TeamPageTabs';
import FavouriteButton from '@/components/FavouriteButton';
import type { SeniorMatch, SeniorSyncResponse } from '@/lib/finalwhistle/types';

export const metadata: Metadata = {
  title: 'LSL Division 3B Saturday | Rivervalley Rangers AFC',
  description: 'LSL Division 3B Saturday results and fixtures for Rivervalley Rangers AFC.',
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

export default async function Div3BPage() {
  const COMPETITION = 'LSL Division 3B Saturday';

  const data = await getSeniorData();

  const allResults = (data?.results ?? [])
    .filter(m => m.competition === COMPETITION)
    .sort((a, b) => b.date.localeCompare(a.date));

  const allFixtures = (data?.fixtures ?? [])
    .filter(m => m.competition === COMPETITION)
    .sort((a, b) => a.date.localeCompare(b.date));

  const resultGroups  = groupByCompetition(allResults);
  const fixtureGroups = groupByCompetition(allFixtures);

  const hasResults  = allResults.length > 0;
  const hasFixtures = allFixtures.length > 0;

  const attribution = (
    <p className="text-brand-sky text-xs text-right mt-4">
      Data sourced from FinalWhistle.ie · Updated on page load
    </p>
  );

  const fixturesPanel = hasFixtures ? (
    <>
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
      {attribution}
    </>
  ) : (
    <div className="bg-brand-navy border border-brand-green/30 p-6">
      <p className="text-brand-cream text-sm">No upcoming fixtures scheduled.</p>
    </div>
  );

  const resultsPanel = hasResults ? (
    <>
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
      {attribution}
    </>
  ) : (
    <div className="bg-brand-navy border border-brand-green/30 p-6">
      <p className="text-brand-cream text-sm">No results available yet.</p>
    </div>
  );

  return (
    <PublicPageShell>
      <PageHeroNavy
        backHref="/seniors"
        backLabel="Senior Teams"
        title="Div 3B Saturday"
        description="Rivervalley Rangers AFC · LSL Division 3B Saturday"
        actions={
          <>
            <span className="inline-block px-3 py-1 text-xs font-display font-black uppercase tracking-wider bg-brand-green text-white">
              SENIOR
            </span>
            <FavouriteButton teamId="lsl-div3b" label="LSL Division 3B Saturday" variant="button" />
          </>
        }
      />

        {/* ── Tab navigation ───────────────────────────────────────────────── */}
        <TeamPageTabs
          tabs={['fixtures', 'results']}
          activeColour="brand-green"
          fixtures={fixturesPanel}
          results={resultsPanel}
        />

    </PublicPageShell>
  );
}
