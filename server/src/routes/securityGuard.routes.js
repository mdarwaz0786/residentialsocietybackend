import express from "express";
import isLoggedIn from "../middlewares/auth.middleware.js";
import checkPermission from "../middlewares/checkPermission.middleware.js";
import validateFileSize from "../middlewares/validateFileSize.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import {
  createSecurityGuard,
  deleteSecurityGuard,
  getSecurityGuard,
  getSecurityGuards,
  updateSecurityGuard,
  updateSecurityGuardLogin,
} from "../controllers/securityGuard.controllers.js";
const router = express.Router();

router.post(
  "/create-securityGuard",
  isLoggedIn,
  checkPermission("securityGuard", "create"),
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "aadharCard", maxCount: 1 },
  ]),
  validateFileSize,
  createSecurityGuard,
);

router.get(
  "/get-all-securityGuard",
  isLoggedIn,
  checkPermission("securityGuard", "read"),
  getSecurityGuards,
);

router.get(
  "/get-single-securityGuard/:id",
  isLoggedIn,
  checkPermission("securityGuard", "read"),
  getSecurityGuard,
);

router.patch(
  "/update-securityGuard/:id",
  isLoggedIn,
  checkPermission("securityGuard", "update"),
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "aadharCard", maxCount: 1 },
  ]),
  validateFileSize,
  updateSecurityGuard,
);

router.patch(
  "/update-securityGuard-login/:login/:id",
  isLoggedIn,
  checkPermission("securityGuard", "update"),
  updateSecurityGuardLogin,
);

router.delete(
  "/delete-single-securityGuard/:id",
  isLoggedIn,
  checkPermission("securityGuard", "delete"),
  deleteSecurityGuard,
);

export default router;