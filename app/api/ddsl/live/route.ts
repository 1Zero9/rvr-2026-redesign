import { NextResponse } from 'next/server';
import { fetchLive } from '@/lib/ddsl/client';
import { SportLoMoApiError, SportLoMoConfigError } from '@/lib/ddsl/client';
import { cacheGet, cacheSet, TTL_MS } from '@/lib/ddsl/cache';
import { transformAll } from '@/lib/ddsl/transform';
import type { MatchesResponse } from '@/lib/ddsl/types';

/**
 * Live match data is cached for a shorter window than fixtures/results.
 * Reduce to 60 000 ms (1 min) for a tighter loop during match days,
 * or leave at TTL_MS for less SportLoMo pressure during quiet periods.
 */
const LIVE_TTL_MS = Math.min(60_000, TTL_MS);
const CACHE_KEY   = 'ddsl:live';

export const dynamic = 'force-dynamic';

/**
 * GET /api/ddsl/live
 *
 * Returns all RVR matches currently in progress.
 * Scores for U7–U12 age groups have the DDSL Mercy Rule applied.
 * Cached for up to 1 minute (configurable via LIVE_TTL_MS above).
 */
export async function GET(): Promise<NextResponse> {
  // ------------------------------------------------------------------
  // Cache read
  // ------------------------------------------------------------------
  const cached = cacheGet<MatchesResponse>(CACHE_KEY);
  if (cached.hit) {
    return NextResponse.json(cached.data, {
      headers: {
        'X-Cache':         'HIT',
        'X-Cache-Expires': cached.expiresAt.toString(),
        // Hint to the client how often to poll
        'Cache-Control':   `public, max-age=${Math.floor(LIVE_TTL_MS / 1000)}`,
      },
    });
  }

  // ------------------------------------------------------------------
  // Fetch from SportLoMo
  // ------------------------------------------------------------------
  try {
    const envelope = await fetchLive();
    const matches = transformAll(envelope.data);

    const now = Date.now();
    const body: MatchesResponse = {
      cachedAt:       new Date(now).toISOString(),
      cacheExpiresAt: new Date(now + LIVE_TTL_MS).toISOString(),
      matches,
    };

    // Store with the shortened TTL for live data
    const entry = cacheSet(CACHE_KEY, body);
    // Patch the expiresAt on the stored entry to the shorter window
    // (cacheSet defaults to TTL_MS; override in-place)
    Object.assign(entry, { expiresAt: now + LIVE_TTL_MS });

    return NextResponse.json(body, {
      headers: {
        'X-Cache':       'MISS',
        'Cache-Control': `public, max-age=${Math.floor(LIVE_TTL_MS / 1000)}`,
      },
    });
  } catch (err) {
    return handleError(err);
  }
}

function handleError(err: unknown): NextResponse {
  if (err instanceof SportLoMoConfigError) {
    console.error('[ddsl/live] config error:', err.message);
    return NextResponse.json(
      { error: 'DDSL integration not configured — check server environment variables' },
      { status: 503 },
    );
  }
  if (err instanceof SportLoMoApiError) {
    console.error(`[ddsl/live] upstream ${err.status}:`, err.message);
    const status = err.status === 429 ? 429 : 502;
    return NextResponse.json({ error: err.message }, { status });
  }
  console.error('[ddsl/live] unexpected error:', err);
  return NextResponse.json({ error: 'Unexpected error fetching live matches' }, { status: 500 });
}
