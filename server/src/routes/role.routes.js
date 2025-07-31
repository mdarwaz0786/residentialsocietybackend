import express from "express";
import {
  createRole,
  deleteRole,
  getRole,
  getRoles,
  updateRole,
} from "../controllers/role.controllers.js";
const router = express.Router();

router.post(
  "/create-role",
  createRole,
);

router.get(
  "/get-all-role",
  getRoles,
);

router.get(
  "/get-single-role/:id",
  getRole,
);

router.put(
  "/update-role/:id",
  updateRole,
);

router.delete(
  "/delete-single-role/:id",
  deleteRole,
);

export default router;