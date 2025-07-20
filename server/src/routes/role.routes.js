import express from "express";
import { createRole, getRole, getRoles, softDeleteRole, softDeleteRoles, updateRole } from "../controllers/role.controllers.js";
const router = express.Router();

router.post("/create-role", createRole);
router.get("/get-all-role", getRoles);
router.get("/get-single-role/:id", getRole);
router.put("/update-role/:id", updateRole);
router.delete("/delete-single-role/:id", softDeleteRole);
router.patch("/delete-multiple-role", softDeleteRoles);

export default router;