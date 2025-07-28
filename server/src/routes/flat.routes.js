import express from "express";
import isLoggedIn from "../middlewares/auth.middleware.js";
import checkPermission from "../middlewares/checkPermission.middleware.js";
import { createFlat, getFlat, getFlats, softDeleteFlat, softDeleteFlats, updateFlat } from "../controllers/flat.controllers.js";
const router = express.Router();

router.post("/create-flat", isLoggedIn, checkPermission("flat", "create"), createFlat);
router.get("/get-all-flat", getFlats);
router.get("/get-single-flat/:id", isLoggedIn, checkPermission("flat", "access"), getFlat);
router.put("/update-flat/:id", isLoggedIn, checkPermission("flat", "update"), updateFlat);
router.delete("/delete-single-flat/:id", isLoggedIn, checkPermission("flat", "delete"), softDeleteFlat);
router.patch("/delete-multiple-flat", isLoggedIn, checkPermission("flat", "delete"), softDeleteFlats);

export default router;