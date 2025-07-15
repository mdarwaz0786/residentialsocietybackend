import mongoose from "mongoose";
import bcrypt from "bcryptjs";
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

  const flatOwnerUser = await User.findById(existingFlat.flatOwner);

  if (!flatOwnerUser) {
    throw new ApiError(404, "Flat owner not found.");
  };

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

export const getAllTenants = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    status,
    paymentStatus,
    flatOwner
  } = req.query;

  const match = {};

  if (paymentStatus) match["paymentStatus"] = paymentStatus;
  if (flatOwner) match["flatOwner"] = new mongoose.Types.ObjectId(flatOwner);

  const regexSearch = {
    $or: [
      { "user.fullName": { $regex: search, $options: "i" } },
      { "user.email": { $regex: search, $options: "i" } },
      { "user.mobile": { $regex: search, $options: "i" } },
    ],
  };

  const pipeline = [
    {
      $lookup: {
        from: "tenantpeople",
        localField: "_id",
        foreignField: "tenant",
        as: "tenantPersons",
      },
    },
    { $unwind: "$tenantPersons" },
    {
      $lookup: {
        from: "users",
        localField: "tenantPersons.user",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    { $match: { ...regexSearch, ...match } },
    { $skip: (parseInt(page) - 1) * parseInt(limit) },
    { $limit: parseInt(limit) },
  ];

  const tenants = await Tenant.aggregate(pipeline);

  const total = await Tenant.aggregate([
    ...pipeline.slice(0, -2),
    { $count: "count" },
  ]);

  res.status(200).json({
    success: true,
    data: tenants,
    page: +page,
    limit: +limit,
    total: total[0]?.count || 0,
  });
});

export const getTenantById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Tenant ID");
  }

  const tenantPersons = await TenantPerson.find({ tenant: id })
    .populate("user")
    .populate("flat");

  const tenant = await Tenant.findById(id).populate({
    path: "flatOwner",
    populate: { path: "userId" },
  });

  if (!tenant) throw new ApiError(404, "Tenant not found.");

  res.status(200).json({
    success: true,
    data: {
      tenant,
      tenantPersons,
    },
  });
});

export const updateTenantPerson = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid TenantPerson ID");
  }

  const tenantPerson = await TenantPerson.findById(id).populate("user");

  if (!tenantPerson) {
    throw new ApiError(404, "TenantPerson not found");
  }

  const {
    fullName,
    email,
    mobile,
    password,
    profilePhoto,
    currentAddress,
    permanentAddress,
    aadharCard,
    rentAgreement,
    policeVerification,
    vehicleRC,
    fromDate,
    toDate,
    isLiving,
  } = req.body;

  const userUpdates = {};
  if (fullName) userUpdates.fullName = fullName;
  if (email) userUpdates.email = email;
  if (mobile) userUpdates.mobile = mobile;
  if (profilePhoto) userUpdates.profilePhoto = profilePhoto;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    userUpdates.password = await bcrypt.hash(password, salt);
  }

  await User.findByIdAndUpdate(tenantPerson.user._id, userUpdates);

  const personUpdates = {
    currentAddress,
    permanentAddress,
    aadharCard,
    rentAgreement,
    policeVerification,
    vehicleRC,
    fromDate,
    toDate,
    isLiving,
  };

  const updated = await TenantPerson.findByIdAndUpdate(id, personUpdates, {
    new: true,
  }).populate("user");

  res.status(200).json({ success: true, data: updated });
});

export const softDeleteTenant = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Tenant ID");
  }

  const tenantPersons = await TenantPerson.find({ tenant: id });

  if (!tenantPersons.length) {
    throw new ApiError(404, "No TenantPersons found for this Tenant");
  }

  const userIds = tenantPersons.map((tp) => tp.user);
  await User.updateMany(
    { _id: { $in: userIds } },
    { $set: { isDeleted: true, canLogin: false } }
  );

  res.status(200).json({
    success: true,
    message: "Tenant and associated users soft deleted.",
  });
});


export const softDeleteTenants = asyncHandler(async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    throw new ApiError(400, "Please provide an array of Tenant IDs");
  }

  const invalidIds = ids.filter((id) => !mongoose.Types.ObjectId.isValid(id));
  if (invalidIds.length) {
    throw new ApiError(400, `Invalid IDs: ${invalidIds.join(", ")}`);
  }

  const tenantPersons = await TenantPerson.find({
    tenant: { $in: ids },
  });

  if (!tenantPersons.length) {
    throw new ApiError(404, "No TenantPersons found for provided Tenants");
  }

  const userIds = tenantPersons.map((tp) => tp.user);
  const result = await User.updateMany(
    { _id: { $in: userIds } },
    { $set: { isDeleted: true, canLogin: false } }
  );

  res.status(200).json({
    success: true,
    message: `${result.modifiedCount} tenant users soft deleted.`,
  });
});
