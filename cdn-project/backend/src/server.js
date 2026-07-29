import "dotenv/config";

import app from "./app.js";
import redisCache from "./cache/RedisCache.js";
import healthChecker from "./healthCheck/HealthChecker.js";


const PORT = process.env.PORT || 5000;


async function startServer(){


    await redisCache.connect();



    setInterval(async()=>{


        const servers =
        process.env.ORIGIN_SERVERS.split(",");



        const healthyServers =
        await healthChecker.updateServers(
            servers
        );


        console.log(
            "Healthy Servers:",
            healthyServers
        );


    },10000);



    app.listen(PORT,()=>{

        console.log(
            `NexaCDN running on port ${PORT}`
        );

    });


}


startServer();