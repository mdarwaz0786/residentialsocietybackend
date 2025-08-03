import express from "express";
import isLoggedIn from "../middlewares/auth.middleware.js";
import checkPermission from "../middlewares/checkPermission.middleware.js";
import validateFileSize from "../middlewares/validateFileSize.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import {
  createFlatOwner,
  getFlatOwner,
  getFlatOwners,
  updateFlatOwner,
  deleteFlatOwner,
  updateFlatOwnerStatus,
  updateFlatOwnerLogin,
} from "../controllers/flatOwner.controllers.js";
const router = express.Router();

router.post(
  "/create-flatOwner",
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "aadharCard", maxCount: 1 },
    { name: "allotment", maxCount: 1 },
    { name: "vehicleRC", maxCount: 5 }
  ]),
  validateFileSize,
  createFlatOwner,
);

router.get(
  "/get-all-flatOwner",
  isLoggedIn,
  checkPermission("flatOwner", "read"),
  getFlatOwners,
);

router.get(
  "/get-single-flatOwner/:id",
  isLoggedIn,
  checkPermission("flatOwner", "read"),
  getFlatOwner,
);

router.patch(
  "/update-flatOwner/:id",
  isLoggedIn,
  checkPermission("flatOwner", "update"),
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "aadharCard", maxCount: 1 },
    { name: "allotment", maxCount: 1 },
    { name: "vehicleRC", maxCount: 5 }
  ]),
  validateFileSize,
  updateFlatOwner,
);

router.patch(
  "/update-flatOwner-status/:status/:id",
  isLoggedIn,
  checkPermission("flatOwner", "update"),
  updateFlatOwnerStatus,
);

router.patch(
  "/update-flatOwner-login/:login/:id",
  isLoggedIn,
  checkPermission("flatOwner", "update"),
  updateFlatOwnerLogin,
);

router.delete(
  "/delete-single-flatOwner/:id",
  isLoggedIn,
  checkPermission("flatOwner", "delete"),
  deleteFlatOwner,
);

export default router;