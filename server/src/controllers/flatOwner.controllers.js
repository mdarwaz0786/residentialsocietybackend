import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import FlatOwner from "../models/flatOwner.model.js";
import Role from "../models/role.model.js";
import Flat from "../models/flat.model.js";
import asyncHandler from "../helpers/asynsHandler.js";
import ApiError from "../helpers/apiError.js";
import ApiFeatures from "../helpers/ApiFeatures.js";
import formatApiResponse from "../helpers/formatApiResponse.js";
import generateMemberId from "../helpers/generateMemberId.js";
import compressImageToBase64 from "../helpers/compressImageToBase64.js";

// Create Flat Owner
export const createFlatOwner = asyncHandler(async (req, res) => {

  const {
    fullName,
    mobile,
    secondaryMobile,
    email,
    password,
    currentAddress,
    permanentAddress,
    flat,
  } = req.body;

  const findFlat = await Flat.findById(flat);

  if (!findFlat) {
    throw new ApiError(404, "Flat not found.");
  };

  const flatOwnerRole = await Role.findOne({ roleName: "Flat Owner" });

  if (!flatOwnerRole) {
    throw new ApiError(404, "Flat Owner role not found.");
  };

  const orConditions = [];
  if (email) orConditions.push({ email });
  if (mobile) orConditions.push({ mobile });

  if (orConditions.length > 0) {
    const existingUser = await User.findOne({ $or: orConditions });
    if (existingUser) {
      throw new ApiError(400, "User already exists with this email or mobile.");
    };
  };

  let hashedPassword = null;
  let salt = null;

  if (password) {
    salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(password, salt);
  };

  const profilePhoto = req?.files?.profilePhoto?.[0];
  const aadharCard = req?.files?.aadharCard?.[0];
  const allotment = req?.files?.allotment?.[0];
  const vehicleRCFiles = req?.files?.vehicleRC || [];

  const [
    profilePhotoBase64,
    aadharCardBase64,
    allotmentBase64,
    vehicleRCBase64Array
  ] = await Promise.all([
    profilePhoto ? compressImageToBase64(profilePhoto.buffer, profilePhoto.mimetype) : null,
    aadharCard ? compressImageToBase64(aadharCard.buffer, aadharCard.mimetype) : null,
    allotment ? compressImageToBase64(allotment.buffer, allotment.mimetype) : null,
    vehicleRCFiles?.length > 0 ? Promise.all(vehicleRCFiles.map((file) => compressImageToBase64(file.buffer, file.mimetype))) : [],
  ]);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const newUser = await User.create([{
      profilePhoto: profilePhotoBase64,
      fullName,
      mobile,
      email,
      password: hashedPassword,
      role: flatOwnerRole?._id,
      profileType: "FlatOwner",
    }], { session });

    const flatOwner = await FlatOwner.create([{
      userId: newUser?.[0]?._id,
      profilePhoto: profilePhotoBase64,
      fullName,
      mobile,
      secondaryMobile,
      email,
      password: hashedPassword,
      role: flatOwnerRole?._id,
      flat,
      currentAddress,
      permanentAddress,
      aadharCard: aadharCardBase64,
      allotment: allotmentBase64,
      vehicleRC: vehicleRCBase64Array,
    }], { session });

    newUser[0].profile = flatOwner?.[0]?._id;
    await newUser[0].save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ success: true, data: { user: newUser[0], flatOwner: flatOwner[0] } });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new ApiError(500, error.message || "Something went wrong.");
  };
});

