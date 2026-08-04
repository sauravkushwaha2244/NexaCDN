import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {

    res.json({

        server: "Origin Server 1",

        message: "Running"

    });

});

app.get("/data", (req, res) => {

    res.json({

        server: "Origin Server 1",

        content: "Data from Origin Server 1",

        time: new Date()

    });

});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {

    console.log(`Origin Server 1 running on port ${PORT}`);

});