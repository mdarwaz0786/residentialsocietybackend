import mongoose from "mongoose";
import Visitor from "../models/visitor.model.js";
import ApiError from "../helpers/apiError.js";
import asyncHandler from "../helpers/asynsHandler.js";
import ApiFeatures from "../helpers/ApiFeatures.js";
import formatApiResponse from "../helpers/formatApiResponse.js";
import FlatOwner from "../models/flatOwner.model.js";
import Tenant from "../models/tenant.model.js";
import Role from "../models/role.model.js";

// Create Visitor
export const createVisitor = asyncHandler(async (req, res) => {
  const { fullName, mobile, date, time, purpose } = req.body;
  const createdBy = req.user?._id;

  const userRoleId = req.user?.role;

  if (!userRoleId || !mongoose.Types.ObjectId.isValid(userRoleId)) {
    throw new ApiError(401, "Invalid or missing user role.");
  };

  const role = await Role.findById(userRoleId);

  if (!role) {
    throw new ApiError(403, "Role not found.");
  };

  let tenant = await Tenant.findOne({ userId: createdBy }).populate("flat").select("flat");
  let flatOwner = null;
  let flat = null;
  let flatID = null;

  if (role?.roleName?.toLowerCase() === "tenant" || role?.roleName?.toLowerCase() === "flat owner") {
    if (!tenant) {
      flatOwner = await FlatOwner.findOne({ userId: createdBy }).populate("flat").select("flat");

      if (!flatOwner) {
        throw new ApiError(404, "Flat owner not found.");
      };

      flat = flatOwner?.flat;
    } else {
      flat = tenant?.flat;
    };

    if (!flat) {
      throw new ApiError(400, "Flat not found.");
    };

    flatID = flat?._id;
  };

  const photo = req.files?.photo?.[0];
  let photoBase64 = "";

  if (photo) {
    photoBase64 = `data:${photo.mimetype};base64,${photo.buffer.toString("base64")}`;
  };

  const maid = await Visitor.create({
    fullName,
    mobile,
    flat: flatID,
    photo: photoBase64,
    createdBy,
    date,
    time,
    purpose,
  });

  res.status(201).json({ success: true, data: maid });
});

// Get all Visitor
export const getVisitors = asyncHandler(async (req, res) => {
  const searchableFields = ["fullName", "mobile"];
  const filterableFields = ["status"];

  const { query, sort, skip, limit, page } = ApiFeatures(req, searchableFields, filterableFields, {
    softDelete: true,
    defaultSortBy: "createdAt",
    defaultOrder: "desc",
    defaultPage: 1,
    defaultLimit: 10,
  });

  const visitors = await Visitor
    .find(query)
    .populate("flat")
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await Visitor.countDocuments(query);

  res.status(200).json(formatApiResponse({ data: visitors, total, page, limit }));
});

// Get single Visitor
export const getVisitor = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid visitor ID.");
  };

  const visitor = await Visitor.findOne({ _id: id, isDeleted: false }).populate("flat");

  if (!visitor) {
    throw new ApiError(404, "Visitor not found or has been deleted.");
  };

  res.status(200).json({ success: true, data: visitor });
});

//  Update Visitor
export const updateVisitor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updatedBy = req.user?._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid visitor ID.");
  };

  const visitor = await Visitor.findById(id);

  if (!visitor || visitor.isDeleted) {
    throw new ApiError(404, "Visitor not found or already deleted.");
  };

  const updates = { ...req.body };
  const photo = req.files?.photo?.[0];

  if (photo) {
    updates.photo = `data:${photo.mimetype};base64,${photo.buffer.toString("base64")}`;
  };

  updates.updatedBy = updatedBy;

  const updatedVisitor = await Visitor.findByIdAndUpdate(id, updates, { new: true });

  res.status(200).json({ success: true, data: updatedVisitor });
});

// Soft delete Visitor
export const softDeleteVisitor = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid visitor ID.");
  };

  const visitor = await Visitor.findById(id);

  if (!visitor) {
    throw new ApiError(404, "Visitor not found.");
  };

  if (visitor.isDeleted) {
    throw new ApiError(400, "Vistor is already deleted.");
  };

  visitor.isDeleted = true;
  await visitor.save();

  res.status(200).json({ success: true, message: "Visitor deleted successfully." });
});

// Soft delete multiple Visitors
export const softDeleteVisitors = asyncHandler(async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    throw new ApiError(400, "Please provide visitors IDs to delete.");
  };

  const invalidIds = ids.filter((id) => !mongoose.Types.ObjectId.isValid(id));

  if (invalidIds.length > 0) {
    throw new ApiError(400, `Invalid visitor IDs: ${invalidIds.join(", ")}`);
  };

  const result = await Visitor.updateMany(
    { _id: { $in: ids }, isDeleted: false },
    { $set: { isDeleted: true } }
  );

  res.status(200).json({ success: true, message: `${result.modifiedCount} visitors deleted successfully.` });
});
