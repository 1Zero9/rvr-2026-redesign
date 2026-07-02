import { unstable_cache } from 'next/cache';
import {
  discoverCompetitionId,
  FALLBACK_AJAX_COMPETITION_ID,
  RVR_CLUB_ID,
  scrapeClubAjax,
} from './scraper';
import type { SportLoMoFixture } from './types';

interface ClubMatchFeed {
  competitionId: number;
  fixtures: SportLoMoFixture[];
  results: SportLoMoFixture[];
}

export const getClubMatchFeed = unstable_cache(
  async (): Promise<ClubMatchFeed> => {
    const competitionId =
      (await discoverCompetitionId(RVR_CLUB_ID)) ?? FALLBACK_AJAX_COMPETITION_ID;
    const [fixtureData, resultData] = await Promise.all([
      scrapeClubAjax(RVR_CLUB_ID, competitionId, 'fixtures'),
      scrapeClubAjax(RVR_CLUB_ID, competitionId, 'results'),
    ]);
    return {
      competitionId,
      fixtures: fixtureData.fixtures,
      results: resultData.fixtures,
    };
  },
  ['ddsl-club-match-feed'],
  { revalidate: 900 },
);
