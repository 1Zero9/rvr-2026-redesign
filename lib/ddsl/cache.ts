/**
 * Module-level in-process cache.
 *
 * In Next.js the Node.js process is long-lived across requests, so this Map
 * survives between calls and acts as a reliable 15-minute response buffer.
 * In dev mode HMR may reset the module — acceptable; the first request after
 * a code change will just make a fresh SportLoMo call.
 *
 * Replace with a Redis adapter (ioredis / @upstash/redis) by swapping the
 * get/set implementations below — the call-sites are unchanged.
 */

const TTL_MS = 15 * 60 * 1000; // 15 minutes

interface Entry<T> {
  data: T;
  cachedAt: number;
  expiresAt: number;
}

const store = new Map<string, Entry<unknown>>();

export function cacheGet<T>(key: string): (Entry<T> & { hit: true }) | { hit: false } {
  const entry = store.get(key) as Entry<T> | undefined;
  if (!entry) return { hit: false };
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return { hit: false };
  }
  return { ...entry, hit: true };
}

export function cacheSet<T>(key: string, data: T): Entry<T> {
  const now = Date.now();
  const entry: Entry<T> = { data, cachedAt: now, expiresAt: now + TTL_MS };
  store.set(key, entry as Entry<unknown>);
  return entry;
}

export function cacheInvalidate(key: string): void {
  store.delete(key);
}

export function cachePurgeExpired(): void {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.expiresAt) store.delete(key);
  }
}

export function cacheStats(): { size: number; keys: string[] } {
  return { size: store.size, keys: [...store.keys()] };
}

export { TTL_MS };
