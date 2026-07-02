/**
 * ClubZap API client.
 *
 * Required environment variables (once your API key arrives):
 *   CLUBZAP_BASE_URL   – e.g. https://api.clubzap.com
 *   CLUBZAP_APP_ID     – Client Application ID issued by ClubZap
 *   CLUBZAP_JWT        – JSON Web Token issued by ClubZap
 *   CLUBZAP_CLUB_ID    – RVR's numeric club ID in the ClubZap system
 *
 * Optional:
 *   CLUBZAP_API_VERSION – defaults to "4" (current stable version)
 *
 * The client soft-fails (returns null / empty arrays) when credentials are
 * absent, so the site builds and runs cleanly while the API key is pending.
 *
 * ClubZap recommends caching responses for no longer than 48 hours.
 * All requests are sent cache: 'no-store' so Next.js doesn't cache beyond
 * the 48-hour revalidate set at the call site.
 */

import type {
  ClubZapPage,
  ClubZapArticleSummary,
  ClubZapArticle,
  ClubZapFixture,
  ClubZapResult,
  ClubZapCredentials,
} from './types';

// ─── Config ───────────────────────────────────────────────────────────────────

function getCredentials(): ClubZapCredentials | null {
  const appId   = process.env.CLUBZAP_APP_ID;
  const jwt     = process.env.CLUBZAP_JWT;
  const clubId  = process.env.CLUBZAP_CLUB_ID;
  const baseUrl = process.env.CLUBZAP_BASE_URL;

  if (!appId || !jwt || !clubId || !baseUrl) {
    if (process.env.NODE_ENV !== 'test') {
      console.warn(
        '[clubzap/client] Credentials not yet configured — CLUBZAP_APP_ID, CLUBZAP_JWT, ' +
        'CLUBZAP_CLUB_ID, and CLUBZAP_BASE_URL must all be set. ' +
        'Returning empty data until API key is issued.',
      );
    }
    return null;
  }

  return { appId, jwt, clubId, baseUrl: baseUrl.replace(/\/$/, '') };
}

const API_VERSION = process.env.CLUBZAP_API_VERSION ?? '4';

// ─── Errors ───────────────────────────────────────────────────────────────────

export class ClubZapApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly body?: string,
  ) {
    super(message);
    this.name = 'ClubZapApiError';
  }
}

// ─── HTTP fetch wrapper ───────────────────────────────────────────────────────

