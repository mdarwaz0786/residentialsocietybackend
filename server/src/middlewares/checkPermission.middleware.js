import mongoose from "mongoose";
import Role from "../models/role.model.js";
import ApiError from "../helpers/apiError.js";
import asyncHandler from "../helpers/asynsHandler.js";

const checkPermission = (module, action) => {
  return asyncHandler(async (req, res, next) => {
    const userRoleId = req.user?.role;

    if (!userRoleId || !mongoose.Types.ObjectId.isValid(userRoleId)) {
      throw new ApiError(401, "Invalid or missing user role.");
    };

    const role = await Role.findById(userRoleId);

    if (!role) {
      throw new ApiError(403, "Role not found.");
    };

    if (role.roleName.toLowerCase() === "admin") {
      return next();
    };

    const modulePermissions = role.permissions?.[module];

    if (!modulePermissions) {
      throw new ApiError(403, `No permissions configured for module ${module}.`);
    };

    const hasPermission = modulePermissions[action];

    if (!hasPermission) {
      throw new ApiError(403, `You do not have permission to ${action} in ${module}.`);
    };

    next();
  });
};

export default checkPermission;
