import axios from "axios";

import CacheManager from "../cache/CacheManager.js";

import getOrigin, {
    reportSuccess,
    reportFailure
} from "../loadBalancer/OriginBalancer.js";


class ProxyController {


    async handleProxy(req, res) {


        const cacheKey = req.originalUrl;


        try {


            const cachedData =
            await CacheManager.get(cacheKey);



            if(cachedData){


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


        }
        catch(err){


            console.log(
                "Cache lookup failed:",
                err.message
            );


        }



        console.log("CACHE MISS");



        const path =
        req.originalUrl.replace(
            "/proxy",
            ""
        );



        const maxAttempts = 2;



        for(
            let attempt=0;
            attempt<maxAttempts;
            attempt++
        ){


            const origin =
            getOrigin();



            const targetURL =
            origin + path;



            try{


                console.log(
                    "Request sent to:",
                    targetURL
                );



                const response =
                await axios.get(
                    targetURL,
                    {
                        timeout:3000
                    }
                );



                reportSuccess(origin);



                await CacheManager.set(
                    cacheKey,
                    response.data,
                    300
                );



                res.setHeader(
                    "X-Cache",
                    "MISS"
                );



                return res.json({

                    source:"origin",

                    originServer:origin,

                    data:response.data

                });


            }
            catch(error){


                console.log(
                    `Origin ${origin} failed:`,
                    error.message
                );


                reportFailure(origin);


            }


        }



        res.status(502).json({

            error:"Origin server unavailable"

        });


    }


}


export default new ProxyController();