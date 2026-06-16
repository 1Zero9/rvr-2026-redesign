/**
 * SportLoMo API client for the DDSL (Dublin & District Schoolboys/girls League).
 *
 * Required environment variables:
 *   SPORTLOMO_BASE_URL   – e.g. https://api.sportlomo.com/ddsl/v2
 *   SPORTLOMO_API_KEY    – Bearer token issued by DDSL / SportLoMo
 *   SPORTLOMO_CLUB_ID    – RVR's numeric club ID in the SportLoMo system
 *   SPORTLOMO_SEASON     – Active season identifier, e.g. "2025-2026"
 *
 * Verify endpoint paths against your DDSL SportLoMo API documentation — the
 * paths below follow the SportLoMo v2 convention but may differ per instance.
 */

import type {
  SportLoMoEnvelope,
  SportLoMoFixture,
  SportLoMoStandingsTable,
} from './types';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

function requireEnv(key: string): string {
  const val = process.env[key];
  if (!val) throw new SportLoMoConfigError(`Missing required environment variable: ${key}`);
  return val;
}

function getConfig() {
  return {
    baseUrl: requireEnv('SPORTLOMO_BASE_URL').replace(/\/$/, ''),
    apiKey:  requireEnv('SPORTLOMO_API_KEY'),
    clubId:  requireEnv('SPORTLOMO_CLUB_ID'),
    season:  process.env.SPORTLOMO_SEASON ?? new Date().getFullYear().toString(),
  };
}

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------

export class SportLoMoConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SportLoMoConfigError';
  }
}

export class SportLoMoApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly body?: string,
  ) {
    super(message);
    this.name = 'SportLoMoApiError';
  }
}

// ---------------------------------------------------------------------------
// HTTP fetch wrapper
// ---------------------------------------------------------------------------

async function fetchJson<T>(path: string, extra: Record<string, string> = {}): Promise<T> {
  const { baseUrl, apiKey, clubId, season } = getConfig();

  const url = new URL(`${baseUrl}${path}`);
  url.searchParams.set('clubId', clubId);
  url.searchParams.set('season', season);
  for (const [k, v] of Object.entries(extra)) {
    url.searchParams.set(k, v);
  }

  let res: Response;
  try {
    res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/json',
      },
      // Disable Next.js fetch cache — we manage our own TTL in cache.ts
      cache: 'no-store',
    });
  } catch (err) {
    throw new SportLoMoApiError(
      0,
      `Network error reaching SportLoMo: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  if (res.status === 401 || res.status === 403) {
    throw new SportLoMoApiError(res.status, 'SportLoMo authentication failed — check SPORTLOMO_API_KEY');
  }
  if (res.status === 429) {
    throw new SportLoMoApiError(res.status, 'SportLoMo rate limit exceeded — cached responses should prevent this');
  }

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new SportLoMoApiError(
      res.status,
      `SportLoMo API returned ${res.status} ${res.statusText}`,
      body,
    );
  }

  let json: unknown;
  try {
    json = await res.json();
  } catch {
    throw new SportLoMoApiError(res.status, 'SportLoMo returned non-JSON response');
  }

  return json as T;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Upcoming fixtures for RVR.
 *
 * SportLoMo endpoint: GET /Club/{clubId}/Fixtures
 * Query params: season, page, pageSize
 */
export async function fetchFixtures(opts: { page?: number; pageSize?: number } = {})
  : Promise<SportLoMoEnvelope<SportLoMoFixture>>
{
  const { clubId } = getConfig();
  return fetchJson<SportLoMoEnvelope<SportLoMoFixture>>(
    `/Club/${clubId}/Fixtures`,
    {
      page:     String(opts.page     ?? 1),
      pageSize: String(opts.pageSize ?? 50),
    },
  );
}

/**
 * Recent results for RVR.
 *
 * SportLoMo endpoint: GET /Club/{clubId}/Results
 */
export async function fetchResults(opts: { page?: number; pageSize?: number } = {})
  : Promise<SportLoMoEnvelope<SportLoMoFixture>>
{
  const { clubId } = getConfig();
  return fetchJson<SportLoMoEnvelope<SportLoMoFixture>>(
    `/Club/${clubId}/Results`,
    {
      page:     String(opts.page     ?? 1),
      pageSize: String(opts.pageSize ?? 50),
    },
  );
}

/**
 * Currently live matches for RVR.
 *
 * SportLoMo endpoint: GET /Club/{clubId}/Live
 * (Some SportLoMo instances expose this as a status filter on /Fixtures)
 */
export async function fetchLive(): Promise<SportLoMoEnvelope<SportLoMoFixture>> {
  const { clubId } = getConfig();
  return fetchJson<SportLoMoEnvelope<SportLoMoFixture>>(
    `/Club/${clubId}/Live`,
  );
}

/**
 * League standings for all divisions in which RVR is registered.
 *
 * SportLoMo endpoint: GET /Club/{clubId}/Standings
 * Returns every competition table the club appears in for the active season.
 */
export async function fetchStandings(): Promise<SportLoMoEnvelope<SportLoMoStandingsTable>> {
  const { clubId } = getConfig();
  return fetchJson<SportLoMoEnvelope<SportLoMoStandingsTable>>(
    `/Club/${clubId}/Standings`,
  );
}
