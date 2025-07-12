import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import SecurityGuard from "../models/securityGuard.model.js";
import Role from "../models/role.model.js";
import asyncHandler from "../helpers/asynsHandler.js";
import ApiError from "../helpers/apiError.js";
import generateMemberId from "../helpers/generateMemberId.js";

// Create Security Guard
export const createSecurityGuard = asyncHandler(async (req, res) => {
  const {
    fullName,
    mobile,
    email,
    password,
    currentAddress,
    permanentAddress,
    status,
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

  const memberId = await generateMemberId("SGD");

  const newUser = await User.create({
    fullName,
    profilePhoto: profilePhotoBase64,
    mobile,
    email,
    password: hashedPassword,
    role: role._id,
    memberId,
    status,
  });

  const securityGuard = await SecurityGuard.create({
    userId: newUser._id,
    currentAddress,
    permanentAddress,
    aadharCard: aadharCardBase64,
  });

  res.status(201).json({ success: true, data: { user: newUser, securityGuard } });
});

// Get all Security Guards
export const getSecurityGuards = async (req, res) => {
  try {
    const {
      search,
      status,
      isActive,
      isDeleted,
      role,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const matchStage = {};

    if (search) {
      matchStage.$or = [
        { currentAddress: { $regex: search, $options: "i" } },
        { permanentAddress: { $regex: search, $options: "i" } },
        { "user.fullName": { $regex: search, $options: "i" } },
        { "user.email": { $regex: search, $options: "i" } },
        { "user.memberId": { $regex: search, $options: "i" } },
        { "user.mobile": { $regex: search, $options: "i" } },
        { "user.role.roleName": { $regex: search, $options: "i" } },
      ];
    };

    if (status) matchStage["user.status"] = status;
    if (isActive !== undefined) matchStage["user.isActive"] = isActive === "true";
    if (isDeleted !== undefined) matchStage["user.isDeleted"] = isDeleted === "true";
    if (role) matchStage["user.role.roleName"] = role;

    const securityGuards = await SecurityGuard.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "roles",
          localField: "user.role",
          foreignField: "_id",
          as: "user.role"
        }
      },
      {
        $unwind: {
          path: "$user.role",
          preserveNullAndEmptyArrays: true
        }
      },
      { $match: matchStage },
      {
        $sort: {
          [sortBy]: sortOrder === "asc" ? 1 : -1,
        },
      },
      {
        $skip: (parseInt(page) - 1) * parseInt(limit),
      },
      {
        $limit: parseInt(limit),
      },
    ]);

    const totalCount = await SecurityGuard.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "roles",
          localField: "user.role",
          foreignField: "_id",
          as: "user.role"
        }
      },
      {
        $unwind: {
          path: "$user.role",
          preserveNullAndEmptyArrays: true
        }
      },
      { $match: matchStage },
      { $count: "total" },
    ]);

    const total = totalCount[0]?.total || 0;
    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      message: "Security guard fetched successfully",
      data: securityGuards,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server Error" });
  };
};

// Get single Security Guard
export const getSecurityGuard = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid security guard ID.");
  };

  const securityGuard = await SecurityGuard.findById(id).populate({
    path: "userId",
    populate: {
      path: "role",
      model: "Role",
    },
  });

  if (!securityGuard) {
    throw new ApiError(404, "Security guard not found.");
  };

  res.status(200).json({ success: true, data: securityGuard });
});

// Update Security Guard
export const updateSecurityGuard = asyncHandler(async (req, res) => {
  const { id } = req.params;

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
    status,
    isActive,
    currentAddress,
    permanentAddress,
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
  if (status) userUpdates.status = status;
  if (isActive) userUpdates.isActive = isActive;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    userUpdates.password = await bcrypt.hash(password, salt);
  };

  await User.findByIdAndUpdate(securityGuard.userId._id, userUpdates);

  const securityGuardUpdates = {};
  if (currentAddress) securityGuardUpdates.currentAddress = currentAddress;
  if (permanentAddress) securityGuardUpdates.permanentAddress = permanentAddress;
  if (aadharCardBase64) securityGuardUpdates.aadharCard = aadharCardBase64;

  const updatedSecurityGuard = await SecurityGuard.findByIdAndUpdate(id, securityGuardUpdates, { new: true }).populate("userId");

  res.status(200).json({ success: true, data: updatedSecurityGuard });
});

// Soft Delete Security Guard
export const softDeleteSecurityGuard = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid security guard ID.");
  };

  const securityGuard = await SecurityGuard.findById(id);

  if (!securityGuard) {
    throw new ApiError(404, "Security guard not found.");
  };

  const user = await User.findById(securityGuard.userId);

  if (!user) {
    throw new ApiError(404, "User not found.");
  };

  user.isDeleted = true;
  await user.save();

  res.status(200).json({ success: true, message: "Security guard deleted successfully." });
});

// Soft delete multiple Security Guard
export const softDeleteSecurityGuards = asyncHandler(async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    throw new ApiError(400, "Please provide an array of security guards IDs.");
  };

  const invalidIds = ids.filter((id) => !mongoose.Types.ObjectId.isValid(id));

  if (invalidIds.length > 0) {
    throw new ApiError(400, `Invalid security guard IDs: ${invalidIds.join(", ")}`);
  };

  const securityGuards = await SecurityGuard.find({ _id: { $in: ids } });

  if (securityGuards.length === 0) {
    throw new ApiError(404, "No security guard found for the provided IDs.");
  };

  const userIds = securityGuards.map((owner) => owner.userId).filter(Boolean);

  const result = await User.updateMany(
    { _id: { $in: userIds }, isDeleted: false },
    { $set: { isDeleted: true } },
  );

  res.status(200).json({ success: true, message: `${result.modifiedCount} security guard deleted successfully.` });
});

