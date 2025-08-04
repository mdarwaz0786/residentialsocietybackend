import mongoose from "mongoose";
import Vehicle from "../models/vehicle.model.js";
import asyncHandler from "../helpers/asynsHandler.js";
import ApiError from "../helpers/apiError.js";
import ApiFeatures from "../helpers/ApiFeatures.js";
import formatApiResponse from "../helpers/formatApiResponse.js";
import compressImageToBase64 from "../helpers/compressImageToBase64.js";

// Create Vehicle
export const createVehicle = asyncHandler(async (req, res) => {
  const { vehicleNumber, vehicleType, } = req.body;
  const createdBy = req.user?._id;

  const photo = req.files?.vehiclePhoto?.[0];
  const rc = req.files?.vehicleRC?.[0];

  const [photoBase64, rcBase64] = await Promise.all([
    photo ? compressImageToBase64(photo.buffer, photo.mimetype) : null,
    rc ? compressImageToBase64(rc.buffer, rc.mimetype) : null,
  ]);

  const vehicle = await Vehicle.create({
    vehicleNumber,
    vehicleType,
    vehiclePhoto: photoBase64,
    vehicleRC: rcBase64,
    createdBy,
  });

  res.status(201).json({ success: true, data: vehicle });
});

// Get All Vehicles
export const getVehicles = asyncHandler(async (req, res) => {
  const searchableFields = ["vehicleNumber", "vehicleType", "status"];
  const filterableFields = ["vehicleType", "status", "isDeleted"];

  const { query, sort, skip, limit, page } = ApiFeatures(req, searchableFields, filterableFields, {
    defaultSortBy: "createdAt",
    defaultOrder: "desc",
  });

  const vehicles = await Vehicle
    .find(query)
    .populate("createdBy")
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await Vehicle.countDocuments(query);

  res.status(200).json(formatApiResponse({ data: vehicles, total, page, limit }));
});

// Get Single Vehicle
export const getVehicle = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Vehicle ID.");
  };

  const vehicle = await Vehicle.findById(id).populate("createdBy");

  if (!vehicle) {
    throw new ApiError(404, "Vehicle not found.");
  };

  res.status(200).json({ success: true, data: vehicle });
});

// Update Vehicle
export const updateVehicle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updatedBy = req.user?._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Vehicle ID.");
  };

  const vehicle = await Vehicle.findById(id);

  if (!vehicle) {
    throw new ApiError(404, "Vehicle not found.");
  };

  const updates = { ...req.body };

  const photo = req.files?.vehiclePhoto?.[0];
  const rc = req.files?.vehicleRC?.[0];

  const [photoBase64, rcBase64] = await Promise.all([
    photo ? compressImageToBase64(photo.buffer, photo.mimetype) : null,
    rc ? compressImageToBase64(rc.buffer, rc.mimetype) : null,
  ]);

  if (photoBase64) {
    updates.vehiclePhoto = photoBase64;
  };

  if (rcBase64) {
    updates.vehicleRC = rcBase64;
  };

  updates.updatedBy = updatedBy;

  const updated = await Vehicle.findByIdAndUpdate(id, updates, { new: true });

  res.status(200).json({ success: true, data: updated });
});

// Delete Vehicle
export const deleteVehicle = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Vehicle ID.");
  };

  const vehicle = await Vehicle.findById(id);

  if (!vehicle) {
    throw new ApiError(404, "Vehicle not found.");
  };

  await Vehicle.findByIdAndDelete(id);

  res.status(200).json({ success: true, message: "Vehicle deleted successfully." });
});
