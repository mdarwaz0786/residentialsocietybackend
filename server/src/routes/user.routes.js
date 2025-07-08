import express from "express";
import { createUser, getUser, getUsers, softDeleteUser, softDeleteUsers, updateUser } from "../controllers/user.controllers.js";
import upload from "../middlewares/multer.middleware.js";
import isLoggedIn from "../middlewares/auth.middleware.js";
import checkPermission from "../middlewares/checkPermission.middleware.js";

const router = express.Router();

router.post("/create-user", checkPermission("user", "create"), upload.fields([{ name: "profilePhoto", maxCount: 1 }, { name: "allotment", maxCount: 1 }]), createUser);
router.get("/get-all-user", getUsers);
router.get("/get-single-user/:id", isLoggedIn, checkPermission("user", "access"), getUser);
router.put("/update-user/:id", isLoggedIn, checkPermission("user", "update"), upload.fields([{ name: "profilePhoto", maxCount: 1 }, { name: "allotment", maxCount: 1 }]), updateUser);
router.delete("/delete-single-user/:id", softDeleteUser);
router.patch("/delete-multiple-user", softDeleteUsers);

export default router;