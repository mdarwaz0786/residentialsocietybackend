import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Tenant from "../models/tenant.model.js";
import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import ApiError from "../helpers/apiError.js";
import FlatOwner from "../models/flatOwner.model.js";
import asyncHandler from "../helpers/asynsHandler.js";
import formatApiResponse from "../helpers/formatApiResponse.js";
import generateMemberId from "../helpers/generateMemberId.js";
import ApiFeatures from "../helpers/ApiFeatures.js";
import fileToBase64 from "../helpers/fileToBase64.js";

// Create Tenant
export const createTenant = asyncHandler(async (req, res) => {
  const createdBy = req.user?._id;

  const flatOwner = await FlatOwner.findOne({ userId: createdBy }).populate("flat").select("flat");

  if (!flatOwner) {
    throw new ApiError(404, "Flat owner not found.")
  };

  const flatID = flatOwner?.flat?._id;
  const flatNumber = flatOwner?.flat?.flatNumber;

  const {
    fullName,
    mobile,
    email,
    password,
    currentAddress,
    permanentAddress,
    fromDate,
    toDate,
  } = req.body;

  const role = await Role.findOne({ roleName: "Tenant", isDeleted: false });

  if (!role) {
    throw new ApiError(404, "Tenant role not found");
  };

  const profilePhoto = fileToBase64(req?.files?.profilePhoto?.[0]);
  const aadharCard = fileToBase64(req?.files?.aadharCard?.[0]);
  const rentAgreement = fileToBase64(req?.files?.rentAgreement?.[0]);
  const policeVerification = fileToBase64(req?.files?.policeVerification?.[0]);
  const vehicleRC = fileToBase64(req?.files?.vehicleRC?.[0]);

  const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });

  if (existingUser) {
    throw new ApiError(400, "User already exists with this email or mobile.");
  };

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const memberId = await generateMemberId("TENANT-", flatNumber);

  const newUser = await User.create({
    profilePhoto,
    fullName,
    email,
    mobile,
    password: hashedPassword,
    role: role?._id,
    memberId,
    profileType: "Tenant",
  });

  const tenant = await Tenant.create({
    userId: newUser?._id,
    profilePhoto,
    fullName,
    email,
    mobile,
    flat: flatID,
    role: role?._id,
    memberId,
    currentAddress,
    permanentAddress,
    fromDate,
    toDate,
    aadharCard,
    rentAgreement,
    policeVerification,
    vehicleRC,
    createdBy,
  });

  newUser.profile = tenant?._id;
  await newUser.save();

  res.status(201).json({ success: true, data: { user: newUser, tenant } });
});

// Get all Tenants
export const getTenants = asyncHandler(async (req, res) => {
  const searchableFields = ["fullName", "email", "mobile"];
  const filterableFields = ["status"];

  const { query, sort, skip, limit, page } = ApiFeatures(
    req,
    searchableFields,
    filterableFields,
    {
      softDelete: true,
      defaultSortBy: "createdAt",
      defaultOrder: "desc",
      defaultPage: 1,
      defaultLimit: 10,
    }
  );

  const tenants = await Tenant.find(query)
    .populate("flat role")
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await Tenant.countDocuments(query);

  res.status(200).json(formatApiResponse({ data: tenants, total, page, limit }));
});

// Get single Tenant
export const getTenant = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Tenant ID.");
  };

  const tenant = await Tenant.findOne({ _id: id, isDeleted: false }).populate("flat role");

  if (!tenant) {
    throw new ApiError(404, "Tenant not found.");
  };

  res.status(200).json({ success: true, data: tenant });
});

// Update Tenant
export const updateTenant = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updatedBy = req.user?._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Tenant ID.");
  };

  const tenant = await Tenant.findById(id).populate("userId");

  if (!tenant) {
    throw new ApiError(404, "Tenant not found.");
  };

  const {
    fullName,
    mobile,
    email,
    password,
    currentAddress,
    permanentAddress,
    fromDate,
    toDate,
  } = req.body;

  const conflictUser = await User.findOne({
    _id: { $ne: tenant.userId._id },
    $or: [{ email }, { mobile }],
  });

  if (conflictUser) {
    throw new ApiError(400, "Another user exists with this email or mobile.");
  };

  const profilePhoto = fileToBase64(req?.files?.profilePhoto?.[0]);
  const aadharCard = fileToBase64(req?.files?.aadharCard?.[0]);
  const rentAgreement = fileToBase64(req?.files?.rentAgreement?.[0]);
  const policeVerification = fileToBase64(req?.files?.policeVerification?.[0]);
  const vehicleRC = fileToBase64(req?.files?.vehicleRC?.[0]);

  const userUpdates = {};
  if (fullName) userUpdates.fullName = fullName;
  if (mobile) userUpdates.mobile = mobile;
  if (email) userUpdates.email = email;
  if (profilePhoto) userUpdates.profilePhoto = profilePhoto;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    userUpdates.password = await bcrypt.hash(password, salt);
  };

  await User.findByIdAndUpdate(tenant?.userId?._id, userUpdates, { new: true });

  const updates = { updatedBy };
  if (fullName) updates.fullName = fullName;
  if (mobile) updates.mobile = mobile;
  if (email) updates.email = email;
  if (flat) updates.flat = flat;
  if (currentAddress) updates.currentAddress = currentAddress;
  if (permanentAddress) updates.permanentAddress = permanentAddress;
  if (fromDate) updates.fromDate = fromDate;
  if (toDate) updates.toDate = toDate;
  if (profilePhoto) updates.profilePhoto = profilePhoto;
  if (aadharCard) updates.aadharCard = aadharCard;
  if (rentAgreement) updates.rentAgreement = rentAgreement;
  if (policeVerification) updates.policeVerification = policeVerification;
  if (vehicleRC) updates.vehicleRC = vehicleRC;

  const updatedTenant = await Tenant.findByIdAndUpdate(id, updates, { new: true });

  res.status(200).json({ success: true, data: updatedTenant });
});

// Soft delete single Tenant
export const softDeleteTenant = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Tenant ID.");
  };

  const tenant = await Tenant.findById(id);

  if (!tenant) {
    throw new ApiError(404, "Tenant not found.");
  };

  tenant.isDeleted = true;
  await tenant.save();

  res.status(200).json({ success: true, message: "Tenant deleted successfully." });
});

// Sof delete multiple Tenants
export const softDeleteTenants = asyncHandler(async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    throw new ApiError(400, "Please provide an array of Tenant IDs.");
  };

  const invalidIds = ids.filter((id) => !mongoose.Types.ObjectId.isValid(id));

  if (invalidIds.length > 0) {
    throw new ApiError(400, `Invalid IDs: ${invalidIds.join(", ")}`);
  };

  const tenants = await Tenant.find({ _id: { $in: ids }, isDeleted: false });

  const idsToDelete = tenants.map((t) => t?._id);

  const result = await Tenant.updateMany(
    { _id: { $in: idsToDelete } },
    { $set: { isDeleted: true } },
  );

  res.status(200).json({ success: true, message: `${result.modifiedCount} tenants deleted successfully.` });
});
