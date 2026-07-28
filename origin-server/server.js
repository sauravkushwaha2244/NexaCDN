import express from "express";

const app = express();

app.use(express.json());


app.get("/", (req,res)=>{
    res.json({
        message:"Origin server running 🚀",
        server:"Origin"
    });
});


app.get("/data", (req,res)=>{
    res.json({
        name:"NexaCDN",
        content:"Data from origin server",
        time:new Date()
    });
});


const PORT = 8000;

app.listen(PORT,()=>{
    console.log(`Origin server running on ${PORT}`);
});