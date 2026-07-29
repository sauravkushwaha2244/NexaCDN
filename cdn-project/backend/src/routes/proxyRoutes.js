import express from "express";

import proxyController from "../controllers/proxyController.js";


const router = express.Router();



router.get("/proxy/data", proxyController.handleProxy);



export default router;