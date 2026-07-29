import express from "express";

import analytics from "../analytics/Analytics.js";


const router = express.Router();



router.get("/analytics",(req,res)=>{


    res.json(
        analytics.getStats()
    );


});



export default router;