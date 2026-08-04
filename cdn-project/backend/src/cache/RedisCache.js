import Redis from "ioredis";

class RedisCache {

    constructor() {
        this.redis = new Redis({
            host: process.env.REDIS_HOST || "127.0.0.1",
            port: process.env.REDIS_PORT || 6379
        });

        this.redis.on("connect", () => {
            console.log("Redis connected");
        });

        this.redis.on("error", (error) => {
            console.log("Redis error:", error.message);
        });
    }


    async get(key) {
        try {
            const data = await this.redis.get(key);

            if (!data) {
                return null;
            }

            return JSON.parse(data);

        } catch (error) {
            console.log("Redis GET error:", error.message);
            return null;
        }
    }


    async set(key, value, ttl = 300) {
        try {
            await this.redis.set(
                key,
                JSON.stringify(value),
                "EX",
                ttl
            );

        } catch (error) {
            console.log("Redis SET error:", error.message);
        }
    }


    async delete(key) {
        try {
            await this.redis.del(key);

        } catch (error) {
            console.log("Redis DELETE error:", error.message);
        }
    }


    async clear() {
        try {
            await this.redis.flushall();

        } catch (error) {
            console.log("Redis CLEAR error:", error.message);
        }
    }


    async connect() {
        try {
            await this.redis.ping();
            this.connected = true;
            console.log("Redis server ready");

        } catch (error) {
            this.connected = false;
            console.warn("Redis unavailable — running without cache:", error.message);
        }
    }
}


const redisCache = new RedisCache();

export default redisCache;