async function fetchJson<T>(
  creds: ClubZapCredentials,
  path: string,
  params: Record<string, string> = {},
): Promise<T> {
  const url = new URL(`${creds.baseUrl}${path}`);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }

  let res: Response;
  try {
    res = await fetch(url.toString(), {
      headers: {
        'X-ClubZap-App-Id': creds.appId,
        'X-ClubZap-JWT':    creds.jwt,
        'Accept':           `application/json; version=${API_VERSION}`,
      },
      cache: 'no-store',
    });
  } catch (err) {
    throw new ClubZapApiError(
      0,
      `Network error reaching ClubZap: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  if (res.status === 401 || res.status === 403) {
    throw new ClubZapApiError(res.status, 'ClubZap authentication failed — check CLUBZAP_APP_ID and CLUBZAP_JWT');
  }
  if (res.status === 404) {
    throw new ClubZapApiError(res.status, `ClubZap resource not found: ${path}`);
  }
  if (res.status === 422) {
    const body = await res.text().catch(() => '');
    throw new ClubZapApiError(res.status, `ClubZap rejected the request (422 Unprocessable): ${path}`, body);
  }

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new ClubZapApiError(res.status, `ClubZap API returned ${res.status} ${res.statusText}`, body);
  }

  try {
    return (await res.json()) as T;
  } catch {
    throw new ClubZapApiError(res.status, 'ClubZap returned a non-JSON response');
  }
}

// ─── Pagination helper ────────────────────────────────────────────────────────

async function fetchAllPages<T>(
  creds: ClubZapCredentials,
  path: string,
  perPage = 100,
): Promise<T[]> {
  const all: T[] = [];
  let page = 1;

  for (;;) {
    const envelope = await fetchJson<ClubZapPage<T>>(creds, path, {
      page:     String(page),
      per_page: String(perPage),
    });
    all.push(...envelope.data);
    if (all.length >= envelope.total || envelope.data.length < perPage) break;
    page++;
  }

  return all;
}

// ─── Articles ─────────────────────────────────────────────────────────────────

/**
 * Returns the latest articles for the club (most recent first).
 * Returns an empty array if credentials are not yet configured.
 */
export async function fetchArticles(opts: { page?: number; perPage?: number } = {}): Promise<ClubZapPage<ClubZapArticleSummary> | null> {
  const creds = getCredentials();
  if (!creds) return null;

  return fetchJson<ClubZapPage<ClubZapArticleSummary>>(creds, `/clubs/${creds.clubId}/articles`, {
    page:     String(opts.page    ?? 1),
    per_page: String(opts.perPage ?? 20),
  });
}

/**
 * Returns all articles, walking pagination.
 */
export async function fetchAllArticles(): Promise<ClubZapArticleSummary[]> {
  const creds = getCredentials();
  if (!creds) return [];
  return fetchAllPages<ClubZapArticleSummary>(creds, `/clubs/${creds.clubId}/articles`);
}

/**
 * Returns a single article with full markdown content.
 * Returns null if credentials are absent or article is not found.
 */
export async function fetchArticle(articleId: number): Promise<ClubZapArticle | null> {
  const creds = getCredentials();
  if (!creds) return null;

  try {
    return await fetchJson<ClubZapArticle>(creds, `/articles/${articleId}`);
  } catch (err) {
    if (err instanceof ClubZapApiError && err.status === 404) return null;
    throw err;
  }
}

/**
 * Increments the view count for an article.
 * Fire-and-forget — swallows errors so a failed increment never breaks a page load.
 */
export async function incrementArticleViews(articleId: number): Promise<void> {
  const creds = getCredentials();
  if (!creds) return;

  const url = `${creds.baseUrl}/articles/${articleId}/views`;
  try {
    await fetch(url, {
      method: 'POST',
      headers: {
        'X-ClubZap-App-Id': creds.appId,
        'X-ClubZap-JWT':    creds.jwt,
        'Accept':           `application/json; version=${API_VERSION}`,
        'Content-Type':     'application/json',
      },
      body: JSON.stringify({ increment: 1 }),
      cache: 'no-store',
    });
  } catch {
    // Swallow — view counts are best-effort
  }
}

// ─── Fixtures ─────────────────────────────────────────────────────────────────

/**
 * Returns upcoming fixtures for the club.
 * Returns null if credentials are not yet configured.
 */
export async function fetchFixtures(opts: { page?: number; perPage?: number } = {}): Promise<ClubZapPage<ClubZapFixture> | null> {
  const creds = getCredentials();
  if (!creds) return null;

  return fetchJson<ClubZapPage<ClubZapFixture>>(creds, `/clubs/${creds.clubId}/fixtures`, {
    page:     String(opts.page    ?? 1),
    per_page: String(opts.perPage ?? 50),
  });
}

/**
 * Returns all upcoming fixtures, walking pagination.
 */
export async function fetchAllFixtures(): Promise<ClubZapFixture[]> {
  const creds = getCredentials();
  if (!creds) return [];
  return fetchAllPages<ClubZapFixture>(creds, `/clubs/${creds.clubId}/fixtures`);
}

/**
 * Returns a single fixture by ID.
 */
export async function fetchFixture(fixtureId: number): Promise<ClubZapFixture | null> {
  const creds = getCredentials();
  if (!creds) return null;

  try {
    return await fetchJson<ClubZapFixture>(creds, `/fixtures/${fixtureId}`);
  } catch (err) {
    if (err instanceof ClubZapApiError && err.status === 404) return null;
    throw err;
  }
}

// ─── Results ──────────────────────────────────────────────────────────────────

/**
 * Returns recent results for the club.
 * Returns null if credentials are not yet configured.
 */
export async function fetchResults(opts: { page?: number; perPage?: number } = {}): Promise<ClubZapPage<ClubZapResult> | null> {
  const creds = getCredentials();
  if (!creds) return null;

  return fetchJson<ClubZapPage<ClubZapResult>>(creds, `/clubs/${creds.clubId}/results`, {
    page:     String(opts.page    ?? 1),
    per_page: String(opts.perPage ?? 50),
  });
}

/**
 * Returns all recent results, walking pagination.
 */
export async function fetchAllResults(): Promise<ClubZapResult[]> {
  const creds = getCredentials();
  if (!creds) return [];
  return fetchAllPages<ClubZapResult>(creds, `/clubs/${creds.clubId}/results`);
}

/**
 * Returns a single result by ID.
 */
export async function fetchResult(resultId: number): Promise<ClubZapResult | null> {
  const creds = getCredentials();
  if (!creds) return null;

  try {
    return await fetchJson<ClubZapResult>(creds, `/results/${resultId}`);
  } catch (err) {
    if (err instanceof ClubZapApiError && err.status === 404) return null;
    throw err;
  }
}

// ─── Health check ─────────────────────────────────────────────────────────────

/**
 * Returns true if all required credentials are present (does not verify them
 * against the API — call fetchArticles() for a live check).
 */
export function isClubZapConfigured(): boolean {
  return getCredentials() !== null;
}
