import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import MaintenanceStaff from "../models/maintenanceStaff.model.js";
import Role from "../models/role.model.js";
import asyncHandler from "../helpers/asynsHandler.js";
import ApiError from "../helpers/apiError.js";
import generateMemberId from "../helpers/generateMemberId.js";

// Create Maintenance Staff
export const createMaintenanceStaff = asyncHandler(async (req, res) => {
  const {
    fullName,
    mobile,
    email,
    password,
    currentAddress,
    permanentAddress,
    status,
  } = req.body;

  const role = await Role.findOne({ roleName: "Maintenance Staff", isDeleted: false });

  if (!role) {
    throw new ApiError(404, "Maintenance staff role not found. Please create it in Role collection first.");
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

  const memberId = await generateMemberId("MTS");

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

  const maintenanceStaff = await MaintenanceStaff.create({
    userId: newUser._id,
    currentAddress,
    permanentAddress,
    aadharCard: aadharCardBase64,
  });

  res.status(201).json({ success: true, data: { user: newUser, maintenanceStaff } });
});

// Get all Maintenance Staffs
export const getMaintenanceStaffs = async (req, res) => {
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

    const maintenanceStaffs = await MaintenanceStaff.aggregate([
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

    const totalCount = await MaintenanceStaff.aggregate([
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
      message: "Maintenance staff fetched successfully",
      data: maintenanceStaffs,
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

// Get single Maintenance Staff
export const getMaintenanceStaff = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid maintenance staff ID.");
  };

  const maintenanceStaff = await MaintenanceStaff.findById(id).populate({
    path: "userId",
    populate: {
      path: "role",
      model: "Role",
    },
  });

  if (!maintenanceStaff) {
    throw new ApiError(404, "Maintenance staff not found.");
  };

  res.status(200).json({ success: true, data: maintenanceStaff });
});

// Update Maintenance Staff
export const updateMaintenanceStaff = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid maintenance staff ID.");
  };

  const maintenanceStaff = await MaintenanceStaff.findById(id).populate("userId");

  if (!maintenanceStaff) {
    throw new ApiError(404, "Maintenance staff not found.");
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

  await User.findByIdAndUpdate(maintenanceStaff.userId._id, userUpdates);

  const maintenanceStaffUpdates = {};
  if (currentAddress) maintenanceStaffUpdates.currentAddress = currentAddress;
  if (permanentAddress) maintenanceStaffUpdates.permanentAddress = permanentAddress;
  if (aadharCardBase64) maintenanceStaffUpdates.aadharCard = aadharCardBase64;

  const updatedMaintenanceStaff = await MaintenanceStaff.findByIdAndUpdate(id, maintenanceStaffUpdates, { new: true }).populate("userId");

  res.status(200).json({ success: true, data: updatedMaintenanceStaff });
});

// Soft Delete Maintenance Staff
export const softDeleteMaintenanceStaff = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid maintenance staff ID.");
  };

  const maintenanceStaff = await MaintenanceStaff.findById(id);

  if (!maintenanceStaff) {
    throw new ApiError(404, "Maintenance staff not found.");
  };

  const user = await User.findById(maintenanceStaff.userId);

  if (!user) {
    throw new ApiError(404, "User not found.");
  };

  user.isDeleted = true;
  await user.save();

  res.status(200).json({ success: true, message: "Maintenance staff deleted successfully." });
});

// Soft delete multiple Maintenance Staff
export const softDeleteMaintenanceStaffs = asyncHandler(async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    throw new ApiError(400, "Please provide an array of maintenance Staffs IDs.");
  };

  const invalidIds = ids.filter((id) => !mongoose.Types.ObjectId.isValid(id));

  if (invalidIds.length > 0) {
    throw new ApiError(400, `Invalid maintenance staff IDs: ${invalidIds.join(", ")}`);
  };

  const maintenanceStaffs = await MaintenanceStaff.find({ _id: { $in: ids } });

  if (maintenanceStaffs.length === 0) {
    throw new ApiError(404, "No maintenance staff found for the provided IDs.");
  };

  const userIds = maintenanceStaffs.map((m) => m.userId).filter(Boolean);

  const result = await User.updateMany(
    { _id: { $in: userIds }, isDeleted: false },
    { $set: { isDeleted: true } },
  );

  res.status(200).json({ success: true, message: `${result.modifiedCount} maintenance staff deleted successfully.` });
});

