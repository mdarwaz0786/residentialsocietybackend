import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import FlatOwner from "../models/flatOwner.model.js";
import Role from "../models/role.model.js";
import asyncHandler from "../helpers/asynsHandler.js";
import ApiError from "../helpers/apiError.js";
import generateMemberId from "../helpers/generateMemberId.js";

// Create Flat Owner
export const createFlatOwner = asyncHandler(async (req, res) => {
  const {
    fullName,
    mobile,
    email,
    password,
    currentAddress,
    permanentAddress,
    status,
  } = req.body;

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

  const existingUser = await User.findOne({
    $or: [{ email }, { mobile }],
  });

  if (existingUser) {
    throw new ApiError(400, "User already exists with this email or mobile.");
  };

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const memberId = await generateMemberId("FOWN");

  const newUser = await User.create({
    fullName,
    profilePhoto: profilePhotoBase64,
    mobile,
    email,
    password: hashedPassword,
    role: flatOwnerRole._id,
    memberId,
    status,
  });

  const flatOwner = await FlatOwner.create({
    userId: newUser._id,
    currentAddress,
    permanentAddress,
    aadharCard: aadharCardBase64,
    allotment: allotmentBase64,
    vehicleRC: vehicleRCBase64,
  });

  res.status(201).json({ success: true, data: { user: newUser, flatOwner } });
});

// Get all Flat Owner
export const getFlatOwners = async (req, res) => {
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

    const flatOwners = await FlatOwner.aggregate([
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

    const totalCount = await FlatOwner.aggregate([
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
      message: "Flat owner fetched successfully",
      data: flatOwners,
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

// Get single Flat Owner
export const getFlatOwner = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Flat Owner ID.");
  };

  const flatOwner = await FlatOwner
    .findById(id)
    .populate({
      path: "userId",
      populate: {
        path: "role",
        model: "Role",
      },
    });

  if (!flatOwner) {
    throw new ApiError(404, "Flat Owner not found.");
  };

  res.status(200).json({ success: true, data: flatOwner });
});

// Update Flat Owner
export const updateFlatOwner = asyncHandler(async (req, res) => {
  const { id } = req.params;

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
    status,
    isActive,
    currentAddress,
    permanentAddress,
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

  await User.findByIdAndUpdate(flatOwner.userId._id, userUpdates);

  const flatOwnerUpdates = {};
  if (currentAddress) flatOwnerUpdates.currentAddress = currentAddress;
  if (permanentAddress) flatOwnerUpdates.permanentAddress = permanentAddress;
  if (aadharCardBase64) flatOwnerUpdates.aadharCard = aadharCardBase64;
  if (allotmentBase64) flatOwnerUpdates.allotment = allotmentBase64;
  if (vehicleRCBase64) flatOwnerUpdates.vehicleRC = vehicleRCBase64;

  const updatedFlatOwner = await FlatOwner.findByIdAndUpdate(id, flatOwnerUpdates, { new: true }).populate("userId");

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

  const user = await User.findById(flatOwner.userId);

  if (!user) {
    throw new ApiError(404, "User not found.");
  };

  user.isDeleted = true;
  await user.save();

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

  const flatOwners = await FlatOwner.find({ _id: { $in: ids } });

  if (flatOwners.length === 0) {
    throw new ApiError(404, "No Flat Owners found for the provided IDs.");
  };

  const userIds = flatOwners.map((owner) => owner.userId).filter(Boolean);

  const result = await User.updateMany(
    { _id: { $in: userIds }, isDeleted: false },
    { $set: { isDeleted: true } },
  );

  res.status(200).json({ success: true, message: `${result.modifiedCount} flat owners deleted successfully.` });
});

