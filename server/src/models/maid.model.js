import mongoose from "mongoose";
import validator from "validator";

const maidSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Full name is required."],
    trim: true,
    minlength: [3, "Full name must be at least 3 characters long."],
    maxlength: [50, "Full name cannot exceed 50 characters."],
    validate: {
      validator: (value) => validator.matches(value, /^[a-zA-Z\s]+$/),
      message: "Full name should only contain alphabets and spaces.",
    },
  },
  mobile: {
    type: String,
    required: [true, "Mobile is required."],
    trim: true,
    validate: {
      validator: (value) => validator.matches(value, /^[6-9]\d{9}$/),
      message: "Enter a valid 10-digit mobile number.",
    },
  },
  aadharCard: {
    type: String,
    required: [true, "Aadhar card is required."],
  },
  flat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Flat",
    required: [true, "Flat is required."],
  },
  photo: {
    type: String,
    required: [true, "Photo is required"],
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

const Maid = mongoose.model("Maid", maidSchema);

export default Maid;