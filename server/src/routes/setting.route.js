import express from "express";
import { createSetting, deleteSetting, getSetting, getSettings, updateSetting } from "../controllers/setting.controllers.js";
const router = express.Router();

router.post(
  "/create-setting",
  createSetting,
);

router.get(
  "/get-all-setting",
  getSettings,
);

router.get(
  "/get-single-setting/:id",
  getSetting,
);

router.patch(
  "/update-setting/:id",
  updateSetting,
);

router.delete(
  "/delete-single-setting/:id",
  deleteSetting,
);

export default router;