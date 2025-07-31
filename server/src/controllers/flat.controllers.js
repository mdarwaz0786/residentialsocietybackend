import mongoose from "mongoose";
import Flat from "../models/flat.model.js";
import asyncHandler from "../helpers/asynsHandler.js";
import ApiError from "../helpers/apiError.js";
import ApiFeatures from "../helpers/ApiFeatures.js";
import formatApiResponse from "../helpers/formatApiResponse.js";

// Create Flat
export const createFlat = asyncHandler(async (req, res) => {
  const createdBy = req.user?._id;

  const {
    flatNumber,
    floor,
    flatType,
    status,
  } = req.body;

  const flat = await Flat.create({
    flatNumber,
    floor,
    flatType,
    status,
    createdBy,
  });

  res.status(201).json({ success: true, data: flat });
});

// Get All Flats
export const getFlats = asyncHandler(async (req, res) => {
  const searchableFields = ["flatNumber", "floor", "flatType"];
  const filterableFields = ["flatType", "isDeleted"];

  const { query, sort, skip, limit, page } = ApiFeatures(req, searchableFields, filterableFields, {
    defaultSortBy: "createdAt",
    defaultOrder: "desc",
  });

  const flats = await Flat
    .find(query)
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

  const flat = await Flat.findOne({ _id: id });

  if (!flat) {
    throw new ApiError(404, "Flat not found.");
  };

  res.status(200).json({ success: true, data: flat });
});

// Update Flat
export const updateFlat = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updatedBy = req.user?._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Flat ID");
  };

  const flat = await Flat.findById(id);

  if (!flat) {
    throw new ApiError(404, "Flat not found.");
  };

  const updates = {
    ...req.body,
    updatedBy,
  };

  const updatedFlat = await Flat.findByIdAndUpdate(id, updates, { new: true });

  res.status(200).json({ success: true, data: updatedFlat });
});

// Delete Flat
export const deleteFlat = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid flat ID.");
  };

  const flat = await Flat.findById(id);

  if (!flat) {
    throw new ApiError(404, "Flat not found.");
  };

  await Flat.findByIdAndDelete(id);

  res.status(200).json({ success: true, message: "Flat deleted successfully." });
});

