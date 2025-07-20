import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import SecurityGuard from "../models/securityGuard.model.js";
import Role from "../models/role.model.js";
import asyncHandler from "../helpers/asynsHandler.js";
import ApiError from "../helpers/apiError.js";
import generateMemberId from "../helpers/generateMemberId.js";
import ApiFeatures from "../helpers/ApiFeatures.js";
import formatApiResponse from "../helpers/formatApiResponse.js";

// Create Security Guard
export const createSecurityGuard = asyncHandler(async (req, res) => {
  const createdBy = req.user?._id;

  const {
    fullName,
    mobile,
    email,
    password,
    currentAddress,
    permanentAddress,
    gateNumber,
  } = req.body;

  const role = await Role.findOne({ roleName: "Security Guard", isDeleted: false });

  if (!role) {
    throw new ApiError(404, "Security guard role not found. Please create it in Role collection first.");
  };

  const profilePhoto = req?.files?.profilePhoto?.[0];
  const aadharCard = req?.files?.aadharCard?.[0];

  const profilePhotoBase64 = profilePhoto
    ? `data:${profilePhoto.mimetype};base64,${profilePhoto.buffer.toString("base64")}`
    : null;

  const aadharCardBase64 = aadharCard
    ? `data:${aadharCard.mimetype};base64,${aadharCard.buffer.toString("base64")}`
    : null;

  const existingUser = await User.findOne({
    $or: [{ email }, { mobile }],
  });

  if (existingUser) {
    throw new ApiError(400, "User already exists with this email or mobile.");
  };

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const memberId = await generateMemberId("MTS-");

  const newUser = await User.create({
    profilePhoto: profilePhotoBase64,
    fullName,
    mobile,
    email,
    password: hashedPassword,
    role: role?._id,
    memberId,
    profileType: "SecurityGuard",
  });

  const securityGuard = await SecurityGuard.create({
    userId: newUser?._id,
    fullName,
    profilePhoto: profilePhotoBase64,
    mobile,
    email,
    password: hashedPassword,
    role: role?._id,
    memberId,
    currentAddress,
    permanentAddress,
    aadharCard: aadharCardBase64,
    gateNumber,
    createdBy,
  });

  newUser.profile = securityGuard?._id;
  await newUser.save();

  res.status(201).json({ success: true, data: { user: newUser, securityGuard } });
});

// Get all Security Guards
export const getSecurityGuards = async (req, res) => {
  const searchableFields = ["fullName", "email", "mobile"];
  const filterableFields = ["status"];

  const { query, sort, skip, limit, page } = ApiFeatures(req, searchableFields, filterableFields, {
    softDelete: true,
    defaultSortBy: "createdAt",
    defaultOrder: "desc",
    defaultPage: 1,
    defaultLimit: 10,
  });

  const securityGuard = await SecurityGuard
    .find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await SecurityGuard.countDocuments(query);

  res.status(200).json(formatApiResponse({ data: securityGuard, total, page, limit }));
};

// Get single Security Guard
export const getSecurityGuard = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid security guard ID.");
  };

  const securityGuard = await SecurityGuard.findById(id);

  if (!securityGuard) {
    throw new ApiError(404, "Security guard not found.");
  };

  res.status(200).json({ success: true, data: securityGuard });
});

// Update Security Guard
export const updateSecurityGuard = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updatedBy = req.user?._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid security guard ID.");
  };

  const securityGuard = await SecurityGuard.findById(id).populate("userId");

  if (!securityGuard) {
    throw new ApiError(404, "Security guard not found.");
  };

  const {
    fullName,
    mobile,
    email,
    password,
    currentAddress,
    permanentAddress,
    gateNumber,
    status,
  } = req.body;

  const profilePhoto = req?.files?.profilePhoto?.[0];
  const aadharCard = req?.files?.aadharCard?.[0];

  const profilePhotoBase64 = profilePhoto
    ? `data:${profilePhoto.mimetype};base64,${profilePhoto.buffer.toString("base64")}`
    : null;

  const aadharCardBase64 = aadharCard
    ? `data:${aadharCard.mimetype};base64,${aadharCard.buffer.toString("base64")}`
    : null;

  const userUpdates = {};
  if (fullName) userUpdates.fullName = fullName;
  if (mobile) userUpdates.mobile = mobile;
  if (email) userUpdates.email = email;
  if (profilePhotoBase64) userUpdates.profilePhoto = profilePhotoBase64;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    userUpdates.password = await bcrypt.hash(password, salt);
  };

  await User.findByIdAndUpdate(securityGuard.userId._id, userUpdates);

  const securityGuardUpdates = {};
  securityGuardUpdates.updatedBy = updatedBy;
  if (fullName) securityGuardUpdates.fullName = fullName;
  if (mobile) securityGuardUpdates.mobile = mobile;
  if (email) securityGuardUpdates.email = email;
  if (status) securityGuardUpdates.status = status;
  if (gateNumber) securityGuardUpdates.gateNumber = gateNumber;
  if (currentAddress) securityGuardUpdates.currentAddress = currentAddress;
  if (permanentAddress) securityGuardUpdates.permanentAddress = permanentAddress;
  if (aadharCardBase64) securityGuardUpdates.aadharCard = aadharCardBase64;

  const updatedSecurityGuard = await SecurityGuard.findByIdAndUpdate(id, securityGuardUpdates, { new: true });

  res.status(200).json({ success: true, data: updatedSecurityGuard });
});

// Soft Delete Security Guard
export const softDeleteSecurityGuard = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid ID.");
  };

  const securityGuard = await SecurityGuard.findById(id);

  if (!securityGuard) {
    throw new ApiError(404, "Security Guard not found.");
  };

  securityGuard.isDeleted = true;
  await securityGuard.save();

  res.status(200).json({ success: true, message: "Security Guard deleted successfully." });
});

// Soft delete multiple Security Guard
export const softDeleteScurityGuards = asyncHandler(async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    throw new ApiError(400, "Please provide an array of IDs.");
  };

  const invalidIds = ids.filter((id) => !mongoose.Types.ObjectId.isValid(id));

  if (invalidIds.length > 0) {
    throw new ApiError(400, `Invalid IDs: ${invalidIds.join(", ")}`);
  };

  const securityGuards = await SecurityGuard.find({ _id: { $in: ids } }).lean();

  if (securityGuards.length === 0) {
    throw new ApiError(404, "No security guard found for the provided IDs.");
  };

  const idsToDelete = securityGuards.map((owner) => owner?._id);

  const result = await SecurityGuard.updateMany(
    { _id: { $in: idsToDelete }, isDeleted: false },
    { $set: { isDeleted: true } }
  );

  res.status(200).json({ success: true, message: `${result.modifiedCount} security guard deleted successfully.` });
});
