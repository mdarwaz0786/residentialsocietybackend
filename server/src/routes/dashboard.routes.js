import express from "express";
import { getDashboardStats } from "../controllers/dashboard.controllers.js";
import isLoggedIn from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get(
  "/stats",
  isLoggedIn,
  getDashboardStats,
);

export default router;
