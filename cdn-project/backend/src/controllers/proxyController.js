import axios from "axios";
import CacheManager from "../cache/CacheManager.js";
import getOrigin, {
    reportSuccess,
    reportFailure
} from "../loadBalancer/OriginBalancer.js";
import {
    sendRequestLog,
    sendAnalytics
} from "../websocket/socket.js";
import analytics from "../analytics/Analytics.js";

class ProxyController {
    async handleProxy(req, res) {
        const startTime = Date.now();
        const cacheKey = req.originalUrl;

        analytics.request();

        try {
            const cachedData = await CacheManager.get(cacheKey);

            if (cachedData) {
                console.log("CACHE HIT");
                analytics.hit();

                const responseTime = Date.now() - startTime;
                analytics.responseTime(responseTime);

                sendRequestLog({
                    time: new Date().toLocaleTimeString(),
                    url: req.originalUrl,
                    source: "cache",
                    server: "-",
                    responseTime
                });

                sendAnalytics(analytics.getStats());

                res.setHeader("X-Cache", "HIT");

                return res.json({
                    source: "cache",
                    data: cachedData
                });
            }
        } catch (error) {
            console.log("Cache Error:", error.message);
        }

        console.log("CACHE MISS");
        analytics.miss();

        const path = req.originalUrl.replace("/proxy", "");
        const maxAttempts = 2;

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const origin = getOrigin();
            const targetURL = origin + path;

            try {
                console.log("Request sent to:", targetURL);

                const response = await axios.get(targetURL, {
                    timeout: 3000
                });

                reportSuccess(origin);
                analytics.origin();

                const responseTime = Date.now() - startTime;
                analytics.responseTime(responseTime);

                await CacheManager.set(cacheKey, response.data, 300);

                sendRequestLog({
                    time: new Date().toLocaleTimeString(),
                    url: req.originalUrl,
                    source: "origin",
                    server: origin,
                    responseTime
                });

                sendAnalytics(analytics.getStats());

                res.setHeader("X-Cache", "MISS");

                return res.json({
                    source: "origin",
                    originServer: origin,
                    data: response.data
                });
            } catch (error) {
                console.log(`Origin ${origin} failed:`, error.message);
                reportFailure(origin);
            }
        }

        res.status(502).json({
            error: "Origin server unavailable"
        });
    }
}

export default new ProxyController();