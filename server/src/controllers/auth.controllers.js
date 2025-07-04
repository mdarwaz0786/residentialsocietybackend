import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import asyncHandler from "../helpers/asynsHandler.js";
import ApiError from "../helpers/apiError.js";

export const loginUser = asyncHandler(async (req, res) => {
  const { mobile, password } = req.body;

  if (!mobile) {
    throw new ApiError(400, "Mobile number is required.");
  };

  if (!password) {
    throw new ApiError(400, "Password is required.");
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
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      status: user.status,
    },
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
    throw new ApiError(404, "Logged in user not found.")
  };

  res.status(200).json({ success: true, data: user });
});