const origins = [

    "http://localhost:8000",
    "http://localhost:9000"

];


let current = 0;


function getOrigin(){


    const origin =
        origins[current];


    current =
        (current + 1)
        %
        origins.length;


    return origin;

}


export default getOrigin;