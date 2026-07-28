import { createClient } from "redis";

class RedisCache {

    constructor() {
        this.client = createClient({
            url: process.env.REDIS_URL
        });

        this.connected = false;

        this.client.on("error", (err) => {
            console.log("Redis Error:", err.message);
            this.connected = false;
        });
    }


    async connect() {

        try {

            await this.client.connect();

            this.connected = true;

            console.log("Redis connected");

        } catch(error) {

            console.log(
                "Redis unavailable, using memory cache"
            );

            this.connected = false;
        }
    }


    async get(key) {

        if(!this.connected)
            return null;


        return await this.client.get(key);
    }


    async set(key,value,ttl){

        if(!this.connected)
            return;


        await this.client.set(
            key,
            value,
            {
                EX: ttl
            }
        );
    }


    async delete(key){

        if(!this.connected)
            return;


        await this.client.del(key);
    }
}


export default new RedisCache();