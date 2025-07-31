import express from "express";
import {
  createUser,
  getUser,
  getUsers,
  updateUser,
} from "../controllers/user.controllers.js";
import upload from "../middlewares/multer.middleware.js";
import validateFileSize from "../middlewares/validateFileSize.middleware.js";

const router = express.Router();

router.post(
  "/create-user",
  upload.fields([{ name: "profilePhoto", maxCount: 1 }]),
  validateFileSize,
  createUser,
);

router.get(
  "/get-all-user",
  getUsers,
);

router.get(
  "/get-single-user/:id",
  getUser,
);

router.patch(
  "/update-user/:id",
  upload.fields([{ name: "profilePhoto", maxCount: 1 }]),
  validateFileSize,
  updateUser,
);

export default router;