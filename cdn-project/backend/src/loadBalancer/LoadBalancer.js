import healthChecker 
from "../healthCheck/HealthChecker.js";


class LoadBalancer {


    constructor(){

        this.servers =
        process.env.ORIGIN_SERVERS.split(",");

        this.currentIndex=0;

    }



    async getNextServer(){


        const healthyServers =
        await healthChecker.updateServers(
            this.servers
        );


        if(healthyServers.length===0){

            throw new Error(
                "No healthy servers available"
            );

        }



        const server =
        healthyServers[this.currentIndex];



        this.currentIndex =
        (this.currentIndex+1)
        %
        healthyServers.length;



        return server;


    }


}


export default new LoadBalancer();