const SITE_URL = 'https://www.rivervalleyrangers.ie';
const HOST = 'www.rivervalleyrangers.ie';

// Public by design — IndexNow verifies ownership via the hosted key file,
// which must match: public/{key}.txt
export const INDEXNOW_KEY = '5d2b8d6ba18dbc6ce868c8cafe032d46';

/**
 * Notify IndexNow-participating engines (Bing, Yandex, Seznam, Naver) that
 * URLs changed. Fire-and-forget: never throws, never blocks the publish flow.
 * Google does not support IndexNow — it discovers via the sitemap instead.
 */
export async function pingIndexNow(paths: string[]): Promise<void> {
  if (process.env.VERCEL_ENV !== 'production') return;
  try {
    await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: paths.map((p) => `${SITE_URL}${p}`),
      }),
    });
  } catch {
    // Non-critical — the sitemap still covers discovery
  }
}
