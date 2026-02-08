import redis from "./redis";

export interface RateLimitConfig {
    interval: number; // in seconds
    limit: number; // max requests per interval
}

export const rateLimit = async (ip: string, config: RateLimitConfig = { interval: 60, limit: 100 }) => {
    const key = `rate-limit:${ip}`;

    const current = await redis.incr(key);

    if (current === 1) {
        await redis.expire(key, config.interval);
    }

    return {
        success: current <= config.limit,
        limit: config.limit,
        remaining: Math.max(0, config.limit - current),
        reset: (await redis.ttl(key))
    };
};
