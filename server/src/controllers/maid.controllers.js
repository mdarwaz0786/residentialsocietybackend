import mongoose from "mongoose";
import Maid from "../models/maid.model.js";
import ApiError from "../helpers/apiError.js";
import asyncHandler from "../helpers/asynsHandler.js";
import ApiFeatures from "../helpers/ApiFeatures.js";
import formatApiResponse from "../helpers/formatApiResponse.js";
import FlatOwner from "../models/flatOwner.model.js";
import Tenant from "../models/tenant.model.js";
import compressImageToBase64 from "../helpers/compressImageToBase64.js"

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

  const photo = req.files?.photo?.[0];
  const aadharCard = req.files?.aadharCard?.[0];

  const [photoBase64, aadharBase64] = await Promise.all([
    photo ? compressImageToBase64(photo.buffer, photo.mimetype) : null,
    aadharCard ? compressImageToBase64(aadharCard.buffer, aadharCard.mimetype) : null,
  ]);

  const maid = await Maid.create({
    fullName,
    mobile,
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
    .populate("createdBy")
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
    throw new ApiError(400, "Invalid Maid ID.");
  };

  const maid = await Maid.findById(id).populate("flat").populate("createdBy");

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

  const [photoBase64, aadharBase64] = await Promise.all([
    photo ? compressImageToBase64(photo.buffer, photo.mimetype) : null,
    aadharCard ? compressImageToBase64(aadharCard.buffer, aadharCard.mimetype) : null,
  ]);

  if (photoBase64) {
    updates.photo = photoBase64;
  };

  if (aadharBase64) {
    updates.aadharCard = aadharBase64;
  };

  updates.updatedBy = updatedBy;

  const updatedMaid = await Maid.findByIdAndUpdate(id, updates, { new: true });

  res.status(200).json({ success: true, data: updatedMaid });
});

// Delete Maid
export const deleteMaid = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Maid ID.");
  };

  const maid = await Maid.findById(id);

  if (!maid) {
    throw new ApiError(404, "Maid not found.");
  };

  await Maid.findByIdAndDelete(id);

  res.status(200).json({ success: true, message: "Maid deleted successfully." });
});
