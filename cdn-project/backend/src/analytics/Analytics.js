
import {sendAnalytics}
from "../websocket/socket.js";
class Analytics {


    constructor(){

        this.totalRequests = 0;

        this.cacheHits = 0;

        this.cacheMiss = 0;

        this.originRequests = 0;

        this.responseTimes = [];

    }
request(){

    this.totalRequests++;

    sendAnalytics(
        this.getStats()
    );

}


hit(){

    this.cacheHits++;

    sendAnalytics(
        this.getStats()
    );

}


miss(){

    this.cacheMiss++;

    sendAnalytics(
        this.getStats()
    );

}


origin(){

    this.originRequests++;

    sendAnalytics(
        this.getStats()
    );

}


responseTime(time){

    this.responseTimes.push(time);

}



    getStats(){


        const averageResponseTime =
        this.responseTimes.length
        ?
        this.responseTimes.reduce(
            (a,b)=>a+b,0
        )
        /
        this.responseTimes.length
        :
        0;



        return {

            totalRequests:
            this.totalRequests,


            cacheHits:
            this.cacheHits,


            cacheMiss:
            this.cacheMiss,


            originRequests:
            this.originRequests,


            averageResponseTime:
            averageResponseTime.toFixed(2)

        };


    }


}


export default new Analytics();