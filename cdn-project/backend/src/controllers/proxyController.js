import proxyService from "../services/proxyService.js";


class ProxyController {


    async proxy(req,res){


        try {


            const result =
                await proxyService.handleRequest(
                    req.originalUrl
                );



            res
            .status(result.status)
            .set(result.headers)
            .json(result.body);



        }
        catch(error){


            console.log(
                error.message
            );


            res.status(500).json({

                message:
                "Proxy request failed"

            });


        }


    }


}


export default new ProxyController();