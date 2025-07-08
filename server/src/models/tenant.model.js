import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  flat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Flat",
    required: [true, "Flat is required"],
  },
  rentAgreement: {
    type: String,
    required: [true, "Rent agreement is required."],
  },
  policeVerification: {
    type: String,
    required: [true, "Police verification is required."],
  },
  vehicleRC: {
    type: String,
    required: [true, "Vehicle RC is required."],
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