import mongoose from "mongoose";
import Role from "../models/role.model.js";
import asyncHandler from "../helpers/asynsHandler.js";
import ApiError from "../helpers/apiError.js";
import ApiFeatures from "../helpers/ApiFeatures.js";
import formatApiResponse from "../helpers/formatApiResponse.js";

// Create Role
export const createRole = asyncHandler(async (req, res) => {
  const { roleName, permissions } = req.body;

  const role = await Role.create({ roleName, permissions });
  res.status(201).json({ success: true, data: role });
});

// Get All Roles
export const getRoles = asyncHandler(async (req, res) => {
  const searchableFields = ["roleName"];
  const filterableFields = [];

  const { query, sort, skip, limit, page } = ApiFeatures(req, searchableFields, filterableFields, {
    softDelete: true,
    defaultSortBy: "createdAt",
    defaultOrder: "desc",
    defaultPage: 1,
    defaultLimit: 10
  });

  const roles = await Role.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await Role.countDocuments(query);

  res.status(200).json(formatApiResponse({ data: roles, total, page, limit }));
});

// Get Single Role
export const getRole = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid role ID.");
  };

  const role = await Role.findOne({ _id: id, isDeleted: { $ne: true } });

  if (!role) {
    throw new ApiError(404, "Role not found or has been deleted.");
  };

  res.status(200).json({ success: true, data: role });
});

// Update Role
export const updateRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid role ID.");
  };

  const updatedRole = await Role.findByIdAndUpdate(id, updates, { new: true });

  if (!updatedRole) {
    throw new ApiError(404, "Role not found.");
  };

  res.status(200).json({ success: true, data: updatedRole });
});

// Soft Delete Single Role
export const softDeleteRole = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid role ID.");
  };

  const role = await Role.findById(id);

  if (!role) {
    throw new ApiError(404, "Role not found.");
  };

  if (role.isDeleted) {
    throw new ApiError(400, "Role is already deleted.");
  };

  role.isDeleted = true;
  await role.save();

  res.status(200).json({ success: true, message: "Role deleted successfully." });
});

// Soft Delete Multiple Roles
export const softDeleteRoles = asyncHandler(async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    throw new ApiError(400, "Please provide role IDs to delete.");
  };

  const invalidIds = ids.filter((id) => !mongoose.Types.ObjectId.isValid(id));

  if (invalidIds.length > 0) {
    throw new ApiError(400, `Invalid role IDs: ${invalidIds.join(", ")}`);
  };

  const result = await Role.updateMany(
    { _id: { $in: ids }, isDeleted: { $ne: true } },
    { $set: { isDeleted: true } }
  );

  res.status(200).json({ success: true, message: `${result.modifiedCount} roles deleted successfully.` });
});
