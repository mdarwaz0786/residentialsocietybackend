import express from "express";
import { createUser, getUser, getUsers, updateUser } from "../controllers/user.controllers.js";
import upload from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post("/create-user", upload.fields([{ name: "profilePhoto", maxCount: 1 }]), createUser);
router.get("/get-all-user", getUsers);
router.get("/get-single-user/:id", getUser);
router.put("/update-user/:id", upload.fields([{ name: "profilePhoto", maxCount: 1 }]), updateUser);

export default router;