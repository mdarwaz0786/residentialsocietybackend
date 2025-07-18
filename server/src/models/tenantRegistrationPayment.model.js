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
  paymentStatus: {
    type: String,
    enum: ["Pending", "Success", "Failed"],
    default: "Pending",
  },
  paymentLink: {
    type: String,
  },
  transactionId: {
    type: String,
    unique: true,
    trim: true,
  },
  amount: {
    type: Number,
    trim: true,
  },
  paymentDate: {
    type: Date,
  },
  paymentGatewayResponse: {
    type: Object,
  },
}, { timestamps: true });

const TenantRegistrationPayment = mongoose.model("TenantRegistrationPayment", tenantRegistrationPaymentSchema);

export default TenantRegistrationPayment;
