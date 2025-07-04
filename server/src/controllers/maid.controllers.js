import mongoose from "mongoose";
import Maid from "../models/maid.model.js";
import ApiError from "../helpers/apiError.js";
import asyncHandler from "../helpers/asynsHandler.js";
import ApiFeatures from "../helpers/ApiFeatures.js";
import formatApiResponse from "../helpers/formatApiResponse.js";

// Create Maid
export const createMaid = asyncHandler(async (req, res) => {
  const { name, mobile, IdType, IdNumber, flat, status } = req.body;
  const photoFile = req.files?.photo?.[0];

  let photoBase64;

  if (photoFile) {
    photoBase64 = `data:${photoFile.mimetype};base64,${photoFile.buffer.toString("base64")}`;
  };

  const maid = await Maid.create({
    name,
    mobile,
    IdType,
    IdNumber,
    flat,
    photo: photoBase64,
    status,
  });

  res.status(201).json({ success: true, data: maid });
});

// Get All Maids
export const getMaids = asyncHandler(async (req, res) => {
  const searchableFields = ["name", "mobile", "IdNumber"];
  const filterableFields = ["status", "flat"];

  const { query, sort, skip, limit, page } = ApiFeatures(req, searchableFields, filterableFields, {
    softDelete: true,
    defaultSortBy: "createdAt",
    defaultOrder: "desc",
    defaultPage: 1,
    defaultLimit: 10,
  });

  const maids = await Maid.find(query)
    .populate("flat")
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await Maid.countDocuments(query);

  res.status(200).json(formatApiResponse({ data: maids, total, page, limit }));
});

// Get Single Maid
export const getMaid = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid maid ID.");
  };

  const maid = await Maid.findOne({ _id: id, isDeleted: false }).populate("flat");

  if (!maid) {
    throw new ApiError(404, "Maid not found or has been deleted.");
  };

  res.status(200).json({ success: true, data: maid });
});

//  Update Maid
export const updateMaid = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid maid ID.");
  };

  const maid = await Maid.findById(id);

  if (!maid || maid.isDeleted) {
    throw new ApiError(404, "Maid not found or already deleted.");
  };

  const updates = { ...req.body };
  const photoFile = req.files?.photo?.[0];

  if (photoFile) {
    updates.photo = `data:${photoFile.mimetype};base64,${photoFile.buffer.toString("base64")}`;
  };

  const updatedMaid = await Maid.findByIdAndUpdate(id, updates, { new: true });

  res.status(200).json({ success: true, data: updatedMaid });
});

// Soft Delete Maid
export const softDeleteMaid = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid maid ID.");
  };

  const maid = await Maid.findById(id);

  if (!maid) {
    throw new ApiError(404, "Maid not found.");
  };

  if (maid.isDeleted) {
    throw new ApiError(400, "Maid is already deleted.");
  };

  maid.isDeleted = true;
  await maid.save();

  res.status(200).json({ success: true, message: "Maid deleted successfully." });
});

// Soft Delete Multiple Maids
export const softDeleteMaids = asyncHandler(async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    throw new ApiError(400, "Please provide maid IDs to delete.");
  };

  const invalidIds = ids.filter((id) => !mongoose.Types.ObjectId.isValid(id));

  if (invalidIds.length > 0) {
    throw new ApiError(400, `Invalid maid IDs: ${invalidIds.join(", ")}`);
  };

  const result = await Maid.updateMany(
    { _id: { $in: ids }, isDeleted: false },
    { $set: { isDeleted: true } }
  );

  res.status(200).json({ success: true, message: `${result.modifiedCount} maids deleted successfully.` });
});
