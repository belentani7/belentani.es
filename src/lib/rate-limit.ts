const WINDOW_MS = 60_000;
const MAX_REQUESTS = 20;

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

function key(ip: string, route: string): string {
  return `${ip}::${route}`;
}

/**
 * Fixed-window in-memory rate limiter.
 * Returns `true` when the request is allowed, `false` when it must be throttled.
 * Usable from Node or Edge runtimes; state is per-instance.
 */
export function rateLimit(ip: string, route: string): boolean {
  const now = Date.now();
  const k = key(ip, route);
  const bucket = buckets.get(k);

  if (!bucket || now >= bucket.resetAt) {
    buckets.set(k, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (bucket.count >= MAX_REQUESTS) return false;
  bucket.count += 1;
  return true;
}
