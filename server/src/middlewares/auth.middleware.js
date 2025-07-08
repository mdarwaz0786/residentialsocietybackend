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
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  const user = await User.findById(decoded.id).select("-password");

  if (!user) {
    throw new ApiError(401, "Your account not found.");
  };

  if (user.isDeleted) {
    throw new ApiError(401, "Your account has been deleted.");
  };

  if (user.status != "Approved") {
    throw new ApiError(401, "Your account is not approved.");
  };

  req.user = user;
  next();
});

export default isLoggedIn;
