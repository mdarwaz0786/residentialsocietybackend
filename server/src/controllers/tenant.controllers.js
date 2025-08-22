import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Tenant from "../models/tenant.model.js";
import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import ApiError from "../helpers/apiError.js";
import FlatOwner from "../models/flatOwner.model.js";
import asyncHandler from "../helpers/asynsHandler.js";
import formatApiResponse from "../helpers/formatApiResponse.js";
import ApiFeatures from "../helpers/ApiFeatures.js";
import compressImageToBase64 from "../helpers/compressImageToBase64.js";

// Create Tenant
export const createTenant = asyncHandler(async (req, res) => {
  const createdBy = req.user?._id;

  const flatOwner = await FlatOwner
    .findOne({ userId: createdBy })
    .populate("flat")
    .select("flat");

  if (!flatOwner) {
    throw new ApiError(404, "Flat owner not found.")
  };

  const flatID = flatOwner?.flat?._id;

  if (!flatID) {
    throw new ApiError(400, "Flat ID is required.");
  };

  const {
    fullName,
    mobile,
    secondaryMobile,
    email,
    password,
    currentAddress,
    permanentAddress,
  } = req.body;

  const role = await Role.findOne({ roleName: "Tenant" });

  if (!role) {
    throw new ApiError(404, "Tenant role not found.");
  };

  const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });

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
  const rentAgreement = req?.files?.rentAgreement?.[0];
  const policeVerification = req?.files?.policeVerification?.[0];

  const [
    profilePhotoBase64,
    aadharCardBase64,
    rentAgreementBase64,
    policeVerificationBase64,
    vehicleRCBase64Array
  ] = await Promise.all([
    profilePhoto ? compressImageToBase64(profilePhoto.buffer, profilePhoto.mimetype) : null,
    aadharCard ? compressImageToBase64(aadharCard.buffer, aadharCard.mimetype) : null,
    rentAgreement ? compressImageToBase64(rentAgreement.buffer, rentAgreement.mimetype) : null,
    policeVerification ? compressImageToBase64(policeVerification.buffer, policeVerification.mimetype) : null,
  ]);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [newUser] = await User.create([{
      profilePhoto: profilePhotoBase64,
      fullName,
      email,
      mobile,
      password: hashedPassword,
      role: role?._id,
      profileType: "Tenant",
    }], { session });

    const [tenant] = await Tenant.create([{
      userId: newUser?._id,
      profilePhoto: profilePhotoBase64,
      fullName,
      email,
      mobile,
      secondaryMobile,
      password: hashedPassword,
      flat: flatID,
      role: role?._id,
      currentAddress,
      permanentAddress,
      aadharCard: aadharCardBase64,
      rentAgreement: rentAgreementBase64,
      policeVerification: policeVerificationBase64,
      createdBy,
    }], { session });

    newUser.profile = tenant?._id;
    await newUser.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ success: true, data: { user: newUser, tenant } });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new ApiError(500, error.message || "Something went wrong.");
  };
});

// Get all Tenants
export const getTenants = asyncHandler(async (req, res) => {
  const searchableFields = ["fullName", "email", "mobile", "memberId", "secondaryMobile"];
  const filterableFields = ["status", "isDeleted", "paymentStatus", "canLogin"];

  const { query, sort, skip, limit, page } = ApiFeatures(
    req,
    searchableFields,
    filterableFields,
    {
      defaultSortBy: "createdAt",
      defaultOrder: "desc",
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

  const tenant = await Tenant.findById(id).populate("flat role");

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
    secondaryMobile,
    email,
    password,
    currentAddress,
    permanentAddress,
  } = req.body;

  const existingUser = await User.findOne({
    $or: [{ email }, { mobile }],
    _id: { $ne: tenant?.userId?._id },
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
  const rentAgreement = req?.files?.rentAgreement?.[0];
  const policeVerification = req?.files?.policeVerification?.[0];

  const [
    profilePhotoBase64,
    aadharCardBase64,
    rentAgreementBase64,
    policeVerificationBase64,
    vehicleRCBase64Array
  ] = await Promise.all([
    profilePhoto ? compressImageToBase64(profilePhoto.buffer, profilePhoto.mimetype) : null,
    aadharCard ? compressImageToBase64(aadharCard.buffer, aadharCard.mimetype) : null,
    rentAgreement ? compressImageToBase64(rentAgreement.buffer, rentAgreement.mimetype) : null,
    policeVerification ? compressImageToBase64(policeVerification.buffer, policeVerification.mimetype) : null,
  ]);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userUpdates = {};
    if (fullName) userUpdates.fullName = fullName;
    if (mobile) userUpdates.mobile = mobile;
    if (email) userUpdates.email = email;
    if (hashedPassword) userUpdates.password = hashedPassword;
    if (profilePhotoBase64) userUpdates.profilePhoto = profilePhotoBase64;

    const updatedUser = await User.findByIdAndUpdate(tenant?.userId?._id, userUpdates, {
      new: true,
      session,
    });

    const updates = {};
    if (updatedBy) updates.updatedBy = updatedBy;
    if (updatedBy) updates.review = "Under Review";
    if (fullName) updates.fullName = fullName;
    if (mobile) updates.mobile = mobile;
    if (secondaryMobile) updates.secondaryMobile = secondaryMobile;
    if (email) updates.email = email;
    if (currentAddress) updates.currentAddress = currentAddress;
    if (permanentAddress) updates.permanentAddress = permanentAddress;
    if (hashedPassword) updates.password = hashedPassword;
    if (profilePhotoBase64) updates.profilePhoto = profilePhotoBase64;
    if (aadharCardBase64) updates.aadharCard = aadharCardBase64;
    if (rentAgreementBase64) updates.rentAgreement = rentAgreementBase64;
    if (policeVerificationBase64) updates.policeVerification = policeVerificationBase64;

    const updatedTenant = await Tenant.findByIdAndUpdate(id, updates, {
      new: true,
      session,
    });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ success: true, data: { tenant: updatedTenant, user: updatedUser } });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new ApiError(500, error.message || "Failed to update.");
  };
});

// Delete Tenant
export const deleteTenant = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Tenant ID.");
  };

  const tenant = await Tenant.findById(id);

  if (!tenant) {
    throw new ApiError(404, "Tenant not found.");
  };

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await User.deleteOne({ _id: tenant?.userId }, { session });
    await Tenant.deleteOne({ _id: id }, { session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ success: true, message: "Tenant deleted successfully." });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new ApiError(500, error.message || "Failed to delete.");
  };
});

// Update Tenant login
export const updateTenantLogin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { login } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Tenant ID.");
  };

  const tenant = await Tenant.findById(id);

  if (!tenant) {
    throw new ApiError(404, "Tenant not found.");
  };

  tenant.canLogin = login;
  await tenant.save();
  res.status(200).json({ success: true, message: "Tenant login updated." });
});
