import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import FlatOwner from "../models/flatOwner.model.js";
import Role from "../models/role.model.js";
import Flat from "../models/flat.model.js";
import asyncHandler from "../helpers/asynsHandler.js";
import ApiError from "../helpers/apiError.js";
import generateMemberId from "../helpers/generateMemberId.js";
import ApiFeatures from "../helpers/ApiFeatures.js";
import formatApiResponse from "../helpers/formatApiResponse.js";

// Create Flat Owner
export const createFlatOwner = asyncHandler(async (req, res) => {
  const createdBy = req.user?._id;

  const {
    fullName,
    mobile,
    email,
    password,
    currentAddress,
    permanentAddress,
    flat,
  } = req.body;

  const ownerFlat = await Flat.findById(flat);

  if (!ownerFlat) {
    throw new ApiError(404, "Flat not found.");
  };

  const flatOwnerRole = await Role.findOne({ roleName: "Flat Owner", isDeleted: false });

  if (!flatOwnerRole) {
    throw new ApiError(404, "Flat Owner role not found. Please create it in Role collection first.");
  };

  const profilePhoto = req?.files?.profilePhoto?.[0];
  const aadharCard = req?.files?.aadharCard?.[0];
  const allotment = req?.files?.allotment?.[0];
  const vehicleRC = req?.files?.vehicleRC?.[0];

  const profilePhotoBase64 = profilePhoto
    ? `data:${profilePhoto.mimetype};base64,${profilePhoto.buffer.toString("base64")}`
    : null;

  const aadharCardBase64 = aadharCard
    ? `data:${aadharCard.mimetype};base64,${aadharCard.buffer.toString("base64")}`
    : null;

  const allotmentBase64 = allotment
    ? `data:${allotment.mimetype};base64,${allotment.buffer.toString("base64")}`
    : null;

  const vehicleRCBase64 = vehicleRC
    ? `data:${vehicleRC.mimetype};base64,${vehicleRC.buffer.toString("base64")}`
    : null;

  const orConditions = [];
  if (email) orConditions.push({ email });
  if (mobile) orConditions.push({ mobile });

  if (orConditions.length > 0) {
    const existingUser = await User.findOne({ $or: orConditions });
    if (existingUser) {
      throw new ApiError(400, "User already exists with this email or mobile.");
    };
  };

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const flatNumber = ownerFlat?.flatNumber;
  const memberId = await generateMemberId("FOWN-", flatNumber);

  const newUser = await User.create({
    profilePhoto: profilePhotoBase64,
    fullName,
    mobile,
    email,
    password: hashedPassword,
    role: flatOwnerRole?._id,
    memberId,
    profileType: "FlatOwner",
  });

  const flatOwner = await FlatOwner.create({
    userId: newUser._id,
    profilePhoto: profilePhotoBase64,
    fullName,
    mobile,
    email,
    role: flatOwnerRole._id,
    memberId,
    flat,
    currentAddress,
    permanentAddress,
    aadharCard: aadharCardBase64,
    allotment: allotmentBase64,
    vehicleRC: vehicleRCBase64,
    createdBy,
  });

  newUser.profile = flatOwner?._id;
  await newUser.save();

  res.status(201).json({ success: true, data: { user: newUser, flatOwner } });
});

// Get all Flat Owner
export const getFlatOwners = async (req, res) => {
  const searchableFields = ["fullName", "email", "mobile"];
  const filterableFields = ["status"];

  const { query, sort, skip, limit, page } = ApiFeatures(req, searchableFields, filterableFields, {
    softDelete: true,
    defaultSortBy: "createdAt",
    defaultOrder: "desc",
    defaultPage: 1,
    defaultLimit: 10,
  });

  const flatOwners = await FlatOwner
    .find(query)
    .populate("flat")
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await FlatOwner.countDocuments(query);

  res.status(200).json(formatApiResponse({ data: flatOwners, total, page, limit }));
};

// Get single Flat Owner
export const getFlatOwner = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Flat Owner ID.");
  };

  const flatOwner = await FlatOwner
    .findById(id)
    .populate("flat");

  if (!flatOwner) {
    throw new ApiError(404, "Flat Owner not found.");
  };

  res.status(200).json({ success: true, data: flatOwner });
});

