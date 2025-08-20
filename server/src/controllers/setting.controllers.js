import mongoose from "mongoose";
import Setting from "../models/setting.model.js";
import ApiError from "../helpers/apiError.js";
import asyncHandler from "../helpers/asynsHandler.js";
import formatApiResponse from "../helpers/formatApiResponse.js";

// Create Setting
export const createSetting = asyncHandler(async (req, res) => {
  const {
    appVersion,
    appName,
    playStoreLink,
    appStoreLink,
    payuKey,
    payuSalt,
    tenantRegistrationFee,
    maidRegistrationFee,
  } = req.body;

  const setting = await Setting.create({
    appVersion,
    appName,
    playStoreLink,
    appStoreLink,
    payuKey,
    payuSalt,
    tenantRegistrationFee,
    maidRegistrationFee,
  });

  res.status(201).json(formatApiResponse({ success: true, data: setting }));
});

// Get All Settings
export const getSettings = asyncHandler(async (req, res) => {
  const settings = await Setting.find();
  return res.status(200).json(formatApiResponse({ success: true, data: settings }));
});

// Get Single Setting 
export const getSetting = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Setting ID.");
  };

  const setting = await Setting.findById(id);

  if (!setting) {
    throw new ApiError(404, "Setting not found.");
  };

  return res.status(200).json(formatApiResponse({ success: true, data: setting }));
});

// Update Setting
export const updateSetting = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Setting ID.");
  };

  const {
    appVersion,
    appName,
    playStoreLink,
    appStoreLink,
    payuKey,
    payuSalt,
    tenantRegistrationFee,
    maidRegistrationFee,
  } = req.body;

  const updatedSetting = await Setting.findByIdAndUpdate(
    id,
    {
      appVersion,
      appName,
      playStoreLink,
      appStoreLink,
      payuKey,
      payuSalt,
      tenantRegistrationFee,
      maidRegistrationFee,
    },
    { new: true }
  );

  if (!updatedSetting) {
    throw new ApiError(404, "Setting not found.");
  };

  return res.status(200).json(formatApiResponse({ success: true, data: updatedSetting }));
});

// Delete Setting
export const deleteSetting = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Setting ID.");
  };

  const deletedSetting = await Setting.findByIdAndDelete(id);

  if (!deletedSetting) {
    throw new ApiError(404, "Setting not found.");
  };

  return res.status(200).json({ success: true, message: "Setting deleted successfully." });
});
