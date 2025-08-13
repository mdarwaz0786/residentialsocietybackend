import mongoose from "mongoose";
import Visitor from "../models/visitor.model.js";
import ApiError from "../helpers/apiError.js";
import asyncHandler from "../helpers/asynsHandler.js";
import ApiFeatures from "../helpers/ApiFeatures.js";
import formatApiResponse from "../helpers/formatApiResponse.js";
import FlatOwner from "../models/flatOwner.model.js";
import Tenant from "../models/tenant.model.js";
import Role from "../models/role.model.js";
import compressImageToBase64 from "../helpers/compressImageToBase64.js";
import generateVisitorId from "../helpers/generateVisitorId.js";

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

  let tenant = await Tenant
    .findOne({ userId: createdBy })
    .populate("flat")
    .select("flat");

  let flatOwner = null;
  let flat = null;
  let flatID = null;

  if (role?.roleName?.toLowerCase() === "tenant" || role?.roleName?.toLowerCase() === "flat owner") {
    if (!tenant) {
      flatOwner = await FlatOwner
        .findOne({ userId: createdBy })
        .populate("flat")
        .select("flat");

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
  const photoBase64 = photo ? await compressImageToBase64(photo.buffer, photo.mimetype) : null;

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
  const searchableFields = ["fullName", "mobile", "visitorId"];
  const filterableFields = ["status", "isDeleted"];

  const { query, sort, skip, limit, page } = ApiFeatures(req, searchableFields, filterableFields, {
    defaultSortBy: "createdAt",
    defaultOrder: "desc",
  });

  const { dateType = "all" } = req.query;

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  if (dateType === "today") {
    query.date = { $gte: todayStart, $lte: todayEnd };
  } else if (dateType === "upcoming") {
    query.date = { $gt: todayEnd };
  };

  const visitors = await Visitor
    .find(query)
    .populate("flat")
    .populate("createdBy")
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
    throw new ApiError(400, "Invalid Visitor ID.");
  };

  const visitor = await Visitor
    .findById(id)
    .populate("flat")
    .populate("createdBy");

  if (!visitor) {
    throw new ApiError(404, "Visitor not found.");
  };

  res.status(200).json({ success: true, data: visitor });
});

//  Update Visitor
export const updateVisitor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updatedBy = req.user?._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Visitor ID.");
  };

  const visitor = await Visitor.findById(id);

  if (!visitor) {
    throw new ApiError(404, "Visitor not found.");
  };

  const updates = { ...req.body };
  const photo = req.files?.photo?.[0];
  const photoBase64 = photo ? await compressImageToBase64(photo.buffer, photo.mimetype) : null;

  if (photoBase64) {
    updates.photo = photoBase64;
  };

  updates.updatedBy = updatedBy;

  const updatedVisitor = await Visitor.findByIdAndUpdate(id, updates, { new: true });

  res.status(200).json({ success: true, data: updatedVisitor });
});

// Update Visitor status
export const updateVisitorStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.params;
  const updatedBy = req.user?._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Visitor ID.");
  };

  const visitor = await Visitor.findById(id);

  if (!visitor) {
    throw new ApiError(404, "Visitor not found.");
  };

  if (status == "Pending") {
    visitor.status = "Pending";
    visitor.updatedBy = updatedBy;
    await visitor.save();
    return res.status(200).json({ success: true, message: "Visitor status updated to Pending." });
  };

  if (status == "Rejected") {
    visitor.status = "Rejected";
    visitor.updatedBy = updatedBy;
    await visitor.save();
    return res.status(200).json({ success: true, message: "Visitor status updated to Rejected." });
  };

  if (status == "Approved" && visitor?.status === "Approved") {
    visitor.status = "Approved";
    visitor.updatedBy = updatedBy;
    await visitor.save();
    return res.status(200).json({ success: true, message: "Visitor status updated to Approved." });
  };

  if (status == "Approved") {
    const visitorId = await generateVisitorId("VIS-");
    visitor.status = "Approved";
    visitor.updatedBy = updatedBy;
    visitor.visitorId = visitorId;
    await visitor.save();
    return res.status(200).json({ success: true, message: "Visitor status updated to Approved." });
  };
});

// Delete Visitor
export const deleteVisitor = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Visitor ID.");
  };

  const visitor = await Visitor.findById(id);

  if (!visitor) {
    throw new ApiError(404, "Visitor not found.");
  };

  await Visitor.findByIdAndDelete(id);

  res.status(200).json({ success: true, message: "Visitor deleted successfully." });
});
