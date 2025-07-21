import mongoose from "mongoose";
import Complaint from "../models/complaint.model.js";
import asyncHandler from "../helpers/asynsHandler.js";
import ApiError from "../helpers/apiError.js";
import ApiFeatures from "../helpers/ApiFeatures.js";
import formatApiResponse from "../helpers/formatApiResponse.js";

// Create Complaint
export const createComplaint = asyncHandler(async (req, res) => {
  const { title, type } = req.body;
  const createdBy = req.user?._id;

  const photo = req?.files?.image?.[0];

  const imageBase64 = photo
    ? `data:${photo.mimetype};base64,${photo.buffer.toString("base64")}`
    : null;

  const complaint = await Complaint.create({
    title,
    type,
    image: imageBase64,
    createdBy,
  });

  res.status(201).json({ success: true, data: complaint });
});

// Get Copmlaints
export const getComplaints = asyncHandler(async (req, res) => {
  const searchableFields = ["title", "type", "status"];
  const filterableFields = ["type", "status"];

  const { query, sort, skip, limit, page } = ApiFeatures(
    req,
    searchableFields,
    filterableFields,
    {
      softDelete: true,
      defaultSortBy: "createdAt",
      defaultOrder: "desc",
      defaultPage: 1,
      defaultLimit: 10,
    }
  );

  const complaints = await Complaint
    .find(query)
    .populate("createdBy")
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await Complaint.countDocuments(query);

  res.status(200).json(formatApiResponse({ data: complaints, total, page, limit }));
});

// Get Single Complaint
export const getComplaint = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Complaint ID.");
  };

  const complaint = await Complaint.findById(id).populate("createdBy");

  if (!complaint || complaint.isDeleted) {
    throw new ApiError(404, "Complaint not found.");
  };

  res.status(200).json({ success: true, data: complaint });
});

//  Update Complaint
export const updateComplaint = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updatedBy = req.user?._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Complaint ID.");
  };

  const {
    title,
    type,
    status,
  } = req.body;

  const photo = req?.files?.image?.[0];

  const imageBase64 = photo
    ? `data:${photo.mimetype};base64,${photo.buffer.toString("base64")}`
    : null;

  const updates = { updatedBy, };

  if (title) updates.title = title;
  if (type) updates.type = type;
  if (status) updates.status = status;
  if (imageBase64) updates.image = imageBase64;

  const updatedComplaint = await Complaint.findOneAndUpdate(
    { _id: id, isDeleted: { $ne: true } },
    updates,
    { new: true },
  );

  if (!updatedComplaint) {
    throw new ApiError(404, "Complaint not found or already deleted.");
  };

  res.status(200).json({ success: true, data: updatedComplaint });
});

// Soft Delete Single Complaint
export const softDeleteComplaint = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Complaint ID.");
  };

  const complaint = await Complaint.findById(id);

  if (!complaint || complaint.isDeleted) {
    throw new ApiError(404, "Complaint not found.");
  };

  complaint.isDeleted = true;
  await complaint.save();

  res.status(200).json({ success: true, message: "Complaint deleted successfully." });
});

// Soft Delete Multiple Complaints
export const softDeleteComplaints = asyncHandler(async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    throw new ApiError(400, "Please provide an array of Complaint IDs.");
  };

  const invalidIds = ids.filter((id) => !mongoose.Types.ObjectId.isValid(id));

  if (invalidIds.length > 0) {
    throw new ApiError(400, `Invalid Complaint IDs: ${invalidIds.join(", ")}`);
  };

  const result = await Complaint.updateMany(
    { _id: { $in: ids }, isDeleted: { $ne: true } },
    { $set: { isDeleted: true } }
  );

  res.status(200).json({
    success: true,
    message: `${result.modifiedCount} complaints deleted successfully.`,
  });
});
