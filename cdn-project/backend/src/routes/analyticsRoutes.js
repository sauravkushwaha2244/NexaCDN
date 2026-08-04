import express from "express";

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



export default router;