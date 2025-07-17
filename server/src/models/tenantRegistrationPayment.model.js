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
  },
  purpose: {
    type: String,
    default: "Tenant Registration",
  },
}, { timestamps: true });

const TenantRegistrationPayment = mongoose.model("TenantRegistrationPayment", tenantRegistrationPaymentSchema);

export default TenantRegistrationPayment;
