import mongoose from "mongoose";

const tenantRegistrationPaymentSchema = new mongoose.Schema({
  flat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Flat",
    required: [true, "Flat is required."],
  },
  flatOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FlatOwner',
    required: [true, "Flat owner is required."],
  },
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: [true, "Tenant is required."],
  },
  purpose: {
    type: String,
    default: "Tenant Registration",
  },
  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending",
  },
  amount: {
    type: Number,
    trim: true,
  },
  txnid: {
    type: String,
    unique: true,
    trim: true,
  },
  paymentUrl: {
    type: String,
  },
  paymentData: {
    type: Object,
  },
  paymentDate: {
    type: Date,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const TenantRegistrationPayment = mongoose.model("TenantRegistrationPayment", tenantRegistrationPaymentSchema);

export default TenantRegistrationPayment;
