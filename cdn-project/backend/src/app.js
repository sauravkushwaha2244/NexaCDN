import express from "express";
import cors from "cors";

import compressionMiddleware from "./compression/Compression.js";
import logger from "./middleware/logger.js";
import rateLimiter from "./middleware/rateLimiter.js";
import securityMiddleware from "./middleware/security.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import proxyRoutes from "./routes/proxyRoutes.js";

const app = express();

// Allow frontend to call backend APIs
app.use(cors({
    origin: [
        process.env.FRONTEND_URL || "http://localhost:5173",
        "http://localhost:5173"
    ],
    methods: ["GET", "POST", "DELETE", "OPTIONS"]
}));

app.use(express.json());
app.use(rateLimiter);
app.use(securityMiddleware);
app.use(logger);
app.use(compressionMiddleware);

// Root health check — required for Render deployments
app.get("/", (req, res) => {
    res.json({ status: "ok", service: "NexaCDN", version: "1.0.0" });
});

app.use("/", analyticsRoutes);
app.use("/", proxyRoutes);

export default app;