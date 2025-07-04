import express from "express";
import isLoggedIn from "../middlewares/auth.middleware.js";
import checkPermission from "../middlewares/checkPermission.middleware.js";
import { createVehicle, getVehicle, getVehicles, softDeleteVehicle, softDeleteVehicles, updateVehicle } from "../controllers/vehicle.controllers.js";
const router = express.Router();

router.post("/create-vehicle", isLoggedIn, checkPermission("vehicle", "create"), createVehicle);
router.get("/get-all-vehicle", isLoggedIn, checkPermission("vehicle", "access"), getVehicles);
router.get("/get-single-vehicle/:id", isLoggedIn, checkPermission("vehicle", "access"), getVehicle);
router.put("/update-vehicle/:id", isLoggedIn, checkPermission("vehicle", "update"), updateVehicle);
router.delete("/delete-single-vehicle/:id", isLoggedIn, checkPermission("vehicle", "delete"), softDeleteVehicle);
router.patch("/delete-multiple-vehicle", isLoggedIn, checkPermission("vehicle", "delete"), softDeleteVehicles);

export default router;