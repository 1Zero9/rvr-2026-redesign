import { unstable_cache } from 'next/cache';
import { scrapeSeniorMatches } from './scraper';
import type { SeniorSyncResponse } from './types';

export const getSeniorSyncData = unstable_cache(
  async (): Promise<SeniorSyncResponse> => {
    const data = await scrapeSeniorMatches();
    return data ?? {
      scrapedAt: new Date().toISOString(),
      source: 'finalwhistle.ie',
      results: [],
      fixtures: [],
    };
  },
  ['finalwhistle-senior-sync'],
  { revalidate: 900 },
);
