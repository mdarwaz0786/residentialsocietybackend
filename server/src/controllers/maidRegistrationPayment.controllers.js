import crypto from 'crypto';
import Maid from '../models/maid.model.js';
import MaidRegistrationPayment from "../models/maidRegistrationPayment.model.js";
import asyncHandler from '../helpers/asynsHandler.js';
import ApiError from '../helpers/apiError.js';
import ApiFeatures from "../helpers/ApiFeatures.js";
import formatApiResponse from "../helpers/formatApiResponse.js";

// Approve Maid and Generate Payment
export const approveMaidAndGeneratePayment = asyncHandler(async (req, res) => {
  const { PAYU_KEY, PAYU_SALT, PAYU_BASE_URL, SERVER_BASE_URL } = process.env;
  const maidId = req.params.id;
  const status = req.params.status;

  const maid = await Maid.findById(maidId).populate('createdBy');

  if (!maid) {
    throw new ApiError(404, 'Maid not found.');
  };

  const existingPayment = await MaidRegistrationPayment.findOne({
    maid: maidId,
    status: 'success',
  });

  if (existingPayment) {
    throw new ApiError(400, 'Payment already completed.');
  };

  if (status === "Rejected") {
    maid.status = "Rejected";
    await maid.save();
    return res.status(200).json({ success: true, message: "Status updated successfully." });
  };

  if (status === "Pending") {
    maid.status = "Pending";
    await maid.save();
    return res.status(200).json({ success: true, message: "Status updated successfully." });
  };

  let payment;

  if (status === "Approved" && !existingPayment) {
    maid.status = 'Approved';
    await maid.save();

    const txnid = 'TXN' + Date.now();
    const amount = 1;

    const data = {
      key: PAYU_KEY,
      txnid,
      amount,
      productinfo: 'Maid Registration',
      firstname: maid?.createdBy?.fullName,
      email: maid?.createdBy?.email,
      phone: maid?.createdBy?.mobile,
      surl: `${SERVER_BASE_URL}/api/v1/maidRegistrationPayment/payment-success`,
      furl: `${SERVER_BASE_URL}/api/v1/maidRegistrationPayment/payment-failure`,
      service_provider: 'payu_paisa',
    };

    const hashStr = `${data.key}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|||||||||||${PAYU_SALT}`;
    const hash = crypto.createHash('sha512').update(hashStr).digest('hex');

    payment = await MaidRegistrationPayment.create({
      user: maid?.createdBy?._id,
      maid: maid?._id,
      purpose: 'Maid Registration',
      txnid,
      amount,
      paymentStatus: 'pending',
      paymentUrl: `${PAYU_BASE_URL}/_payment`,
      paymentData: { ...data, hash },
    });
  };

  res.status(200).json({ success: true, data: payment });
});

// Get Maid Registration Payment by User ID
export const getMaidPayments = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const payments = await MaidRegistrationPayment.find({ user: id }).sort({ createdAt: -1 });
  return res.json({ success: true, data: payments });
});

// Get all Maid Registration Payment
export const getMaidRegistrationPayments = asyncHandler(async (req, res) => {
  const searchableFields = ["status", "txnid", "purpose"];
  const filterableFields = ["status", "purpose", "isDeleted"];

  const { query, sort, skip, limit, page } = ApiFeatures(
    req,
    searchableFields,
    filterableFields,
    {
      defaultSortBy: "paymentDate",
      defaultOrder: "desc",
    }
  );

  const payments = await MaidRegistrationPayment
    .find(query)
    .populate("user maid")
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await MaidRegistrationPayment.countDocuments(query);

  res.status(200).json(formatApiResponse({ data: payments, total, page, limit }));
});

// Maid Registration Payment Success
export const maidRegistrationPaymentSuccess = asyncHandler(async (req, res) => {
  const { txnid } = req.body;
  const date = new Date();

  const maidRegistrationPayment = await MaidRegistrationPayment.findOne({ txnid: txnid });
  const maidId = maidRegistrationPayment?.maid;
  const maid = await Maid.findById(maidId);

  if (!maidRegistrationPayment) {
    throw new ApiError(404, 'Payment not found.');
  };

  if (!maid) {
    throw new ApiError(404, 'Maid not found.');
  };

  maidRegistrationPayment.status = "success";
  maidRegistrationPayment.paymentDate = date;
  await maidRegistrationPayment.save();

  const threeMonthsFromNow = new Date(date);
  threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);

  maid.paymentStatus = "Success";
  maid.paymentDate = date;
  maid.validTill = threeMonthsFromNow;
  maid.validityStatus = "Active";
  await maid.save();

  res.render('paymentSuccess', { txnid });
});

// Maid Registration Payment Failure
export const maidRegistrationPaymentFailure = asyncHandler(async (req, res) => {
  const { txnid } = req.body;

  const maidRegistrationPayment = await MaidRegistrationPayment.findOne({ txnid: txnid });
  const maidId = maidRegistrationPayment?.maid;
  const maid = await Maid.findById(maidId);

  maidRegistrationPayment.status = "failed";
  await maidRegistrationPayment.save();

  maid.paymentStatus = "Failed";
  await maid.save();

  res.render('paymentFailure', { txnid });
});