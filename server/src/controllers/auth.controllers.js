import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import asyncHandler from "../helpers/asynsHandler.js";
import ApiError from "../helpers/apiError.js";
import generateToken from "../helpers/generateToken.js";

export const registerUser = asyncHandler(async (req, res) => {
  const {
    fullName,
    mobile,
    email,
    password,
    flat,
    role,
    currentAddress,
    permanentAddress,
  } = req.body;

  const profilePhoto = req.files?.profilePhoto?.[0];
  const allotment = req.files?.allotment?.[0];

  const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });

  if (existingUser) {
    throw new ApiError(409, "User already exists with the same email or mobile.");
  };

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  let profilePhotoBase64 = "";
  let allotmentBase64 = "";

  if (profilePhoto) {
    profilePhotoBase64 = `data:${profilePhoto.mimetype};base64,${profilePhoto.buffer.toString("base64")}`;
  };

  if (allotment) {
    allotmentBase64 = `data:${allotment.mimetype};base64,${allotment.buffer.toString("base64")}`;
  };

  const newUser = await User.create({
    fullName,
    mobile,
    email,
    password: hashedPassword,
    flat,
    role,
    currentAddress,
    permanentAddress,
    profilePhoto: profilePhotoBase64,
    allotment: allotmentBase64,
  });

  res.status(201).json({ success: true, message: "User registered successfully.", user: newUser });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { mobile, password } = req.body;

  if (!mobile) {
    throw new ApiError(400, "Mobile number is required.");
  };

  if (!password) {
    throw new ApiError(400, "Password is required.");
  };

  const isApproved = await User.findOne({ status: "Approved" });

  if (!isApproved) {
    throw new ApiError(401, "Your account is not approved.");
  };

  const user = await User.findOne({ mobile, isDeleted: false }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid mobile number or password.");
  };

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid mobile number or password.");
  };

  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    message: "Login successful.",
    token,
    user,
  });
});

// Logged in user
export const loggedInUser = asyncHandler(async (req, res) => {
  const user = await User
    .findOne({ _id: req.user?._id, isDeleted: false })
    .populate("role")
    .populate("flat")
    .exec();

  if (!user) {
    throw new ApiError(404, "Your account doest not exists")
  };

  res.status(200).json({ success: true, data: user });
});