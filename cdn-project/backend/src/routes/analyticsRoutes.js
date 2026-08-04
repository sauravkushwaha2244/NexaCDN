import express from "express";
import axios from "axios";
import analytics from "../analytics/Analytics.js";
import CacheManager from "../cache/CacheManager.js";
import redisCache from "../cache/RedisCache.js";


const router = express.Router();



router.get("/analytics",(req,res)=>{


    res.json(
        analytics.getStats()
    );


});


// Hackathon demo — clears all cache to force a fresh MISS
router.post("/cache/clear", async (req, res) => {
    try {
        await redisCache.clear();
        res.json({ success: true, message: "Cache cleared! Next request will be a MISS." });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});


// Server health status for dashboard
router.get("/servers", async (req, res) => {
    const servers = (process.env.ORIGIN_SERVERS || "")
        .split(",").map(s => s.trim()).filter(Boolean);

    const results = await Promise.all(
        servers.map(async (url) => {
            try {
                const t0 = Date.now();
                await axios.get(url, { timeout: 5000 });
                return { url, healthy: true, responseTime: Date.now() - t0 };
            } catch {
                return { url, healthy: false, responseTime: null };
            }
        })
    );
    res.json(results);
});


export default router;