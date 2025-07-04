import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ApiError from "../helpers/apiError.js";
import asyncHandler from "../helpers/asynsHandler.js";

const isLoggedIn = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new ApiError(401, "Authentication token missing or malformed.");
  };

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id).select("-password");

  if (!user || user.isDeleted) {
    throw new ApiError(401, "User not found or has been deleted.");
  };

  req.user = user;
  next();
});

export default isLoggedIn;
