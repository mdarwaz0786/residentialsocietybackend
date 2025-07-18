import mongoose from "mongoose";
import validator from "validator";

const flatOwnerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "User is required."]
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
  email: {
    type: String,
    required: [true, "Email is required."],
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, "Enter a valid email."]
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    required: [true, "Role is required"],
  },
  memberId: {
    type: String,
    required: [true, "Member ID is required."],
    trim: true,
  },
  flat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flat',
    required: [true, "Flat is required."]
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
  allotment: {
    type: String,
    required: [true, "Allotment is required."],
  },
  vehicleRC: {
    type: String,
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
    default: "Approved",
  },
  canLogin: {
    type: Boolean,
    default: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, { timestamps: true });

const FlatOwner = mongoose.model("FlatOwner", flatOwnerSchema);

export default FlatOwner;