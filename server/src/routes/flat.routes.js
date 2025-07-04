import express from "express";
import isLoggedIn from "../middlewares/auth.middleware.js";
import checkPermission from "../middlewares/checkPermission.middleware.js";
import { addAllotmentHistory, createFlat, getFlat, getFlats, softDeleteFlat, softDeleteFlats, updateFlat } from "../controllers/flat.controllers.js";
import validateFileSize from "../middlewares/validateFileSize.middleware.js";
const router = express.Router();

router.post("/create-flat", isLoggedIn, checkPermission("flat", "create"), upload.array("photos", 5), validateFileSize, createFlat);
router.get("/get-all-flat", isLoggedIn, checkPermission("flat", "access"), getFlats);
router.get("/get-single-flat/:id", isLoggedIn, checkPermission("flat", "access"), getFlat);
router.put("/update-flat/:id", isLoggedIn, checkPermission("flat", "update"), upload.array("photos", 5), validateFileSize, updateFlat);
router.put("/add-allotment-history/:id", isLoggedIn, checkPermission("flat", "update"), addAllotmentHistory);
router.delete("/delete-single-flat/:id", isLoggedIn, checkPermission("flat", "delete"), softDeleteFlat);
router.patch("/delete-multiple-flat", isLoggedIn, checkPermission("flat", "delete"), softDeleteFlats);

export default router;