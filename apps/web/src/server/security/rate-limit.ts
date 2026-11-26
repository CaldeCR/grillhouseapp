/**
 * Rate Limiter en memoria con ventana deslizante para proteger inicios de sesión y peticiones sensibles.
 */
interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const memoryStore = new Map<string, RateLimitRecord>();

export function checkRateLimit(
  key: string,
  maxAttempts: number = 5,
  windowSeconds: number = 60
): { allowed: boolean; remaining: number; retryAfterSeconds: number } {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const record = memoryStore.get(key);

  if (!record || now > record.resetAt) {
    memoryStore.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      allowed: true,
      remaining: maxAttempts - 1,
      retryAfterSeconds: 0,
    };
  }

  if (record.count >= maxAttempts) {
    const retryAfterSeconds = Math.ceil((record.resetAt - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(retryAfterSeconds, 1),
    };
  }

  record.count += 1;
  return {
    allowed: true,
    remaining: maxAttempts - record.count,
    retryAfterSeconds: 0,
  };
}
