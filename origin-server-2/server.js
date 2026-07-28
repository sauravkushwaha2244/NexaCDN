import express from "express";

const app = express();


app.get("/data",(req,res)=>{

    res.json({

        server:"Origin Server 2",
        message:"Backup data"

    });

});


app.listen(9000,()=>{

    console.log(
        "Origin server 2 running on 9000"
    );

});