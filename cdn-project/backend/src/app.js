import express from "express";

import compressionMiddleware from "./compression/Compression.js";
import logger from "./middleware/logger.js";
import rateLimiter from "./middleware/rateLimiter.js";
import securityMiddleware from "./middleware/security.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import proxyRoutes from "./routes/proxyRoutes.js";

const app = express();

app.use(express.json());
app.use(rateLimiter);
app.use(securityMiddleware);
app.use(logger);
app.use(compressionMiddleware);
app.use("/", analyticsRoutes);
app.use("/", proxyRoutes);

export default app;