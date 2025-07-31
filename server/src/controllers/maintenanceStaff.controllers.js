import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import MaintenanceStaff from "../models/maintenanceStaff.model.js";
import Role from "../models/role.model.js";
import asyncHandler from "../helpers/asynsHandler.js";
import ApiError from "../helpers/apiError.js";
import generateMemberId from "../helpers/generateMemberId.js";
import ApiFeatures from "../helpers/ApiFeatures.js";
import formatApiResponse from "../helpers/formatApiResponse.js";

// Create Maintenance Staff
export const createMaintenanceStaff = asyncHandler(async (req, res) => {
  const createdBy = req.user?._id;

  const {
    fullName,
    mobile,
    email,
    password,
    currentAddress,
    permanentAddress,
  } = req.body;

  const role = await Role.findOne({ roleName: "Maintenance Staff", isDeleted: false });

  if (!role) {
    throw new ApiError(404, "Maintenance staff role not found.");
  };

  const existingUser = await User.findOne({
    $or: [{ email }, { mobile }],
  });

  if (existingUser) {
    throw new ApiError(400, "User already exists with this email or mobile.");
  };

  const memberId = await generateMemberId("MTS-");

  if (!memberId) {
    throw new ApiError(500, "Failed to generate member ID.");
  };

  const profilePhoto = req?.files?.profilePhoto?.[0];
  const aadharCard = req?.files?.aadharCard?.[0];

  const profilePhotoBase64 = profilePhoto
    ? `data:${profilePhoto.mimetype};base64,${profilePhoto.buffer.toString("base64")}`
    : null;

  const aadharCardBase64 = aadharCard
    ? `data:${aadharCard.mimetype};base64,${aadharCard.buffer.toString("base64")}`
    : null;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [newUser] = await User.create([{
      profilePhoto: profilePhotoBase64,
      fullName,
      mobile,
      email,
      password: hashedPassword,
      role: role?._id,
      memberId,
      profileType: "MaintenanceStaff",
    }], { session });

    const [maintenanceStaff] = await MaintenanceStaff.create([{
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
      createdBy,
    }], { session });

    newUser.profile = maintenanceStaff?._id;
    await newUser.save();

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ success: true, data: { user: newUser, maintenanceStaff } });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new ApiError(500, error.message || "Something went wrong.");
  };
});

// Get all Maintenance Staffs
export const getMaintenanceStaffs = async (req, res) => {
  const searchableFields = ["fullName", "email", "mobile"];
  const filterableFields = ["status"];

  const { query, sort, skip, limit, page } = ApiFeatures(req, searchableFields, filterableFields, {
    softDelete: true,
    defaultSortBy: "createdAt",
    defaultOrder: "desc",
  });

  const maintenanceStaff = await MaintenanceStaff
    .find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await MaintenanceStaff.countDocuments(query);

  res.status(200).json(formatApiResponse({ data: maintenanceStaff, total, page, limit }));
};

// Get single Maintenance Staff
export const getMaintenanceStaff = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid maintenance staff ID.");
  };

  const maintenanceStaff = await MaintenanceStaff.findById(id);

  if (!maintenanceStaff) {
    throw new ApiError(404, "Maintenance staff not found.");
  };

  res.status(200).json({ success: true, data: maintenanceStaff });
});

// Update Maintenance Staff
export const updateMaintenanceStaff = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updatedBy = req.user?._id;

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
    currentAddress,
    permanentAddress,
    status,
  } = req.body;

  const existingUser = await User.findOne({
    $or: [{ email }, { mobile }],
    _id: { $ne: maintenanceStaff?.userId?._id },
  });

  if (existingUser) {
    throw new ApiError(400, "User already exists with this email or mobile.");
  };

  let hashedPassword = null;
  let salt = null;

  if (password) {
    salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(password, salt);
  };

  const profilePhoto = req?.files?.profilePhoto?.[0];
  const aadharCard = req?.files?.aadharCard?.[0];

  const profilePhotoBase64 = profilePhoto
    ? `data:${profilePhoto.mimetype};base64,${profilePhoto.buffer.toString("base64")}`
    : null;

  const aadharCardBase64 = aadharCard
    ? `data:${aadharCard.mimetype};base64,${aadharCard.buffer.toString("base64")}`
    : null;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userUpdates = {};
    if (fullName) userUpdates.fullName = fullName;
    if (mobile) userUpdates.mobile = mobile;
    if (email) userUpdates.email = email;
    if (profilePhotoBase64) userUpdates.profilePhoto = profilePhotoBase64;
    if (hashedPassword) userUpdates.password = hashedPassword;

    const updatedUser = await User.findByIdAndUpdate(maintenanceStaff?.userId._id, userUpdates, {
      new: true,
      session,
    });

    const maintenanceStaffUpdates = { updatedBy };
    if (fullName) maintenanceStaffUpdates.fullName = fullName;
    if (mobile) maintenanceStaffUpdates.mobile = mobile;
    if (email) maintenanceStaffUpdates.email = email;
    if (hashedPassword) maintenanceStaffUpdates.password = hashedPassword;
    if (status) maintenanceStaffUpdates.status = status;
    if (currentAddress) maintenanceStaffUpdates.currentAddress = currentAddress;
    if (permanentAddress) maintenanceStaffUpdates.permanentAddress = permanentAddress;
    if (aadharCardBase64) maintenanceStaffUpdates.aadharCard = aadharCardBase64;

    const updatedMaintenanceStaff = await MaintenanceStaff.findByIdAndUpdate(id, maintenanceStaffUpdates, { new: true });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ success: true, data: { user: updatedUser, maintenanceStaff: updatedMaintenanceStaff } });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new ApiError(500, error.message || "Failed to update.");
  };
});

// Soft Delete Maintenance Staff
export const softDeleteMaintenanceStaff = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid ID.");
  };

  const maintenanceStaff = await MaintenanceStaff.findById(id);

  if (!maintenanceStaff) {
    throw new ApiError(404, "Maintenance Staff not found.");
  };

  maintenanceStaff.isDeleted = true;
  await maintenanceStaff.save();

  res.status(200).json({ success: true, message: "Maintenance Staff deleted successfully." });
});

// Soft delete multiple Maintenance Staff
export const softDeletemaintenanceStaffs = asyncHandler(async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    throw new ApiError(400, "Please provide an array of IDs.");
  };

  const invalidIds = ids.filter((id) => !mongoose.Types.ObjectId.isValid(id));

  if (invalidIds.length > 0) {
    throw new ApiError(400, `Invalid IDs: ${invalidIds.join(", ")}`);
  };

  const maintenanceStaffs = await MaintenanceStaff.find({ _id: { $in: ids } }).lean();

  if (maintenanceStaffs.length === 0) {
    throw new ApiError(404, "No maintenance staff found for the provided IDs.");
  };

  const idsToDelete = maintenanceStaffs.map((owner) => owner?._id);

  const result = await MaintenanceStaff.updateMany(
    { _id: { $in: idsToDelete }, isDeleted: false },
    { $set: { isDeleted: true } }
  );

  res.status(200).json({ success: true, message: `${result.modifiedCount} maintenance staff deleted successfully.` });
});

