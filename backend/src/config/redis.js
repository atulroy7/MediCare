import Redis from 'ioredis';

let client = null;

export const connectRedis = () => {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    if (!url) {
        console.warn('⚠️  UPSTASH_REDIS_REST_URL missing — caching disabled.');
        return;
    }

    try {
        client = new Redis(url, {
            maxRetriesPerRequest: 3,
            retryStrategy: (times) => Math.min(times * 200, 2000),
        });

        client.on('connect', () => console.log('✅ Redis connected'));
        client.on('error', (err) => console.error('❌ Redis error:', err.message));
    } catch (err) {
        console.error('❌ Redis connection failed:', err.message);
    }
};

/**
 * Returns the Redis client instance, or null if not connected.
 */
export const getRedisClient = () => client;

// ─── Cache helpers ────────────────────────────────────────────────────────────

const DEFAULT_TTL = 600; // 10 minutes

/**
 * Get a cached value by key. Returns parsed JSON or null.
 */
export const cacheGet = async (key) => {
    if (!client) return null;
    try {
        const data = await client.get(key);
        return data ? JSON.parse(data) : null;
    } catch {
        return null;
    }
};

/**
 * Set a cache value with optional TTL (default 10 minutes).
 */
export const cacheSet = async (key, value, ttl = DEFAULT_TTL) => {
    if (!client) return;
    try {
        await client.set(key, JSON.stringify(value), 'EX', ttl);
    } catch {
        // Silently fail — caching is best-effort
    }
};

/**
 * Delete a specific cache key.
 */
export const cacheDel = async (key) => {
    if (!client) return;
    try {
        await client.del(key);
    } catch {
        // Silently fail
    }
};

/**
 * Invalidate all cache keys matching a glob pattern.
 * Useful for clearing all product listing caches when a product changes.
 *
 * @param {string} pattern - Redis SCAN glob pattern, e.g. "products_*"
 */
export const cacheInvalidatePattern = async (pattern) => {
    if (!client) return;
    try {
        let cursor = '0';
        do {
            const [nextCursor, keys] = await client.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
            cursor = nextCursor;
            if (keys.length > 0) {
                await client.del(...keys);
            }
        } while (cursor !== '0');
    } catch {
        // Silently fail
    }
};
