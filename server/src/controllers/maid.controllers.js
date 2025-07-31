import mongoose from "mongoose";
import Maid from "../models/maid.model.js";
import ApiError from "../helpers/apiError.js";
import asyncHandler from "../helpers/asynsHandler.js";
import ApiFeatures from "../helpers/ApiFeatures.js";
import formatApiResponse from "../helpers/formatApiResponse.js";
import FlatOwner from "../models/flatOwner.model.js";
import Tenant from "../models/tenant.model.js";
import generateMaidId from "../helpers/generateMaidId.js";

// Create Maid
export const createMaid = asyncHandler(async (req, res) => {
  const { fullName, mobile } = req.body;
  const createdBy = req.user?._id;

  let tenant = await Tenant.findOne({ userId: createdBy }).populate("flat").select("flat");
  let flatOwner = null;
  let flat = null;

  if (!tenant) {
    flatOwner = await FlatOwner.findOne({ userId: createdBy }).populate("flat").select("flat");

    if (!flatOwner) {
      throw new ApiError(404, "Flat not found.");
    };

    flat = flatOwner?.flat;
  } else {
    flat = tenant?.flat;
  };

  if (!flat) {
    throw new ApiError(400, "Flat not found.");
  };

  const flatID = flat?._id;

  if (!flatID) {
    throw new ApiError(400, "Flat ID is required.");
  };

  const flatNumber = flat?.flatNumber;

  if (!flatNumber) {
    throw new ApiError(400, "Flat number is required.");
  };

  const memberId = await generateMaidId("MAID-", flatNumber);

  if (!memberId) {
    throw new ApiError(500, "Failed to generate maid ID.");
  };

  const photo = req.files?.photo?.[0];
  const aadharCard = req.files?.aadharCard?.[0];

  let photoBase64 = "";
  let aadharBase64 = "";

  if (photo) {
    photoBase64 = `data:${photo.mimetype};base64,${photo.buffer.toString("base64")}`;
  };

  if (aadharCard) {
    aadharBase64 = `data:${aadharCard.mimetype};base64,${aadharCard.buffer.toString("base64")}`;
  };

  const maid = await Maid.create({
    fullName,
    mobile,
    memberId,
    flat: flatID,
    photo: photoBase64,
    aadharCard: aadharBase64,
    createdBy,
  });

  res.status(201).json({ success: true, data: maid });
});

// Get All Maids
export const getMaids = asyncHandler(async (req, res) => {
  const searchableFields = ["name", "mobile", "memberId"];
  const filterableFields = ["status", "isDeleted"];

  const { query, sort, skip, limit, page } = ApiFeatures(req, searchableFields, filterableFields, {
    defaultSortBy: "createdAt",
    defaultOrder: "desc",
  });

  const maids = await Maid
    .find(query)
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

  const maid = await Maid.findOne({ _id: id }).populate("flat");

  if (!maid) {
    throw new ApiError(404, "Maid not found.");
  };

  res.status(200).json({ success: true, data: maid });
});

//  Update Maid
export const updateMaid = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updatedBy = req.user?._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid maid ID.");
  };

  const maid = await Maid.findById(id);

  if (!maid) {
    throw new ApiError(404, "Maid not found.");
  };

  const updates = { ...req.body };
  const photo = req.files?.photo?.[0];
  const aadharCard = req.files?.aadharCard?.[0];

  if (photo) {
    updates.photo = `data:${photo.mimetype};base64,${photo.buffer.toString("base64")}`;
  };

  if (aadharCard) {
    updates.aadharCard = `data:${aadharCard.mimetype};base64,${aadharCard.buffer.toString("base64")}`;
  };

  updates.updatedBy = updatedBy;

  const updatedMaid = await Maid.findByIdAndUpdate(id, updates, { new: true });

  res.status(200).json({ success: true, data: updatedMaid });
});

// Delete Maid
export const deleteMaid = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid maid ID.");
  };

  const maid = await Maid.findById(id);

  if (!maid) {
    throw new ApiError(404, "Maid not found.");
  };

  await Maid.findByIdAndDelete(id);

  res.status(200).json({ success: true, message: "Maid deleted successfully." });
});
