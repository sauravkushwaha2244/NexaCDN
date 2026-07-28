import { LRUCache } from "lru-cache";


const cache = new LRUCache({
    max: 500,
    ttl: 1000 * 60 * 5
});


const memoryCache = {

    get(key){
        return cache.get(key);
    },


    set(key,value){
        cache.set(key,value);
    },


    delete(key){
        cache.delete(key);
    }

};


export default memoryCache;