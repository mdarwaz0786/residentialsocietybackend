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
  const { flat } = req.body;

  let tenantPersons = req.body.tenantPersons;

  if (!flat) {
    throw new ApiError(400, "Flat is required.");
  };

  if (typeof tenantPersons === "string") {
    try {
      tenantPersons = JSON.parse(tenantPersons);
    } catch {
      throw new ApiError(400, "Invalid tenant persons JSON format.");
    };
  };

  if (!Array.isArray(tenantPersons) || tenantPersons.length === 0) {
    throw new ApiError(400, "At least one tenant person is required.");
  };

  const existingFlat = await Flat.findById(flat);

  if (!existingFlat) {
    throw new ApiError(404, "Flat not found.");
  };

  if (!existingFlat.flatOwner) {
    throw new ApiError(400, "Flat is not assigned to any flat owner.");
  };

  const flatOwnerUser = existingFlat.flatOwner;

  const flatOwner = await FlatOwner.findOne({ userId: flatOwnerUser._id });

  if (!flatOwner) {
    throw new ApiError(404, "Flat owner not found.");
  };

  const role = await Role.findOne({ roleName: "Tenant", isDeleted: false });

  if (!role) {
    throw new ApiError(404, "Tenant role not found.");
  };

  const tenant = await Tenant.create({
    flatOwner: flatOwner._id,
    flat: existingFlat._id,
    status: "Pending",
  });

  const createdTenantPersons = [];

  for (let i = 0; i < tenantPersons.length; i++) {
    const person = tenantPersons[i];

    const {
      fullName,
      email,
      mobile,
      password,
      currentAddress,
      permanentAddress,
      fromDate,
      toDate,
    } = person;

    const profilePhoto = fileToBase64(req.files?.[`tenantPersons[${i}].profilePhoto`]?.[0]);
    const aadharCard = fileToBase64(req.files?.[`tenantPersons[${i}].aadharCard`]?.[0]);
    const rentAgreement = fileToBase64(req.files?.[`tenantPersons[${i}].rentAgreement`]?.[0]);
    const policeVerification = fileToBase64(req.files?.[`tenantPersons[${i}].policeVerification`]?.[0]);
    const vehicleRC = fileToBase64(req.files?.[`tenantPersons[${i}].vehicleRC`]?.[0]);

    console.log(profilePhoto);
    const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });

    if (existingUser) {
      throw new ApiError(400, "User already exists with email or mobile");
    };

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const memberId = await generateMemberId("TEN", existingFlat.flatNumber);

    const user = await User.create({
      fullName,
      email,
      mobile,
      password: hashedPassword,
      profilePhoto,
      role: role._id,
      memberId,
      status: "Pending",
      canLogin: false,
    });

    const tenantPerson = await TenantPerson.create({
      user: user._id,
      tenant: tenant._id,
      flat: existingFlat._id,
      currentAddress,
      permanentAddress,
      aadharCard,
      rentAgreement,
      policeVerification,
      vehicleRC,
      fromDate,
      toDate,
    });

    createdTenantPersons.push(tenantPerson);
  };

  res.status(201).json({ success: true, message: "Tenant created successfully.", data: { tenant, tenantPersons: createdTenantPersons } });
});
