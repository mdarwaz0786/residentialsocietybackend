import express from "express";
import isLoggedIn from "../middlewares/auth.middleware.js";
import checkPermission from "../middlewares/checkPermission.middleware.js";
import validateFileSize from "../middlewares/validateFileSize.middleware.js";
import { createTenant } from "../controllers/tenant.controllers.js";
const router = express.Router();

// 📁 middlewares/multer.middleware.js
import multer from "multer";

const storage = multer.memoryStorage();

const dynamicFieldHandler = (req, res, next) => {
  const upload = multer({ storage }).any(); // Accept any field name

  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, message: err.message });
    } else if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
    next();
  });
};

router.post(
  "/create-tenant",
  isLoggedIn,
  checkPermission("tenant", "create"),
  dynamicFieldHandler,
  validateFileSize,
  createTenant);

export default router;