// Update Flat Owner
export const updateFlatOwner = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updatedBy = req.user?._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Flat Owner ID.");
  };

  const flatOwner = await FlatOwner.findById(id).populate("userId");

  if (!flatOwner) {
    throw new ApiError(404, "Flat Owner not found.");
  };

  const {
    fullName,
    mobile,
    email,
    password,
    currentAddress,
    permanentAddress,
    flat,
    status,
  } = req.body;

  const profilePhoto = req?.files?.profilePhoto?.[0];
  const aadharCard = req?.files?.aadharCard?.[0];
  const allotment = req?.files?.allotment?.[0];
  const vehicleRC = req?.files?.vehicleRC?.[0];

  const profilePhotoBase64 = profilePhoto
    ? `data:${profilePhoto.mimetype};base64,${profilePhoto.buffer.toString("base64")}`
    : null;

  const aadharCardBase64 = aadharCard
    ? `data:${aadharCard.mimetype};base64,${aadharCard.buffer.toString("base64")}`
    : null;

  const allotmentBase64 = allotment
    ? `data:${allotment.mimetype};base64,${allotment.buffer.toString("base64")}`
    : null;

  const vehicleRCBase64 = vehicleRC
    ? `data:${vehicleRC.mimetype};base64,${vehicleRC.buffer.toString("base64")}`
    : null;

  // Update User
  const userUpdates = {};
  if (fullName) userUpdates.fullName = fullName;
  if (mobile) userUpdates.mobile = mobile;
  if (email) userUpdates.email = email;
  if (profilePhotoBase64) userUpdates.profilePhoto = profilePhotoBase64;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    userUpdates.password = await bcrypt.hash(password, salt);
  };

  await User.findByIdAndUpdate(flatOwner.userId._id, userUpdates, { new: true });

  // Update FlatOwner
  const flatOwnerUpdates = {};
  flatOwnerUpdates.updatedBy = updatedBy;
  if (fullName) flatOwnerUpdates.fullName = fullName;
  if (mobile) flatOwnerUpdates.mobile = mobile;
  if (email) flatOwnerUpdates.email = email;
  if (flat) flatOwnerUpdates.flat = flat;
  if (status) flatOwnerUpdates.status = status;
  if (currentAddress) flatOwnerUpdates.currentAddress = currentAddress;
  if (permanentAddress) flatOwnerUpdates.permanentAddress = permanentAddress;
  if (profilePhotoBase64) flatOwnerUpdates.profilePhoto = profilePhotoBase64;
  if (aadharCardBase64) flatOwnerUpdates.aadharCard = aadharCardBase64;
  if (allotmentBase64) flatOwnerUpdates.allotment = allotmentBase64;
  if (vehicleRCBase64) flatOwnerUpdates.vehicleRC = vehicleRCBase64;

  const updatedFlatOwner = await FlatOwner.findByIdAndUpdate(id, flatOwnerUpdates, { new: true });

  res.status(200).json({ success: true, data: updatedFlatOwner });
});

// Soft Delete Flat Owner
export const softDeleteFlatOwner = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Flat Owner ID.");
  };

  const flatOwner = await FlatOwner.findById(id);

  if (!flatOwner) {
    throw new ApiError(404, "Flat Owner not found.");
  };

  flatOwner.isDeleted = true;
  await flatOwner.save();

  res.status(200).json({ success: true, message: "Flat owner deleted successfully." });
});

// Soft delete multiple flat owners
export const softDeleteFlatOwners = asyncHandler(async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    throw new ApiError(400, "Please provide an array of Flat Owner IDs.");
  };

  const invalidIds = ids.filter((id) => !mongoose.Types.ObjectId.isValid(id));

  if (invalidIds.length > 0) {
    throw new ApiError(400, `Invalid Flat Owner IDs: ${invalidIds.join(", ")}`);
  };

  const flatOwners = await FlatOwner.find({ _id: { $in: ids } }).lean();

  if (flatOwners.length === 0) {
    throw new ApiError(404, "No Flat Owners found for the provided IDs.");
  };

  const idsToDelete = flatOwners.map((owner) => owner?._id);

  const result = await FlatOwner.updateMany(
    { _id: { $in: idsToDelete }, isDeleted: false },
    { $set: { isDeleted: true } }
  );

  res.status(200).json({ success: true, message: `${result.modifiedCount} flat owners deleted successfully.` });
});


