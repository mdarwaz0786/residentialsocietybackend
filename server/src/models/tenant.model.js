import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema({
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
  flatOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FlatOwner',
    required: [true, "Flat owner is required."],
  },
  flat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Flat",
    required: [true, "Flat is required."],
  },
  status: {
    type: String,
    enum: ["Approved", "Pending", "Rejected"],
    default: "Pending",
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Tenant = mongoose.model("Tenant", tenantSchema);

export default Tenant;
