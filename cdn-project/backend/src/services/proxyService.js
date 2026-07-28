import axios from "axios";
import cacheManager from "../cache/CacheManager.js";


class ProxyService {


    async handleRequest(path) {


        const cacheKey = path;


        // 1. Check cache first
        const cachedData =
            await cacheManager.get(cacheKey);



        if(cachedData){

            console.log(
                "Serving from cache:",
                path
            );


            return cachedData;

        }



        console.log(
            "Fetching from origin:",
            path
        );



        // 2. Fetch data from origin server

        const response =
            await axios.get(
                `${process.env.ORIGIN_SERVER}${path}`,
                {
                    responseType:"json"
                }
            );



        const data = {

            status: response.status,

            headers: response.headers,

            body: response.data

        };



        // 3. Store response in cache

        await cacheManager.set(
            cacheKey,
            data,
            process.env.CACHE_TTL
        );



        return data;


    }


}


export default new ProxyService();