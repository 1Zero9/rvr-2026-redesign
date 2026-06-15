import { NextRequest, NextResponse } from 'next/server';
import { fetchFixtures } from '@/lib/ddsl/client';
import { SportLoMoApiError, SportLoMoConfigError } from '@/lib/ddsl/client';
import { cacheGet, cacheSet, TTL_MS } from '@/lib/ddsl/cache';
import { transformAll } from '@/lib/ddsl/transform';
import type { MatchesResponse } from '@/lib/ddsl/types';

const CACHE_KEY = 'ddsl:fixtures';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest): Promise<NextResponse> {
  const page     = Number(req.nextUrl.searchParams.get('page')     ?? 1);
  const pageSize = Number(req.nextUrl.searchParams.get('pageSize') ?? 50);

  // ------------------------------------------------------------------
  // Cache read
  // ------------------------------------------------------------------
  const cached = cacheGet<MatchesResponse>(`${CACHE_KEY}:${page}:${pageSize}`);
  if (cached.hit) {
    return NextResponse.json(cached.data, {
      headers: { 'X-Cache': 'HIT', 'X-Cache-Expires': cached.expiresAt.toString() },
    });
  }

  // ------------------------------------------------------------------
  // Fetch from SportLoMo
  // ------------------------------------------------------------------
  try {
    const envelope = await fetchFixtures({ page, pageSize });
    const matches = transformAll(envelope.data);

    const now = Date.now();
    const body: MatchesResponse = {
      cachedAt:       new Date(now).toISOString(),
      cacheExpiresAt: new Date(now + TTL_MS).toISOString(),
      matches,
    };

    cacheSet(`${CACHE_KEY}:${page}:${pageSize}`, body);

    return NextResponse.json(body, { headers: { 'X-Cache': 'MISS' } });
  } catch (err) {
    return handleError(err);
  }
}

function handleError(err: unknown): NextResponse {
  if (err instanceof SportLoMoConfigError) {
    console.error('[ddsl/fixtures] config error:', err.message);
    return NextResponse.json(
      { error: 'DDSL integration not configured — check server environment variables' },
      { status: 503 },
    );
  }
  if (err instanceof SportLoMoApiError) {
    console.error(`[ddsl/fixtures] upstream ${err.status}:`, err.message);
    const status = err.status === 429 ? 429 : 502;
    return NextResponse.json({ error: err.message }, { status });
  }
  console.error('[ddsl/fixtures] unexpected error:', err);
  return NextResponse.json({ error: 'Unexpected error fetching fixtures' }, { status: 500 });
}
