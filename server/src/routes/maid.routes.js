import express from "express";
import isLoggedIn from "../middlewares/auth.middleware.js";
import checkPermission from "../middlewares/checkPermission.middleware.js";
import { createMaid, getMaid, getMaids, softDeleteMaid, softDeleteMaids, updateMaid } from "../controllers/maid.controllers.js";
const router = express.Router();

router.post("/create-maid", isLoggedIn, checkPermission("maid", "create"), createMaid);
router.get("/get-all-maid", isLoggedIn, checkPermission("maid", "access"), getMaids);
router.get("/get-single-maid/:id", isLoggedIn, checkPermission("maid", "access"), getMaid);
router.put("/update-maid/:id", isLoggedIn, checkPermission("maid", "update"), updateMaid);
router.delete("/delete-single-maid/:id", isLoggedIn, checkPermission("maid", "delete"), softDeleteMaid);
router.patch("/delete-multiple-maid", isLoggedIn, checkPermission("maid", "delete"), softDeleteMaids);

export default router;