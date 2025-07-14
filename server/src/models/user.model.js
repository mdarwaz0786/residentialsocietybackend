import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Full name is required."],
    minlength: [3, "Full name must be at least 3 characters long."],
    maxlength: [50, "Full name cannot exceed 50 characters."],
    trim: true,
    validate: {
      validator: (value) => validator.matches(value, /^[a-zA-Z\s]+$/),
      message: "Full name should only contain alphabets and spaces.",
    },
  },
  profilePhoto: {
    type: String,
    required: [true, "Profile photo is required."],
  },
  mobile: {
    type: String,
    required: [true, "Mobile is required."],
    trim: true,
    unique: [true, "Account already exists with this mobile number."],
    match: [/^\d{10}$/, "Mobile number must be exactly 10 digits."],
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    trim: true,
    lowercase: true,
    unique: [true, "Account already exits with this email."],
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
    required: [true, "Member ID is required."],
    trim: true,
    unique: [true, "Account already exits with this member id."],
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
  isActive: {
    type: Boolean,
    default: true,
  },
  canLogin: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;