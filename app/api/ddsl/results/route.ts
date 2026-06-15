import { NextRequest, NextResponse } from 'next/server';
import { fetchResults } from '@/lib/ddsl/client';
import { SportLoMoApiError, SportLoMoConfigError } from '@/lib/ddsl/client';
import { cacheGet, cacheSet, TTL_MS } from '@/lib/ddsl/cache';
import { transformAll } from '@/lib/ddsl/transform';
import type { MatchesResponse } from '@/lib/ddsl/types';

const CACHE_KEY = 'ddsl:results';

export const dynamic = 'force-dynamic';

/**
 * GET /api/ddsl/results
 *
 * Returns completed match results for all RVR squads.
 * Scores for U7–U12 age groups have the DDSL Mercy Rule applied:
 *   Margin_display = min(Score_winning − Score_losing, 5)
 *
 * Query params:
 *   page      – page number (default 1)
 *   pageSize  – results per page (default 50)
 *   ageGroup  – optional filter, e.g. "U10" or "U12"
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  const page       = Number(req.nextUrl.searchParams.get('page')     ?? 1);
  const pageSize   = Number(req.nextUrl.searchParams.get('pageSize') ?? 50);
  const ageFilter  = req.nextUrl.searchParams.get('ageGroup')?.toUpperCase() ?? null;

  const cacheKey = `${CACHE_KEY}:${page}:${pageSize}`;

  // ------------------------------------------------------------------
  // Cache read
  // ------------------------------------------------------------------
  const cached = cacheGet<MatchesResponse>(cacheKey);
  if (cached.hit) {
    const body = ageFilter
      ? { ...cached.data, matches: cached.data.matches.filter((m) => m.ageGroup === ageFilter) }
      : cached.data;

    return NextResponse.json(body, {
      headers: { 'X-Cache': 'HIT', 'X-Cache-Expires': cached.expiresAt.toString() },
    });
  }

  // ------------------------------------------------------------------
  // Fetch from SportLoMo
  // ------------------------------------------------------------------
  try {
    const envelope = await fetchResults({ page, pageSize });
    const matches = transformAll(envelope.data);

    const now = Date.now();
    const body: MatchesResponse = {
      cachedAt:       new Date(now).toISOString(),
      cacheExpiresAt: new Date(now + TTL_MS).toISOString(),
      matches,
    };

    cacheSet(cacheKey, body);

    const filtered = ageFilter
      ? { ...body, matches: body.matches.filter((m) => m.ageGroup === ageFilter) }
      : body;

    return NextResponse.json(filtered, { headers: { 'X-Cache': 'MISS' } });
  } catch (err) {
    return handleError(err);
  }
}

function handleError(err: unknown): NextResponse {
  if (err instanceof SportLoMoConfigError) {
    console.error('[ddsl/results] config error:', err.message);
    return NextResponse.json(
      { error: 'DDSL integration not configured — check server environment variables' },
      { status: 503 },
    );
  }
  if (err instanceof SportLoMoApiError) {
    console.error(`[ddsl/results] upstream ${err.status}:`, err.message);
    const status = err.status === 429 ? 429 : 502;
    return NextResponse.json({ error: err.message }, { status });
  }
  console.error('[ddsl/results] unexpected error:', err);
  return NextResponse.json({ error: 'Unexpected error fetching results' }, { status: 500 });
}
