import axios from "axios";


class HealthChecker {


    constructor(){

        this.healthyServers = [];

    }



    async checkServer(server){


        try {


            await axios.get(server);


            return true;


        }

        catch(error){


            return false;


        }


    }



    async updateServers(servers){


        this.healthyServers = [];


        for(const server of servers){


            const status =
                await this.checkServer(server);



            if(status){


                this.healthyServers.push(server);


            }


        }


        return this.healthyServers;


    }



    getHealthyServers(){


        return this.healthyServers;


    }


}


export default new HealthChecker();