import express from "express";
import isLoggedIn from "../middlewares/auth.middleware.js";
import checkPermission from "../middlewares/checkPermission.middleware.js";
import validateFileSize from "../middlewares/validateFileSize.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import {
  createMaintenanceStaff,
  deleteMaintenanceStaff,
  getMaintenanceStaff,
  getMaintenanceStaffs,
  updateMaintenanceStaff,
  updateMaintenanceStaffLogin,
} from "../controllers/maintenanceStaff.controllers.js";
const router = express.Router();

router.post(
  "/create-maintenanceStaff",
  isLoggedIn,
  checkPermission("maintenanceStaff", "create"),
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "aadharCard", maxCount: 1 }
  ]),
  validateFileSize,
  createMaintenanceStaff,
);

router.get(
  "/get-all-maintenanceStaff",
  isLoggedIn,
  checkPermission("maintenanceStaff", "read"),
  getMaintenanceStaffs,
);

router.get(
  "/get-single-maintenanceStaff/:id",
  isLoggedIn,
  checkPermission("maintenanceStaff", "read"),
  getMaintenanceStaff,
);

router.patch(
  "/update-maintenanceStaff/:id",
  isLoggedIn,
  checkPermission("maintenanceStaff", "update"),
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "aadharCard", maxCount: 1 },
  ]),
  validateFileSize,
  updateMaintenanceStaff,
);

router.patch(
  "/update-maintenanceStaff-login/:id/:login",
  isLoggedIn,
  checkPermission("maintenanceStaff", "update"),
  updateMaintenanceStaffLogin,
);

router.delete(
  "/delete-single-maintenanceStaff/:id",
  isLoggedIn,
  checkPermission("maintenanceStaff", "delete"),
  deleteMaintenanceStaff,
);

export default router;