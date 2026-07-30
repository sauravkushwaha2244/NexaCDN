import rateLimit from "express-rate-limit";


const limiter = rateLimit({

    windowMs: 60 * 1000,

    max: 100,

    message: {

        error:
        "Too many requests. Try again later."

    }


});


export default limiter;