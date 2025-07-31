import express from "express";
import isLoggedIn from "../middlewares/auth.middleware.js";
import checkPermission from "../middlewares/checkPermission.middleware.js";
import {
  createMaid,
  deleteMaid,
  getMaid,
  getMaids,
  updateMaid,
} from "../controllers/maid.controllers.js";
import upload from "../middlewares/multer.middleware.js";
import validateFileSize from "../middlewares/validateFileSize.middleware.js";
const router = express.Router();

router.post(
  "/create-maid",
  isLoggedIn,
  checkPermission("maid", "create"),
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "aadharCard", maxCount: 1 },
  ]),
  validateFileSize,
  createMaid,
);

router.get(
  "/get-all-maid",
  isLoggedIn,
  checkPermission("maid", "read"),
  getMaids,
);

router.get(
  "/get-single-maid/:id",
  isLoggedIn,
  checkPermission("maid", "access"),
  getMaid,
);

router.patch(
  "/update-maid/:id",
  isLoggedIn,
  checkPermission("maid", "update"),
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "aadharCard", maxCount: 1 },
  ]),
  validateFileSize,
  updateMaid,
);

router.delete(
  "/delete-single-maid/:id",
  isLoggedIn,
  checkPermission("maid", "delete"),
  deleteMaid,
);

export default router;