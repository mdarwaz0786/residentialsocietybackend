import express from "express";
import isLoggedIn from "../middlewares/auth.middleware.js";
import checkPermission from "../middlewares/checkPermission.middleware.js";
import {
  createVehicle,
  deleteVehicle,
  getVehicle,
  getVehicles,
  updateVehicle,
} from "../controllers/vehicle.controllers.js";
import validateFileSize from "../middlewares/validateFileSize.middleware.js";
import upload from "../middlewares/multer.middleware.js";
const router = express.Router();

router.post(
  "/create-vehicle",
  isLoggedIn,
  checkPermission("vehicle", "create"),
  upload.fields([
    { name: "vehiclePhoto", maxCount: 1 },
    { name: "vehicleRC", maxCount: 1 },
  ]),
  validateFileSize,
  createVehicle,
);

router.get(
  "/get-all-vehicle",
  isLoggedIn,
  checkPermission("vehicle", "read"),
  getVehicles,
);

router.get(
  "/get-single-vehicle/:id",
  isLoggedIn,
  checkPermission("vehicle", "read"),
  getVehicle,
);

router.patch(
  "/update-vehicle/:id",
  isLoggedIn,
  checkPermission("vehicle", "update"),
  upload.fields([
    { name: "vehiclePhoto", maxCount: 1 },
    { name: "vehicleRC", maxCount: 1 },
  ]),
  validateFileSize,
  updateVehicle,
);

router.delete(
  "/delete-single-vehicle/:id",
  isLoggedIn,
  checkPermission("vehicle", "delete"),
  deleteVehicle,
);

export default router;