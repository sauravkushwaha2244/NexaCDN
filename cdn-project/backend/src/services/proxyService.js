import axios from "axios";
import cacheManager from "../cache/CacheManager.js";
import loadBalancer from "../loadBalancer/LoadBalancer.js";
import analytics from "../analytics/Analytics.js";
import crypto from "crypto";

class ProxyService {
    async handleRequest(path) {
        analytics.request();

        const startTime = Date.now();
        const cacheKey = path;

        const cachedData = await cacheManager.get(cacheKey);

        if (cachedData) {
            analytics.hit();
            console.log("Serving from cache");

            const endTime = Date.now();
            analytics.responseTime(endTime - startTime);

            return cachedData;
        }

        analytics.miss();

        const originPath = path.replace("/proxy", "");
        const server = await loadBalancer.getNextServer();

        console.log("Selected Server:", server);

        analytics.origin();

        const response = await axios.get(`${server}${originPath}`);

        const endTime = Date.now();
        analytics.responseTime(endTime - startTime);

        const etag = crypto
            .createHash("md5")
            .update(JSON.stringify(response.data))
            .digest("hex");

        const data = {
            status: response.status,
            headers: {
                ...response.headers,
                etag: etag,
                "cache-control": "public,max-age=60"
            },
            body: response.data
        };

        await cacheManager.set(cacheKey, data, process.env.CACHE_TTL);

        return data;
    }
}

export default new ProxyService();