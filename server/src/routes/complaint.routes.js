import express from "express";
import isLoggedIn from "../middlewares/auth.middleware.js";
import checkPermission from "../middlewares/checkPermission.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import validateFileSize from "../middlewares/validateFileSize.middleware.js";
import {
  createComplaint,
  deleteComplaint,
  getComplaint,
  getComplaints,
  updateComplaint,
} from "../controllers/complaint.controllers.js";
const router = express.Router();

router.post(
  "/create-complaint",
  isLoggedIn,
  checkPermission("complaint", "create"),
  upload.fields([{ name: "image", maxCount: 1 }]),
  validateFileSize,
  createComplaint,
);

router.get(
  "/get-all-complaint",
  isLoggedIn,
  checkPermission("complaint", "read"),
  getComplaints,
);

router.get(
  "/get-single-complaint/:id",
  isLoggedIn,
  checkPermission("complaint", "access"),
  getComplaint,
);

router.patch(
  "/update-complaint/:id",
  isLoggedIn,
  checkPermission("complaint", "update"),
  upload.fields([{ name: "image", maxCount: 1 }]),
  validateFileSize,
  updateComplaint,
);

router.delete(
  "/delete-single-complaint/:id",
  isLoggedIn,
  checkPermission("complaint", "delete"),
  deleteComplaint,
);

export default router;