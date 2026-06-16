/**
 * SportLoMo API client for the DDSL (Dublin & District Schoolboys/girls League).
 *
 * Required environment variables:
 *   SPORTLOMO_BASE_URL   – e.g. https://api.sportlomo.com/api/v1/public
 *   SPORTLOMO_API_KEY    – Bearer token issued by DDSL / SportLoMo
 *   SPORTLOMO_CLUB_ID    – RVR's numeric club ID in the SportLoMo system
 *   SPORTLOMO_SEASON     – Active season identifier, e.g. "2025-2026"
 *
 * Verify endpoint paths against your DDSL SportLoMo API documentation — the
 * paths below follow the SportLoMo v2 convention but may differ per instance.
 */

import { CLUB_SEASON } from '@/config/club-season';
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
  const clubId = requireEnv('SPORTLOMO_CLUB_ID');
  const KNOWN_PLACEHOLDERS = new Set(['123', '0', 'YOUR_CLUB_ID']);
  if (KNOWN_PLACEHOLDERS.has(clubId)) {
    console.warn(
      `[ddsl/client] WARNING: SPORTLOMO_CLUB_ID is set to a placeholder value ("${clubId}").` +
      ' Update .env.local with the real numeric club ID from the SportLoMo admin panel.' +
      ' The API is scoped by club ID — querying by club name is not supported.',
    );
  }
  return {
    baseUrl: requireEnv('SPORTLOMO_BASE_URL').replace(/\/$/, ''),
    apiKey:  requireEnv('SPORTLOMO_API_KEY'),
    clubId,
    season:  process.env.SPORTLOMO_SEASON ?? CLUB_SEASON.currentSeason,
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
  url.searchParams.set('club_id', clubId);
  url.searchParams.set('season', season);
  for (const [k, v] of Object.entries(extra)) {
    url.searchParams.set(k, v);
  }

  console.log('[ddsl/client] Outbound request URL:', url.toString());

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

  console.log('[ddsl/client] DDSL Server Status Response:', res.status);

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
// Pagination helper
// ---------------------------------------------------------------------------

// Keeps fetching pages until the server has delivered all rows.
// Termination conditions (either is sufficient):
//   (a) accumulated count has reached the envelope's stated total
//   (b) the last page returned fewer rows than the requested pageSize (final page)
async function fetchAllPages<T>(
  endpoint: string,
  extra: Record<string, string> = {},
  pageSize = 100,
): Promise<T[]> {
  const all: T[] = [];
  let page = 1;

  for (;;) {
    const envelope = await fetchJson<SportLoMoEnvelope<T>>(endpoint, {
      ...extra,
      page:     String(page),
      pageSize: String(pageSize),
    });
    all.push(...envelope.data);
    console.log(
      `[ddsl/client] Page ${page}: received ${envelope.data.length} rows` +
      ` (declared total: ${envelope.total ?? 'unknown'}, accumulated: ${all.length})`,
    );
    if (all.length >= (envelope.total ?? 0) || envelope.data.length < pageSize) break;
    page++;
  }

  console.log(`[ddsl/client] Pagination complete — ${all.length} total rows across ${page} page(s) from ${endpoint}`);
  return all;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Upcoming fixtures for RVR.
 *
 * SportLoMo endpoint: GET /clubs/{clubId}/fixtures
 * Query params: club_id, season, page, pageSize
 */
export async function fetchFixtures(opts: { page?: number; pageSize?: number } = {})
  : Promise<SportLoMoEnvelope<SportLoMoFixture>>
{
  const { clubId } = getConfig();
  return fetchJson<SportLoMoEnvelope<SportLoMoFixture>>(
    `/clubs/${clubId}/fixtures`,
    {
      page:     String(opts.page     ?? 1),
      pageSize: String(opts.pageSize ?? 50),
    },
  );
}

/**
 * Recent results for RVR.
 *
 * SportLoMo endpoint: GET /clubs/{clubId}/results
 */
export async function fetchResults(opts: { page?: number; pageSize?: number } = {})
  : Promise<SportLoMoEnvelope<SportLoMoFixture>>
{
  const { clubId } = getConfig();
  return fetchJson<SportLoMoEnvelope<SportLoMoFixture>>(
    `/clubs/${clubId}/results`,
    {
      page:     String(opts.page     ?? 1),
      pageSize: String(opts.pageSize ?? 50),
    },
  );
}

/**
 * Currently live matches for RVR.
 *
 * SportLoMo endpoint: GET /clubs/{clubId}/live
 * (Some SportLoMo instances expose this as a status filter on /fixtures)
 */
export async function fetchLive(): Promise<SportLoMoEnvelope<SportLoMoFixture>> {
  const { clubId } = getConfig();
  return fetchJson<SportLoMoEnvelope<SportLoMoFixture>>(
    `/clubs/${clubId}/live`,
  );
}

/**
 * League standings for all divisions in which RVR is registered.
 *
 * SportLoMo endpoint: GET /clubs/{clubId}/standings
 * Returns every competition table the club appears in for the active season.
 */
export async function fetchStandings(): Promise<SportLoMoEnvelope<SportLoMoStandingsTable>> {
  const { clubId } = getConfig();
  return fetchJson<SportLoMoEnvelope<SportLoMoStandingsTable>>(
    `/clubs/${clubId}/standings`,
  );
}

// ---------------------------------------------------------------------------
// Paginated bulk fetchers — use these in route handlers to capture all 29
// RVR squads across every active division without hitting the page-size cap.
// ---------------------------------------------------------------------------

/**
 * Fetches ALL fixture pages for the club, walking pagination until exhausted.
 * Covers all active divisions and age groups in a single call sequence.
 */
export async function fetchAllFixtures(): Promise<SportLoMoFixture[]> {
  const { clubId } = getConfig();
  return fetchAllPages<SportLoMoFixture>(`/clubs/${clubId}/fixtures`);
}

/**
 * Fetches ALL result pages for the club, walking pagination until exhausted.
 */
export async function fetchAllResults(): Promise<SportLoMoFixture[]> {
  const { clubId } = getConfig();
  return fetchAllPages<SportLoMoFixture>(`/clubs/${clubId}/results`);
}

/**
 * Fetches ALL standings pages for the club.
 * With 29 active teams across multiple divisions this may span multiple pages.
 */
export async function fetchAllStandings(): Promise<SportLoMoStandingsTable[]> {
  const { clubId } = getConfig();
  return fetchAllPages<SportLoMoStandingsTable>(`/clubs/${clubId}/standings`);
}
