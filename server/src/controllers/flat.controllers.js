import mongoose from "mongoose";
import Flat from "../models/flat.model.js";
import asyncHandler from "../helpers/asynsHandler.js";
import ApiError from "../helpers/apiError.js";
import ApiFeatures from "../helpers/ApiFeatures.js";
import formatApiResponse from "../helpers/formatApiResponse.js";

// Create Flat
export const createFlat = asyncHandler(async (req, res) => {
  const {
    flatNumber,
    block,
    floor,
    type,
    areaInSqFt,
    flatOwner,
    tenants,
    occupancyStatus,
  } = req.body;

  const photos = req.files?.photos?.map((file) =>
    `data:${file.mimetype};base64,${file.buffer.toString("base64")}`
  ) || [];

  const flat = await Flat.create({
    flatNumber,
    block,
    floor,
    type,
    areaInSqFt,
    flatOwner,
    tenants,
    occupancyStatus,
    photos,
  });

  res.status(201).json({ success: true, data: flat });
});

// Get All Flats
export const getFlats = asyncHandler(async (req, res) => {
  const searchableFields = ["flatNumber", "block", "floor", "type"];
  const filterableFields = ["occupancyStatus", "flatOwner"];

  const { query, sort, skip, limit, page } = ApiFeatures(req, searchableFields, filterableFields, {
    softDelete: true,
    defaultSortBy: "createdAt",
    defaultOrder: "desc",
    defaultPage: 1,
    defaultLimit: 10,
  });

  const flats = await Flat.find(query)
    .populate("flatOwner")
    .populate("tenants")
    .populate("allotmentHistory.user")
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await Flat.countDocuments(query);

  res.status(200).json(formatApiResponse({ data: flats, total, page, limit }));
});

// Get Single Flat
export const getFlat = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid flat ID.");
  };

  const flat = await Flat
    .findOne({ _id: id, isDeleted: false })
    .populate("flatOwner")
    .populate("tenants")
    .populate("allotmentHistory.user");

  if (!flat) {
    throw new ApiError(404, "Flat not found.");
  };

  res.status(200).json({ success: true, data: flat });
});

// Update Flat
export const updateFlat = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Flat ID");
  };

  const flat = await Flat.findById(id);

  if (!flat || flat.isDeleted) {
    throw new ApiError(404, "Flat not found");
  };

  const updates = { ...req.body };

  const newPhotos = req.files?.photos?.map((file) =>
    `data:${file.mimetype};base64,${file.buffer.toString("base64")}`
  ) || [];

  if (newPhotos.length > 0) {
    updates.photos = [...flat.photos, ...newPhotos];
  };

  if (Array.isArray(req.body.deletePhotos)) {
    updates.photos = updates.photos || flat.photos.filter((photo) => !req.body.deletePhotos.includes(photo));
  };

  const updatedFlat = await Flat.findByIdAndUpdate(id, updates, { new: true });

  res.status(200).json({ success: true, data: updatedFlat });
});

// Soft Delete Flat
export const softDeleteFlat = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid flat ID.");
  };

  const flat = await Flat.findById(id);

  if (!flat) {
    throw new ApiError(404, "Flat not found.");
  };

  flat.isDeleted = true;
  await flat.save();

  res.status(200).json({ success: true, message: "Flat deleted successfully." });
});

// Soft Delete Multiple Flats
export const softDeleteFlats = asyncHandler(async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    throw new ApiError(400, "Please provide flats IDs to delete.");
  };

  const invalidIds = ids.filter((id) => !mongoose.Types.ObjectId.isValid(id));

  if (invalidIds.length > 0) {
    throw new ApiError(400, `Invalid flat IDs: ${invalidIds.join(", ")}`);
  };

  const result = await Flat.updateMany(
    { _id: { $in: ids }, isDeleted: false },
    { $set: { isDeleted: true } }
  );

  res.status(200).json({ success: true, message: `${result.modifiedCount} flats deleted successfully.` });
});

// Add Allotment History Record
export const addAllotmentHistory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { user, fromDate, toDate, role } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid flat ID.");
  };

  const flat = await Flat.findById(id);

  if (!flat) {
    throw new ApiError(404, "Flat not found.");
  };

  flat.allotmentHistory.push({ user, fromDate, toDate, role });

  await flat.save();

  res.status(200).json({ success: true, message: "Allotment history added." });
});
