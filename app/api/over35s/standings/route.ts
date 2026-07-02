import { NextResponse } from 'next/server';
import { AFL_DIVISIONS } from '@/config/afl-competitions';
import { scrapeAflStandings } from '@/lib/afl/scraper';
import { CLUB_SEASON } from '@/config/club-season';

export const revalidate = 900;

export async function GET() {
  const results = await Promise.all(
    AFL_DIVISIONS.map(async (division) => {
      const table = await scrapeAflStandings(division, CLUB_SEASON.currentSeason);
      return { division, table };
    }),
  );
  return NextResponse.json(results);
}
