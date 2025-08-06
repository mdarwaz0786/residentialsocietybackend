import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import Tenant from "../models/tenant.model.js";
import FlatOwner from "../models/flatOwner.model.js";
import SecurityGuard from "../models/securityGuard.model.js";
import MaintenanceStaff from "../models/maintenanceStaff.model.js";
import asyncHandler from "../helpers/asynsHandler.js";
import ApiError from "../helpers/apiError.js";
import ApiFeatures from "../helpers/ApiFeatures.js";
import formatApiResponse from "../helpers/formatApiResponse.js";
import generateMemberId from "../helpers/generateMemberId.js";
import compressImageToBase64 from "../helpers/compressImageToBase64.js";

// Create user
export const createUser = asyncHandler(async (req, res) => {
  const {
    fullName,
    mobile,
    email,
    password,
    role,
  } = req.body;

  const profilePhoto = req.files?.profilePhoto?.[0];

  const findRole = await Role.findById(role);

  if (!findRole) {
    throw new ApiError(404, "Role not found.");
  };

  const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });

  if (existingUser) {
    throw new ApiError(409, "User already exists with this email or mobile.");
  };

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const roleName = findRole?.roleName?.toUpperCase();
  let prefix;

  if (roleName === "admin") {
    prefix = "ADMIN";
  } else if (roleName === "sub admin") {
    prefix = "SUBADMIN";
  };

  const memberId = await generateMemberId(prefix);

  const profilePhotoBase64 = profilePhoto
    ? await compressImageToBase64(profilePhoto.buffer, profilePhoto.mimetype)
    : null;

  const user = await User.create({
    fullName,
    mobile,
    email,
    password: hashedPassword,
    role,
    profilePhoto: profilePhotoBase64,
    memberId,
  });

  res.status(201).json({ success: true, data: user });
});

// Get all users
export const getUsers = asyncHandler(async (req, res) => {
  const searchableFields = ["fullName", "email", "mobile", "memberId"];
  const filterableFields = ["profileType"];

  const { query, sort, skip, limit, page } = ApiFeatures(req, searchableFields, filterableFields, {
    defaultSortBy: "createdAt",
    defaultOrder: "desc",
  });

  const users = await User
    .find(query)
    .populate("role")
    .populate("profile")
    .sort(sort)
    .skip(skip)
    .limit(limit);

  if (!users) {
    throw new ApiError(404, "Users not found.");
  };

  const total = await User.countDocuments(query);

  res.status(200).json(formatApiResponse({ data: users, total, page, limit }));
});

// Get single user
export const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid User ID.");
  };

  const user = await User
    .findById(id)
    .populate("role")
    .populate("profile");

  if (!user) {
    throw new ApiError(404, "User not found.");
  };

  res.status(200).json({ success: true, data: user });
});

// Update user and their profile:
export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "User ID is invalid." });
  };

  const user = await User.findById(id).populate("profile");

  if (!user) {
    throw new ApiError(404, "User not found.");
  };

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const updates = { ...req.body };

    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(updates.password, salt);
      updates.password = hashedPassword;
    };

    const profilePhoto = req.files?.profilePhoto?.[0];

    const profilePhotoBase64 = profilePhoto
      ? await compressImageToBase64(profilePhoto.buffer, profilePhoto.mimetype)
      : null;

    if (profilePhotoBase64) {
      updates.profilePhoto = profilePhotoBase64;
    };

    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true, session });

    if (user?.profile && user?.profileType) {
      const profileUpdates = { ...req.body };

      if (profilePhotoBase64) {
        profileUpdates.profilePhoto = profilePhotoBase64;
      };

      if (profileUpdates.password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(profileUpdates.password, salt);
        profileUpdates.password = hashedPassword;
      };

      switch (user?.profileType) {
        case "FlatOwner":
          await FlatOwner.findByIdAndUpdate(user?.profile?._id, profileUpdates, { new: true, session });
          break;
        case "Tenant":
          await Tenant.findByIdAndUpdate(user?.profile?._id, profileUpdates, { new: true, session });
          break;
        case "SecurityGuard":
          await SecurityGuard.findByIdAndUpdate(user?.profile?._id, profileUpdates, { new: true, session });
          break;
        case "MaintenanceStaff":
          await MaintenanceStaff.findByIdAndUpdate(user?.profile?._id, profileUpdates, { new: true, session });
          break;
        default:
          throw new ApiError(400, "Something went wrong.");
      };
    };

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new ApiError(500, error.message || "Something went wrong.");
  };
});
