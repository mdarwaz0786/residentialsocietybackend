import express from "express";
import { testController } from "../controllers/test.controllers.js";

// router object
const router = express.Router();

// routes
router.get("/test", testController);

export default router;