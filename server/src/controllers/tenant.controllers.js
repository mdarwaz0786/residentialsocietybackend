import bcrypt, { compareSync } from "bcryptjs";
import Tenant from "../models/tenant.model.js";
import TenantPerson from "../models/tenantPerson.model.js";
import FlatOwner from "../models/flatOwner.model.js";
import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import Flat from "../models/flat.model.js";
import asyncHandler from "../helpers/asynsHandler.js";
import ApiError from "../helpers/apiError.js";
import generateMemberId from "../helpers/generateMemberId.js";
import fileToBase64 from "../helpers/fileTobase64.js";

export const createTenant = asyncHandler(async (req, res) => {
});
