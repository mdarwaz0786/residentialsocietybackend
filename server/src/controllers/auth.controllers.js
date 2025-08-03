import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import asyncHandler from "../helpers/asynsHandler.js";
import ApiError from "../helpers/apiError.js";
import generateToken from "../helpers/generateToken.js";
import generateMemberId from "../helpers/generateMemberId.js";

export const registerUser = asyncHandler(async (req, res) => {
  const {
    mobile,
    fullName,
    email,
    password,
    role,
  } = req.body;

  const profilePhoto = req.files?.profilePhoto?.[0];

  const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });

  if (existingUser) {
    throw new ApiError(409, "User already exists with this email or mobile.");
  };

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  let profilePhotoBase64 = "";

  if (profilePhoto) {
    profilePhotoBase64 = `data:${profilePhoto.mimetype};base64,${profilePhoto.buffer.toString("base64")}`;
  };

  const memberId = await generateMemberId("ADM-");

  const newUser = await User.create({
    fullName,
    mobile,
    email,
    password: hashedPassword,
    role,
    memberId,
    profilePhoto: profilePhotoBase64,
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

  const user = await User.findOne({ mobile: mobile }).populate("profile").select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid mobile number");
  };

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new ApiError(401, "Invalid password.");
  };

  if (user?.profile?.status !== "Approved") {
    throw new ApiError(401, "Your account is not approved.");
  };

  if (user?.profile?.canLogin != true) {
    throw new ApiError(401, "Your account is restricted to login.");
  };

  const token = generateToken(user?._id);

  res.status(200).json({ success: true, message: "Login successful.", token, user });
});

// Logged in user
export const loggedInUser = asyncHandler(async (req, res) => {
  const user = await User
    .findOne({ _id: req.user?._id })
    .populate("role")
    .populate({
      path: 'profile',
      populate: { path: 'flat' },
    })
    .exec();

  if (!user) {
    throw new ApiError(404, "Something went wrong.")
  };

  res.status(200).json({ success: true, data: user });
});