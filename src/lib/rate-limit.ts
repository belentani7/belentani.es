const limits = new Map<string, { count: number; reset: number }>();

export function rateLimit(key: string, endpoint: string, max = 10, windowMs = 60_000): boolean {
  const now = Date.now();
  const limitKey = `${endpoint}:${key}`;
  const record = limits.get(limitKey);

  if (!record || now > record.reset) {
    limits.set(limitKey, { count: 1, reset: now + windowMs });
    return true;
  }

  if (record.count >= max) return false;
  record.count++;
  return true;
}

export function getRateLimitInfo(key: string, endpoint: string) {
  const record = limits.get(`${endpoint}:${key}`);
  if (!record) return { remaining: 10, reset: 0 };
  return { remaining: Math.max(0, 10 - record.count), reset: record.reset };
}