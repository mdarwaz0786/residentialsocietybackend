import mongoose from "mongoose";

const tenantPersonSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
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
  fromDate: {
    type: Date,
    default: Date.now,
  },
  toDate: {
    type: Date,
  },
  isLiving: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

const TenantPerson = mongoose.model("TenantPerson", tenantPersonSchema);

export default TenantPerson;