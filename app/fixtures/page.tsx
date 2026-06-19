import type { Metadata } from 'next';
import Header from '@/components/Header';
import FixtureList from '@/components/fixtures/FixtureList';
import type { SyncResponse, NormalisedMatch } from '@/lib/ddsl/types';
import { CLUB_SEASON } from '@/config/club-season';

export const metadata: Metadata = {
  title: 'Fixtures & Results | Rivervalley Rangers AFC',
  description: `Upcoming fixtures and recent results for all RVR DDSL teams — ${CLUB_SEASON.currentSeason} season.`,
};

async function getSyncData(): Promise<SyncResponse | null> {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
    const res = await fetch(`${base}/api/fixtures/sync`, {
      next: { revalidate: 900 },
    });
    if (!res.ok) return null;
    return res.json() as Promise<SyncResponse>;
  } catch (_err) {
    return null;
  }
}

export default async function FixturesPage() {
  const data = await getSyncData();

  const fixtures: NormalisedMatch[] = data?.fixtures ?? [];
  const results: NormalisedMatch[]  = data?.results  ?? [];

  return (
    <div className="bg-brand-cream min-h-screen">
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-brand-navy font-display font-black italic text-4xl lg:text-6xl uppercase tracking-tight leading-none mb-1">
          Fixtures &amp; Results
        </h1>
        <p className="text-zinc-500 text-sm font-semibold mb-8">
          {CLUB_SEASON.currentSeason} Season
        </p>

        <FixtureList fixtures={fixtures} results={results} />
      </main>
    </div>
  );
}
