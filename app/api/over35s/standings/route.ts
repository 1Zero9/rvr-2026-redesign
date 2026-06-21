import { NextResponse } from 'next/server';
import { AFL_DIVISIONS } from '@/config/afl-competitions';
import { scrapeAflStandings } from '@/lib/afl/scraper';

export const revalidate = 900;

export async function GET() {
  const results = await Promise.all(
    AFL_DIVISIONS.map(async (division) => {
      const table = await scrapeAflStandings(division, '2025/26');
      return { division, table };
    }),
  );
  return NextResponse.json(results);
}
