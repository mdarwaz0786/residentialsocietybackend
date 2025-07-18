import express from "express";
import isLoggedIn from "../middlewares/auth.middleware.js";
import checkPermission from "../middlewares/checkPermission.middleware.js";
import validateFileSize from "../middlewares/validateFileSize.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import {
  createTenant,
  getTenant,
  getTenants,
  softDeleteTenant,
  softDeleteTenants,
  updateTenant
} from "../controllers/tenant.controllers.js";
const router = express.Router();

router.post(
  "/create-tenant",
  isLoggedIn,
  checkPermission("tenant", "create"),
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "aadharCard", maxCount: 1 },
    { name: "policeVerification", maxCount: 1 },
    { name: "rentAgreement", maxCount: 1 },
    { name: "vehicleRC", maxCount: 1 },
  ]),
  validateFileSize,
  createTenant
);

router.get(
  "/get-all-tenant",
  isLoggedIn,
  checkPermission("tenant", "read"),
  getTenants
);

router.get(
  "/get-single-tenant/:id",
  isLoggedIn,
  checkPermission("tenant", "read"),
  getTenant
);

router.patch(
  "/update-tenant/:id",
  isLoggedIn,
  checkPermission("tenant", "update"),
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "aadharCard", maxCount: 1 },
    { name: "policeVerification", maxCount: 1 },
    { name: "rentAgreement", maxCount: 1 },
    { name: "vehicleRC", maxCount: 1 },
  ]),
  validateFileSize,
  updateTenant
);

router.delete(
  "/delete-single-tenant/:id",
  isLoggedIn,
  checkPermission("tenant", "delete"),
  softDeleteTenant
);

router.patch(
  "/delete-multiple-tenant",
  isLoggedIn,
  checkPermission("tenant", "delete"),
  softDeleteTenants
);

export default router;