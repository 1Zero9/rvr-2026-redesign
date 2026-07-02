/**
 * ClubZap API client — membership and payments.
 *
 * Required environment variables (once the API key is issued):
 *   CLUBZAP_BASE_URL   – e.g. https://api.clubzap.com
 *   CLUBZAP_APP_ID     – Client Application ID issued by ClubZap
 *   CLUBZAP_JWT        – JSON Web Token issued by ClubZap
 *   CLUBZAP_CLUB_ID    – RVR's numeric club ID in the ClubZap system
 *
 * In the meantime, checkout flows are handled via the ClubZapCheckoutModal
 * component which embeds the ClubZap-hosted payment pages in an iframe.
 * See config/payments.ts for the URL map.
 *
 * Contact support@clubzap.com with API endpoint documentation before
 * expanding this file beyond the auth scaffolding below.
 */

import type { ClubZapCredentials } from './types';

// ─── Auth ─────────────────────────────────────────────────────────────────────

export function getCredentials(): ClubZapCredentials | null {
  const appId   = process.env.CLUBZAP_APP_ID;
  const jwt     = process.env.CLUBZAP_JWT;
  const clubId  = process.env.CLUBZAP_CLUB_ID;
  const baseUrl = process.env.CLUBZAP_BASE_URL;

  if (!appId || !jwt || !clubId || !baseUrl) return null;

  return { appId, jwt, clubId, baseUrl: baseUrl.replace(/\/$/, '') };
}

export function isClubZapConfigured(): boolean {
  return getCredentials() !== null;
}

// ─── Shared fetch helper ──────────────────────────────────────────────────────

export class ClubZapApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ClubZapApiError';
  }
}

const API_VERSION = process.env.CLUBZAP_API_VERSION ?? '4';

export async function clubZapFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const creds = getCredentials();
  if (!creds) throw new ClubZapApiError(0, 'ClubZap credentials not configured');

  const url = `${creds.baseUrl}${path}`;

  const res = await fetch(url, {
    ...init,
    headers: {
      'X-ClubZap-App-Id': creds.appId,
      'X-ClubZap-JWT':    creds.jwt,
      'Accept':           `application/json; version=${API_VERSION}`,
      'Content-Type':     'application/json',
      ...(init.headers ?? {}),
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new ClubZapApiError(res.status, `ClubZap API ${res.status} on ${path}`);
  }

  return res.json() as Promise<T>;
}