// Get all Flat Owner
export const getFlatOwners = async (req, res) => {
  const searchableFields = ["fullName", "email", "mobile", "secondaryMobile", "memberId"];
  const filterableFields = ["status", "isDeleted", "canLogin"];

  const { query, sort, skip, limit, page } = ApiFeatures(req, searchableFields, filterableFields, {
    defaultSortBy: "createdAt",
    defaultOrder: "desc",
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
    secondaryMobile,
    email,
    password,
    currentAddress,
    permanentAddress,
    flat,
  } = req.body;

  const orConditions = [];
  if (email) orConditions.push({ email });
  if (mobile) orConditions.push({ mobile });

  if (orConditions.length > 0) {
    const existingUser = await User.findOne({ $or: orConditions, _id: { $ne: flatOwner?.userId?._id }, });
    if (existingUser) {
      throw new ApiError(400, "User already exists with this email or mobile.");
    };
  };

  let hashedPassword = null;
  let salt = null;

  if (password) {
    salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(password, salt);
  };

  const profilePhoto = req?.files?.profilePhoto?.[0];
  const aadharCard = req?.files?.aadharCard?.[0];
  const allotment = req?.files?.allotment?.[0];
  const vehicleRCFiles = req?.files?.vehicleRC || [];

  const [
    profilePhotoBase64,
    aadharCardBase64,
    allotmentBase64,
    vehicleRCBase64Array
  ] = await Promise.all([
    profilePhoto ? compressImageToBase64(profilePhoto.buffer, profilePhoto.mimetype) : null,
    aadharCard ? compressImageToBase64(aadharCard.buffer, aadharCard.mimetype) : null,
    allotment ? compressImageToBase64(allotment.buffer, allotment.mimetype) : null,
    vehicleRCFiles.length > 0 ? Promise.all(vehicleRCFiles.map((file) => compressImageToBase64(file.buffer, file.mimetype))) : [],
  ]);

  // Update User
  const userUpdates = {};
  if (fullName) userUpdates.fullName = fullName;
  if (mobile) userUpdates.mobile = mobile;
  if (email) userUpdates.email = email;
  if (profilePhotoBase64) userUpdates.profilePhoto = profilePhotoBase64;
  if (hashedPassword) userUpdates.password = hashedPassword;

  // Update FlatOwner
  const flatOwnerUpdates = {};
  if (updatedBy) flatOwnerUpdates.updatedBy = updatedBy;
  if (fullName) flatOwnerUpdates.fullName = fullName;
  if (mobile) flatOwnerUpdates.mobile = mobile;
  if (secondaryMobile) flatOwnerUpdates.secondaryMobile = secondaryMobile;
  if (email) flatOwnerUpdates.email = email;
  if (hashedPassword) flatOwnerUpdates.password = hashedPassword;
  if (flat) flatOwnerUpdates.flat = flat;
  if (currentAddress) flatOwnerUpdates.currentAddress = currentAddress;
  if (permanentAddress) flatOwnerUpdates.permanentAddress = permanentAddress;
  if (profilePhotoBase64) flatOwnerUpdates.profilePhoto = profilePhotoBase64;
  if (aadharCardBase64) flatOwnerUpdates.aadharCard = aadharCardBase64;
  if (allotmentBase64) flatOwnerUpdates.allotment = allotmentBase64;
  if (vehicleRCBase64Array?.length > 0) flatOwnerUpdates.vehicleRC = vehicleRCBase64Array;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const updatedUser = await User.findByIdAndUpdate(flatOwner?.userId?._id, userUpdates, {
      new: true,
      session,
    });

    const updatedFlatOwner = await FlatOwner.findByIdAndUpdate(id, flatOwnerUpdates, {
      new: true,
      session,
    });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ success: true, data: { user: updatedUser, flatOwner: updatedFlatOwner } });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new ApiError(500, error.message || "Update failed.");
  };
});

// Delete Flat Owner
export const deleteFlatOwner = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Flat Owner ID.");
  };

  const flatOwner = await FlatOwner.findById(id);

  if (!flatOwner) {
    throw new ApiError(404, "Flat Owner not found.");
  };

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await User.deleteOne({ _id: flatOwner?.userId }, { session });
    await FlatOwner.deleteOne({ _id: id }, { session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ success: true, message: "Flat owner deleted successfully." });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new ApiError(500, error.message || "Failed to delete.");
  };
});

// Update Flat Owner status
export const updateFlatOwnerStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.params;
  const updatedBy = req.user?._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Flat Owner ID.");
  };

  const flatOwner = await FlatOwner
    .findById(id)
    .populate("userId")
    .populate("flat");

  if (!flatOwner) {
    throw new ApiError(404, "Flat Owner not found.");
  };

  if (status == "Pending") {
    flatOwner.status = "Pending";
    flatOwner.canLogin = false;
    flatOwner.updatedBy = updatedBy;
    await flatOwner.save();
    return res.status(200).json({ success: true, message: "Flat Owner status updated to Pending." });
  };

  if (status == "Rejected") {
    flatOwner.status = "Rejected";
    flatOwner.canLogin = false;
    flatOwner.updatedBy = updatedBy;
    await flatOwner.save();
    return res.status(200).json({ success: true, message: "Flat Owner status updated to Rejected." });
  };

  if (status == "Approved" && flatOwner?.status === "Approved") {
    flatOwner.canLogin = true;
    flatOwner.updatedBy = updatedBy;
    await flatOwner.save();
    return res.status(200).json({ success: true, message: "Flat Owner status updated to Approved." });
  };

  if (status == "Approved") {
    const flatNumber = flatOwner?.flat?.flatNumber;
    const userId = flatOwner?.userId?._id;

    if (!flatNumber) {
      throw new ApiError(400, "Flat number is required to generate member ID.");
    };

    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found.");
    };

    const memberId = await generateMemberId("FOWN-", flatNumber);

    if (!memberId) {
      throw new ApiError(500, "Failed to generate member ID.");
    };

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const userUpdates = {};
      userUpdates.memberId = memberId;

      await User.findByIdAndUpdate(userId, userUpdates, {
        new: true,
        session,
      });

      const flatOwnerUpdates = {};
      flatOwnerUpdates.memberId = memberId;
      flatOwnerUpdates.status = "Approved";
      flatOwnerUpdates.canLogin = true;
      flatOwnerUpdates.updatedBy = updatedBy;

      await FlatOwner.findByIdAndUpdate(id, flatOwnerUpdates, {
        new: true,
        session,
      });

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({ success: true, message: "Flat Owner status updated to Approved." });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw new ApiError(500, error.message || "Failed to update status.");
    };
  };
});

// Update Flat Owner login
export const updateFlatOwnerLogin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { login } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Flat Owner ID.");
  };

  const flatOwner = await FlatOwner.findById(id);

  if (!flatOwner) {
    throw new ApiError(404, "Flat Owner not found.");
  };

  flatOwner.canLogin = login;
  await flatOwner.save();
  res.status(200).json({ success: true, message: "Flat Owner login updated." });
});


