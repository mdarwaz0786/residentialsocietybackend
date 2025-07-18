import express from "express";
import isLoggedIn from "../middlewares/auth.middleware.js";
import checkPermission from "../middlewares/checkPermission.middleware.js";
import { createMaid, getMaid, getMaids, softDeleteMaid, softDeleteMaids, updateMaid } from "../controllers/maid.controllers.js";
import upload from "../middlewares/multer.middleware.js";
import validateFileSize from "../middlewares/validateFileSize.middleware.js";
const router = express.Router();

router.post("/create-maid", isLoggedIn, checkPermission("maid", "create"), upload.fields([{ name: "photo", maxCount: 1 }, { name: "aadharCard", maxCount: 1 }]), validateFileSize, createMaid);
router.get("/get-all-maid", isLoggedIn, checkPermission("maid", "access"), getMaids);
router.get("/get-single-maid/:id", isLoggedIn, checkPermission("maid", "access"), getMaid);
router.patch("/update-maid/:id", isLoggedIn, checkPermission("maid", "update"), upload.fields([{ name: "photo", maxCount: 1 }, { name: "aadharCard", maxCount: 1 }]), validateFileSize, updateMaid);
router.delete("/delete-single-maid/:id", isLoggedIn, checkPermission("maid", "delete"), softDeleteMaid);
router.patch("/delete-multiple-maid", isLoggedIn, checkPermission("maid", "delete"), softDeleteMaids);

export default router;