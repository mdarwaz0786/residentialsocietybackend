import crypto from 'crypto';
import Tenant from '../models/tenant.model.js';
import TenantRegistrationPayment from '../models/tenantRegistrationPayment.model.js';
import asyncHandler from '../helpers/asynsHandler.js';
import ApiError from '../helpers/apiError.js';
import ApiFeatures from "../helpers/ApiFeatures.js";
import formatApiResponse from "../helpers/formatApiResponse.js";

// Approve Tenant and Generate Payment
export const approveTenantAndGeneratePayment = asyncHandler(async (req, res) => {
  const { PAYU_KEY, PAYU_SALT, PAYU_BASE_URL, SERVER_BASE_URL } = process.env;
  const tenantId = req.params.id;
  const status = req.params.status;

  const tenant = await Tenant.findById(tenantId).populate('createdBy');

  if (!tenant) {
    throw new ApiError(404, 'Tenant not found.');
  };

  const existingPayment = await TenantRegistrationPayment.findOne({
    tenant: tenantId,
    status: 'success',
  });

  if (existingPayment) {
    throw new ApiError(400, 'Payment already completed.');
  };

  if (status === "Rejected") {
    tenant.status = "Rejected";
    await tenant.save();
    return res.status(200).json({ success: true, message: "Status updated successfully." });
  };

  if (status === "Pending") {
    tenant.status = "Pending";
    await tenant.save();
    return res.status(200).json({ success: true, message: "Status updated successfully." });
  };

  let payment;

  if (status === "Approved" && !existingPayment) {
    tenant.status = 'Approved';
    await tenant.save();

    const txnid = 'TXN' + Date.now();
    const amount = 1;

    const data = {
      key: PAYU_KEY,
      txnid,
      amount,
      productinfo: 'Tenant Registration',
      firstname: tenant?.createdBy?.fullName,
      email: tenant?.createdBy?.email,
      phone: tenant?.createdBy?.mobile,
      surl: `${SERVER_BASE_URL}/api/v1/tenantRegistrationPayment/payment-success`,
      furl: `${SERVER_BASE_URL}/api/v1/tenantRegistrationPayment/payment-failure`,
      service_provider: 'payu_paisa',
    };

    const hashStr = `${data.key}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|||||||||||${PAYU_SALT}`;
    const hash = crypto.createHash('sha512').update(hashStr).digest('hex');

    payment = await TenantRegistrationPayment.create({
      flatOwner: tenant?.createdBy?._id,
      tenant: tenant?._id,
      flat: tenant?.flat,
      txnid,
      amount,
      paymentStatus: 'pending',
      paymentUrl: `${PAYU_BASE_URL}/_payment`,
      paymentData: { ...data, hash },
    });
  };

  res.status(200).json({ success: true, data: payment });
});

// Get Flat Owner Payments
export const getFlatOwnerPayments = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const payments = await TenantRegistrationPayment.find({ flatOwner: id }).sort({ createdAt: -1 });
  return res.json({ success: true, data: payments });
});

// Get all Tenant Registration Payment
export const getTenantRegistrationPayments = asyncHandler(async (req, res) => {
  const searchableFields = ["status"];
  const filterableFields = ["status"];

  const { query, sort, skip, limit, page } = ApiFeatures(
    req,
    searchableFields,
    filterableFields,
    {
      softDelete: true,
      defaultSortBy: "createdAt",
      defaultOrder: "desc",
      defaultPage: 1,
      defaultLimit: 10,
    }
  );

  const payments = await TenantRegistrationPayment
    .find(query)
    .populate("flat flatOwner tenant")
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await TenantRegistrationPayment.countDocuments(query);

  res.status(200).json(formatApiResponse({ data: payments, total, page, limit }));
});

// Handle Tenant Registration Payment Success
export const tenantRegistrationPaymentSuccess = asyncHandler(async (req, res) => {
  const { txnid } = req.body;
  const date = new Date();

  const tenantRegistrationPayment = await TenantRegistrationPayment.findOne({ txnid: txnid });
  const tenantId = tenantRegistrationPayment?.tenant;
  const tenant = await Tenant.findById(tenantId);

  tenantRegistrationPayment.status = "success";
  tenantRegistrationPayment.paymentDate = date;
  await tenantRegistrationPayment.save();

  tenant.canLogin = true;
  tenant.paymentStatus = "Success";
  await tenant.save();

  res.render('paymentSuccess', { txnid });
});

// Handle Tenant Registration Payment Failure
export const tenantRegistrationPaymentFailure = asyncHandler(async (req, res) => {
  const { txnid } = req.body;

  const tenantRegistrationPayment = await TenantRegistrationPayment.findOne({ txnid: txnid });
  const tenantId = tenantRegistrationPayment?.tenant;
  const tenant = await Tenant.findById(tenantId);

  tenantRegistrationPayment.status = "failed";
  await tenantRegistrationPayment.save();

  tenant.paymentStatus = "Failed";
  await tenant.save();

  res.render('paymentFailure', { txnid });
});




