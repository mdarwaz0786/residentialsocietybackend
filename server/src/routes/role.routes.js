import express from "express";
import { createRole, getRole, getRoles, softDeleteRole, softDeleteRoles, updateRole } from "../controllers/role.controllers.js";
import isLoggedIn from "../middlewares/auth.middleware.js";
import checkPermission from "../middlewares/checkPermission.middleware.js";
const router = express.Router();

router.post("/create-role", createRole);
router.get("/get-all-role", isLoggedIn, checkPermission("role", "read"), getRoles);
router.get("/get-single-role/:id", isLoggedIn, checkPermission("role", "read"), getRole);
router.put("/update-role/:id", isLoggedIn, checkPermission("role", "update"), updateRole);
router.delete("/delete-single-role/:id", isLoggedIn, checkPermission("role", "delete"), softDeleteRole);
router.patch("/delete-multiple-role", isLoggedIn, checkPermission("role", "delete"), softDeleteRoles);

export default router;