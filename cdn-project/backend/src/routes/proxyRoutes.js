import express from "express";
import axios from "axios";
import CacheManager from "../cache/CacheManager.js";
import getOrigin from "../loadBalancer/OriginBalancer.js";


const router = express.Router();



router.use("/", async (req, res) => {


    const cacheKey = req.originalUrl;



    // Check Cache

    const cachedData =
        await CacheManager.get(cacheKey);



    if (cachedData) {


        console.log("CACHE HIT");


        res.setHeader(
            "X-Cache",
            "HIT"
        );


        return res.json({

            source:"cache",
            data:cachedData

        });

    }



    console.log("CACHE MISS");



    try {


        // Select Origin Server

        const origin =
            getOrigin();



        console.log(
            "Request sent to:",
            origin
        );



        const targetURL =
            origin +
            req.originalUrl.replace(
                "/proxy",
                ""
            );



        // Fetch from Origin

        const response =
            await axios.get(targetURL);



        // Store response in cache

        await CacheManager.set(
            cacheKey,
            response.data,
            300
        );



        res.setHeader(
            "X-Cache",
            "MISS"
        );



        res.json({

            source:"origin",
            originServer:origin,
            data:response.data

        });



    }
    catch(error){


        console.log(error.message);


        res.status(500).json({

            error:"Origin server unavailable"

        });


    }


});


export default router;