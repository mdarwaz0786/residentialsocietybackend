import mongoose from "mongoose";
import Vehicle from "../models/vehicle.model.js";
import asyncHandler from "../helpers/asynsHandler.js";
import ApiError from "../helpers/apiError.js";
import ApiFeatures from "../helpers/ApiFeatures.js";
import formatApiResponse from "../helpers/formatApiResponse.js";

// Create Vehicle
export const createVehicle = asyncHandler(async (req, res) => {
  const { vehicleNumber, vehicleType, status, vehicleOwner } = req.body;
  const photo = req.files?.vehiclePhoto?.[0];
  const rc = req.files?.vehicleRC?.[0];

  if (vehicleOwner && !mongoose.Types.ObjectId.isValid(vehicleOwner)) {
    throw new ApiError(400, "Invalid Vehicle Owner");
  };

  const vehicleOwnerId = vehicleOwner || req.user._id;

  let photoBase64;
  let rcBase64;

  if (photo) {
    photoBase64 = `data:${photo.mimetype};base64,${photo.buffer.toString("base64")}`;
  };

  if (rc) {
    rcBase64 = `data:${rc.mimetype};base64,${rc.buffer.toString("base64")}`;
  };

  const vehicle = await Vehicle.create({
    vehicleNumber,
    vehicleType,
    vehicleOwner: vehicleOwnerId,
    vehiclePhoto: photoBase64,
    vehicleRC: rcBase64,
    status,
  });

  res.status(201).json({ success: true, data: vehicle });
});

// Get All Vehicles
export const getVehicles = asyncHandler(async (req, res) => {
  const searchableFields = ["vehicleNumber"];
  const filterableFields = ["vehicleType", "status", "vehicleOwner"];

  const { query, sort, skip, limit, page } = ApiFeatures(req, searchableFields, filterableFields, {
    softDelete: true,
    defaultSortBy: "createdAt",
    defaultOrder: "desc",
    defaultPage: 1,
    defaultLimit: 10,
  });

  const vehicles = await Vehicle
    .find(query)
    .populate("vehicleOwner")
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
    throw new ApiError(400, "Invalid vehicle ID.");
  };

  const vehicle = await Vehicle.findOne({ _id: id, isDeleted: false }).populate("vehicleOwner");

  if (!vehicle) {
    throw new ApiError(404, "Vehicle not found or has been deleted.");
  };

  res.status(200).json({ success: true, data: vehicle });
});

// Update Vehicle
export const updateVehicle = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid vehicle ID.");
  };

  const vehicle = await Vehicle.findById(id);

  if (!vehicle || vehicle.isDeleted) {
    throw new ApiError(404, "Vehicle not found or already deleted.");
  };

  const updates = { ...req.body };
  const photo = req.files?.vehiclePhoto?.[0];
  const rc = req.files?.vehicleRC?.[0];

  if (photo) {
    updates.vehiclePhoto = `data:${photo.mimetype};base64,${photo.buffer.toString("base64")}`;
  };

  if (rc) {
    updates.vehicleRC = `data:${rc.mimetype};base64,${rc.buffer.toString("base64")}`;
  };

  const updated = await Vehicle.findByIdAndUpdate(id, updates, { new: true });

  res.status(200).json({ success: true, data: updated });
});

// Soft Delete Vehicle
export const softDeleteVehicle = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid vehicle ID.");
  };

  const vehicle = await Vehicle.findById(id);

  if (!vehicle) {
    throw new ApiError(404, "Vehicle not found.");
  };

  if (vehicle.isDeleted) {
    throw new ApiError(400, "Vehicle already deleted.");
  };

  vehicle.isDeleted = true;
  await vehicle.save();

  res.status(200).json({ success: true, message: "Vehicle deleted successfully." });
});

// Soft Delete Multiple Vehicles
export const softDeleteVehicles = asyncHandler(async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    throw new ApiError(400, "Please provide vehicle IDs to delete.");
  };

  const invalidIds = ids.filter((id) => !mongoose.Types.ObjectId.isValid(id));

  if (invalidIds.length > 0) {
    throw new ApiError(400, `Invalid vehicle IDs: ${invalidIds.join(", ")}`);
  };

  const result = await Vehicle.updateMany(
    { _id: { $in: ids }, isDeleted: false },
    { $set: { isDeleted: true } }
  );

  res.status(200).json({ success: true, message: `${result.modifiedCount} vehicles deleted successfully.` });
});
