import express from "express";
import { loggedInUser, loginUser, registerUser } from "../controllers/auth.controllers.js";
import isLoggedIn from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/register-user", registerUser);
router.get("/login-user", loginUser);
router.get("/loggedin-user", isLoggedIn, loggedInUser);

export default router;