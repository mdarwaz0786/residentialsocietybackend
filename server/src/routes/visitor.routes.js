import express from "express";
import isLoggedIn from "../middlewares/auth.middleware.js";
import checkPermission from "../middlewares/checkPermission.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import validateFileSize from "../middlewares/validateFileSize.middleware.js";
import { createVisitor, getVisitor, getVisitors, softDeleteVisitor, softDeleteVisitors, updateVisitor } from "../controllers/visitor.controllers.js";
const router = express.Router();

router.post("/create-visitor", isLoggedIn, checkPermission("visitor", "create"), upload.fields([{ name: "photo", maxCount: 1 }]), validateFileSize, createVisitor);
router.get("/get-all-visitor", isLoggedIn, checkPermission("visitor", "read"), getVisitors);
router.get("/get-single-visitor/:id", isLoggedIn, checkPermission("visitor", "access"), getVisitor);
router.patch("/update-visitor/:id", isLoggedIn, checkPermission("visitor", "update"), upload.fields([{ name: "photo", maxCount: 1 }]), validateFileSize, updateVisitor);
router.delete("/delete-single-visitor/:id", isLoggedIn, checkPermission("visitor", "delete"), softDeleteVisitor);
router.patch("/delete-multiple-visitor", isLoggedIn, checkPermission("visitor", "delete"), softDeleteVisitors);

export default router;