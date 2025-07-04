import express from "express";
import { loggedInUser, loginUser } from "../controllers/auth.controllers.js";
import isLoggedIn from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/login-user", loginUser);
router.get("/loggedin-user", isLoggedIn, loggedInUser);

export default router;