import mongoose from "mongoose";

const maidRegistrationPaymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  maid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Maid",
    required: true,
  },
  purpose: {
    type: String,
    enum: ["Maid Registration", " Maid Renewal"],
    required: true,
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

const MaidRegistrationPayment = mongoose.model("MaidRegistrationPayment", maidRegistrationPaymentSchema);

export default MaidRegistrationPayment;
