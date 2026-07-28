import express from "express";
import dotenv from "dotenv";
import compression from "compression";
import proxyRoutes from "./routes/proxyRoutes.js";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Enable Gzip Compression
app.use(compression());

// Health check route
app.get("/", (req, res) => {
    res.json({
        message: "NexaCDN Running"
    });
});

// Reverse Proxy Route
app.use("/proxy", proxyRoutes);

// Error handling middleware
app.use((err, req, res, next) => {

    console.error(err.message);

    res.status(500).json({
        message: "Internal Server Error"
    });

});

export default app;