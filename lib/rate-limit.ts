/**
 * In-memory sliding-window rate limiter, keyed by client IP.
 * Adequate for a single-instance/serverless-warm deployment; note that on
 * serverless each cold instance starts fresh — acceptable for this form's
 * threat model (slows bursts; the honeypot handles dumb bots).
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

const hits = new Map<string, number[]>();

export function rateLimit(key: string, now = Date.now()): { allowed: boolean } {
  const windowStart = now - WINDOW_MS;
  const recent = (hits.get(key) ?? []).filter((t) => t > windowStart);
  if (recent.length >= MAX_REQUESTS) {
    hits.set(key, recent);
    return { allowed: false };
  }
  recent.push(now);
  hits.set(key, recent);
  // Opportunistic cleanup so the map cannot grow unbounded.
  if (hits.size > 10_000) {
    for (const [k, v] of hits) {
      if (v.every((t) => t <= windowStart)) hits.delete(k);
    }
  }
  return { allowed: true };
}
