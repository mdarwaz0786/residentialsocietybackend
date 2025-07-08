import express from "express";
import { loggedInUser, loginUser, registerUser } from "../controllers/auth.controllers.js";
import isLoggedIn from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import validateFileSize from "../middlewares/validateFileSize.middleware.js";

const router = express.Router();

router.post("/register-user", upload.fields([{ name: "profilePhoto", maxCount: 1 }]), validateFileSize, registerUser);
router.post("/login-user", loginUser);
router.get("/loggedin-user", isLoggedIn, loggedInUser);

export default router;