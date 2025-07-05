import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import asyncHandler from "../helpers/asynsHandler.js";
import ApiError from "../helpers/apiError.js";
import ApiFeatures from "../helpers/ApiFeatures.js";
import formatApiResponse from "../helpers/formatApiResponse.js";

// Create user
export const createUser = asyncHandler(async (req, res) => {
  const {
    fullName,
    mobile,
    email,
    password,
    status,
    flat,
    role,
    currentAddress,
    permanentAddress,
  } = req.body;

  const profilePhoto = req.files?.profilePhoto?.[0];
  const allotment = req.files?.allotment?.[0];

  let profilePhotoBase64 = "";
  let allotmentBase64 = "";

  if (profilePhoto) {
    profilePhotoBase64 = `data:${profilePhoto.mimetype};base64,${profilePhoto.buffer.toString("base64")}`;
  };

  if (allotment) {
    allotmentBase64 = `data:${allotment.mimetype};base64,${allotment.buffer.toString("base64")}`;
  };

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    fullName,
    mobile,
    email,
    password: hashedPassword,
    status,
    flat,
    role,
    currentAddress,
    permanentAddress,
    profilePhoto: profilePhotoBase64,
    allotment: allotmentBase64,
  });

  res.status(201).json({ success: true, data: user });
});

// Get all users
export const getUsers = asyncHandler(async (req, res) => {
  const searchableFields = ["fullName", "email", "mobile", "currentAddress", "permanentAddress"];
  const filterableFields = ["status", "flat", "role"];

  const { query, sort, skip, limit, page } = ApiFeatures(req, searchableFields, filterableFields, {
    softDelete: true,
    defaultSortBy: "createdAt",
    defaultOrder: "desc",
    defaultPage: 1,
    defaultLimit: 10
  });

  const users = await User.find(query)
    .populate("flat")
    .populate("role")
    .sort(sort)
    .skip(skip)
    .limit(limit);

  if (!users) {
    throw new ApiError(404, "Users not found")
  };

  const total = await User.countDocuments(query);

  res.status(200).json(formatApiResponse({ data: users, total, page, limit }));
});

// Get single user
export const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid user ID.");
  };

  const user = await User
    .findOne({ _id: id, isDeleted: false })
    .populate("flat")
    .populate("role");

  if (!user) {
    throw new ApiError(404, "User not found or has been deleted.");
  };

  res.status(200).json({ success: true, data: user });
});

// Update user
export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "User ID is invalid." });
  };

  const user = await User.findById(id);

  if (!user) {
    throw new ApiError(404, "user not found");
  };

  const updates = { ...req.body };

  const profilePhoto = req.files?.profilePhoto?.[0];
  const allotment = req.files?.allotment?.[0];

  if (profilePhoto) {
    updates.profilePhoto = `data:${profilePhoto.mimetype};base64,${profilePhoto.buffer.toString("base64")}`;
  };

  if (allotment) {
    updates.allotment = `data:${allotment.mimetype};base64,${allotment.buffer.toString("base64")}`;
  };

  const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });

  if (!updatedUser) {
    throw new ApiError(404, "user not found");
  };

  res.status(200).json({ success: true, data: updatedUser });
});

// Soft delete single user
export const softDeleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid user ID.");
  };

  const user = await User.findById(id);

  if (!user) {
    throw new ApiError(404, "User not found.");
  };

  if (user.isDeleted) {
    throw new ApiError(400, "User is already deleted.");
  };

  user.isDeleted = true;
  await user.save();

  res.status(200).json({ success: true, message: "User deleted successfully." });
});

// Soft delete multiple users
export const softDeleteUsers = asyncHandler(async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    throw new ApiError(400, "Please provide user IDs to delete.");
  };

  const invalidIds = ids.filter((id) => !mongoose.Types.ObjectId.isValid(id));

  if (invalidIds.length > 0) {
    throw new ApiError(400, `Invalid user IDs: ${invalidIds.join(", ")}`);
  };

  const result = await User.updateMany(
    { _id: { $in: ids }, isDeleted: false },
    { $set: { isDeleted: true } },
  );

  res.status(200).json({ success: true, message: `${result.modifiedCount} users deleted successfully.` });
});

