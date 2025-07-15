import express from "express";
import isLoggedIn from "../middlewares/auth.middleware.js";
import checkPermission from "../middlewares/checkPermission.middleware.js";
import validateFileSize from "../middlewares/validateFileSize.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import { createFlatOwner, getFlatOwner, getFlatOwners, softDeleteFlatOwner, softDeleteFlatOwners, updateFlatOwner } from "../controllers/flatOwner.controllers.js";
const router = express.Router();

router.post("/create-flatOwner", isLoggedIn, checkPermission("flatOwner", "create"), upload.fields([{ name: "profilePhoto", maxCount: 1 }, { name: "aadharCard", maxCount: 1 }, { name: "allotment", maxCount: 1 }, { name: "vehicleRC", maxCount: 1 }]), validateFileSize, createFlatOwner);
router.get("/get-all-flatOwner", isLoggedIn, checkPermission("flatOwner", "read"), getFlatOwners);
router.get("/get-single-flatOwner/:id", isLoggedIn, checkPermission("flatOwner", "read"), getFlatOwner);
router.put("/update-flatOwner/:id", isLoggedIn, checkPermission("flatOwner", "update"), upload.fields([{ name: "profilePhoto", maxCount: 1 }, { name: "aadharCard", maxCount: 1 }, { name: "allotment", maxCount: 1 }, { name: "vehicleRC", maxCount: 1 }]), validateFileSize, updateFlatOwner);
router.delete("/delete-single-flatOwner/:id", isLoggedIn, checkPermission("flatOwner", "delete"), softDeleteFlatOwner);
router.patch("/delete-multiple-flatOwner", isLoggedIn, checkPermission("flatOwner", "delete"), softDeleteFlatOwners);

export default router;