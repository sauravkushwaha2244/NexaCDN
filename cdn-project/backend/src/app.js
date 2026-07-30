import express from "express";
import cors from "cors";

import compressionMiddleware from "./compression/Compression.js";
import logger from "./middleware/logger.js";

import analyticsRoutes from "./routes/analyticsRoutes.js";
import proxyRoutes from "./routes/proxyRoutes.js";


const app = express();
app.use(cors());


app.use(express.json());


// Logger
app.use(logger);


// Compression
app.use(compressionMiddleware);


// Analytics route FIRST
app.use("/", analyticsRoutes);


// Proxy route LAST
app.use("/", proxyRoutes);



export default app;