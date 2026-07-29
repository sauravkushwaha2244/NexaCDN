import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {

    res.json({

        server: "Origin Server 2",

        message: "Running"

    });

});

app.get("/data", (req, res) => {

    res.json({

        server: "Origin Server 2",

        content: "Data from Origin Server 2",

        time: new Date()

    });

});

app.listen(9000, () => {

    console.log("Origin Server 2 running on port 9000");

});