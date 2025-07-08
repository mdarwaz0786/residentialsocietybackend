import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  flat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Flat",
    required: [true, "Flat is required"],
  },
  currentAddress: {
    type: String,
    required: [true, "Current address is required."],
  },
  permanentAddress: {
    type: String,
    required: [true, "Permanent address is required."],
  },
  aadharCard: {
    type: String,
    required: [true, "Aadhar card is required."],
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
}, { timestamps: true });

const Tenant = mongoose.model("Tenant", tenantSchema);

export default Tenant;