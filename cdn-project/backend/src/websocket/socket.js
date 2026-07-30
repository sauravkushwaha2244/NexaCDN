import { Server } from "socket.io";


let io;


export function initSocket(server){


    io = new Server(server,{

        cors:{

            origin:"http://localhost:5173",

            methods:[
                "GET",
                "POST"
            ]

        }

    });



    io.on(
        "connection",
        (socket)=>{


            console.log(
                "Dashboard connected:",
                socket.id
            );


        }
    );


}



export function sendAnalytics(data){


    if(io){

        io.emit(
            "analyticsUpdate",
            data
        );

    }


}



export function sendRequestLog(data){


    if(io){


        io.emit(
            "requestUpdate",
            data
        );


    }


}