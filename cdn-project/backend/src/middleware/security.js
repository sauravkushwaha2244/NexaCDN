import blockedAgents from "../security/blockedAgents.js";


function securityMiddleware(req,res,next){


    const userAgent =
    req.headers["user-agent"]
    ||
    "";



    const blocked =
    blockedAgents.some(agent=>

        userAgent
        .toLowerCase()
        .includes(agent)

    );



    if(blocked){


        console.log(
            "Blocked User Agent:",
            userAgent
        );


        return res.status(403)
        .json({

            error:
            "Request blocked"

        });


    }



    next();


}


export default securityMiddleware;