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
    unique: true,
    validate: {
      validator: (value) => validator.matches(value, /^[6-9]\d{9}$/),
      message: "Enter a valid 10-digit mobile number.",
    },
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, "Enter a valid email."]
  },
  password: {
    type: String,
    required: [true, "Password is required."],
    minlength: [6, "Password must be at least 6 characters long."],
    validate: {
      validator: (value) => validator.matches(value, /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/),
      message: "Password must contain at least 1 uppercase, 1 lowercase letter, and 1 number.",
    },
  },
  flat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Flat",
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
  },
  currentAddress: {
    type: String,
    required: [true, "Current address is required."],
  },
  permanentAddress: {
    type: String,
    required: [true, "Permanent address is required."],
  },
  allotment: {
    type: String,
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

const User = mongoose.model("User", userSchema);

export default User;