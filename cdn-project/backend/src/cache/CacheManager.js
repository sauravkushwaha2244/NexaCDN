import redisCache from "./RedisCache.js";
import memoryCache from "./MemoryCache.js";

class CacheManager {
    async get(key) {
        const redisData = await redisCache.get(key);

        if (redisData) {
            console.log("Redis Cache Hit");
            return JSON.parse(redisData);
        }

        const memoryData = memoryCache.get(key);

        if (memoryData) {
            console.log("Memory Cache Hit");
            return memoryData;
        }

        console.log("Cache Miss");
        return null;
    }

    async set(key, data, ttl) {
        const value = JSON.stringify(data);

        await redisCache.set(key, value, ttl);
        memoryCache.set(key, data);
    }

    async delete(key) {
        await redisCache.delete(key);
        memoryCache.delete(key);
    }
}

export default new CacheManager();