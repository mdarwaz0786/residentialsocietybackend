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
    floor,
    flatType,
    flatOwner,
    status,
  } = req.body;

  console.log(req.body)

  const flat = await Flat.create({
    flatNumber,
    floor,
    flatType,
    flatOwner,
    status,
  });

  res.status(201).json({ success: true, data: flat });
});

// Get All Flats
export const getFlats = asyncHandler(async (req, res) => {
  const searchableFields = ["flatNumber", "floor", "flatType"];
  const filterableFields = ["flatOwner"];

  const { query, sort, skip, limit, page } = ApiFeatures(req, searchableFields, filterableFields, {
    softDelete: true,
    defaultSortBy: "createdAt",
    defaultOrder: "desc",
    defaultPage: 1,
    defaultLimit: 10,
  });

  const flats = await Flat.find(query)
    .populate("flatOwner")
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

