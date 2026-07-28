import app from "./app.js";
import redisCache from "./cache/RedisCache.js";


const PORT = process.env.PORT || 5000;

async function startServer() {

    // Connect to Redis before starting the server
    await redisCache.connect();

    app.listen(PORT, () => {
        console.log(`NexaCDN running on port ${PORT}`);
    });

}

startServer();