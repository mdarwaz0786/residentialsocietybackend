import mongoose from "mongoose";
import validator from "validator";

const tenantPersonSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  profilePhoto: {
    type: String,
    required: [true, "Profile photo is required."],
  },
  fullName: {
    type: String,
    required: [true, "Full name is required."],
    minlength: [3, "Full name must be at least 3 characters long."],
    maxlength: [50, "Full name cannot exceed 50 characters."],
    trim: true,
  },
  mobile: {
    type: String,
    required: [true, "Mobile is required."],
    trim: true,
    match: [/^\d{10}$/, "Mobile number must be exactly 10 digits."],
  },
  secondaryMobile: {
    type: String,
    trim: true,
    match: [/^\d{10}$/, "Secondary mobile number must be exactly 10 digits."],
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, "Enter a valid email."]
  },
  password: {
    type: String,
    required: [true, "Password is required."],
    trim: true,
    select: false,
    minlength: [6, "Password must be at least 6 characters long."],
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    required: [true, "Role is required"],
  },
  memberId: {
    type: String,
    trim: true,
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
    type: [String],
  },
  remarks: {
    type: String,
  },
  review: {
    type: String,
    enum: ["Under Review", ""],
  },
  fromDate: {
    type: Date,
    default: Date.now,
  },
  toDate: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  status: {
    type: String,
    enum: ["Approved", "Pending", "Rejected"],
    default: "Pending",
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Success", "Failed"],
    default: "Pending",
  },
  paymentDate: {
    type: Date,
  },
  canLogin: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

const Tenant = mongoose.model("Tenant", tenantPersonSchema);

export default Tenant;