import express from "express";
import isLoggedIn from "../middlewares/auth.middleware.js";
import checkPermission from "../middlewares/checkPermission.middleware.js";
import validateFileSize from "../middlewares/validateFileSize.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import { createMaintenanceStaff, getMaintenanceStaff, getMaintenanceStaffs, softDeleteMaintenanceStaff, softDeletemaintenanceStaffs, updateMaintenanceStaff } from "../controllers/maintenanceStaff.controllers.js";
const router = express.Router();

router.post("/create-maintenanceStaff", isLoggedIn, checkPermission("maintenanceStaff", "create"), upload.fields([{ name: "profilePhoto", maxCount: 1 }, { name: "aadharCard", maxCount: 1 }]), validateFileSize, createMaintenanceStaff);
router.get("/get-all-maintenanceStaff", isLoggedIn, checkPermission("maintenanceStaff", "read"), getMaintenanceStaffs);
router.get("/get-single-maintenanceStaff/:id", isLoggedIn, checkPermission("maintenanceStaff", "read"), getMaintenanceStaff);
router.put("/update-maintenanceStaff/:id", isLoggedIn, checkPermission("maintenanceStaff", "update"), upload.fields([{ name: "profilePhoto", maxCount: 1 }, { name: "aadharCard", maxCount: 1 }]), validateFileSize, updateMaintenanceStaff);
router.delete("/delete-single-maintenanceStaff/:id", isLoggedIn, checkPermission("maintenanceStaff", "delete"), softDeleteMaintenanceStaff);
router.patch("/delete-multiple-maintenanceStaff", isLoggedIn, checkPermission("maintenanceStaff", "delete"), softDeletemaintenanceStaffs);

export default router;