import mongoose from "mongoose";
import validator from "validator";

const adminSchema = new mongoose.Schema({
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
}, { timestamps: true });

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;