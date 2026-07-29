import compression from "compression";


const compressionMiddleware =
compression({
    level:6
});


export default compressionMiddleware;