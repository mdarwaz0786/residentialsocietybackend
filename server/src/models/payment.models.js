import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "User is required."],
  },
  amount: {
    type: Number,
    default: 500,
    required: [true, "Amount is required."],
  },
  status: {
    type: String,
    enum: ['Pending', 'Success', 'Failed'],
    default: 'Pending',
  },
  paymentDate: {
    type: Date,
  },
  transactionId: {
    type: String,
  },
  purpose: {
    type: String,
    enum: ["Society Maintenance", "Tenant Onboarding"],
    default: 'Tenant Onboarding',
  },
  gatewayResponse: {
    type: mongoose.Schema.Types.Mixed,
  },
}, { timestamps: true });

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
