import { NextRequest, NextResponse } from 'next/server';
import { cacheGet, cacheSet } from '@/lib/ddsl/cache';
import { scrapeSeniorMatches } from '@/lib/finalwhistle/scraper';
import type { SeniorSyncResponse } from '@/lib/finalwhistle/types';

export const dynamic   = 'force-dynamic';
export const revalidate = 0;

const CACHE_KEY = 'fw:senior:sync';

export async function GET(_req: NextRequest): Promise<NextResponse> {
  const cached = cacheGet<SeniorSyncResponse>(CACHE_KEY);
  if (cached.hit) {
    return NextResponse.json(cached.data, {
      headers: {
        'X-Cache':         'HIT',
        'X-Cache-Expires': cached.expiresAt.toString(),
        'Cache-Control':   'no-store, max-age=0, must-revalidate',
      },
    });
  }

  const data = await scrapeSeniorMatches();

  if (!data) {
    const empty: SeniorSyncResponse = {
      scrapedAt: new Date().toISOString(),
      source:    'finalwhistle.ie',
      results:   [],
      fixtures:  [],
    };
    return NextResponse.json(empty, {
      headers: {
        'X-Cache':       'MISS',
        'X-Data-Source': 'empty',
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
      },
    });
  }

  cacheSet(CACHE_KEY, data);

  return NextResponse.json(data, {
    headers: {
      'X-Cache':       'MISS',
      'X-Data-Source': 'finalwhistle-live',
      'Cache-Control': 'no-store, max-age=0, must-revalidate',
    },
  });
}
