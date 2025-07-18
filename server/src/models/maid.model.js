import mongoose from "mongoose";

const maidSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Full name is required."],
    trim: true,
    minlength: [3, "Full name must be at least 3 characters long."],
    maxlength: [50, "Full name cannot exceed 50 characters."],
  },
  mobile: {
    type: String,
    required: [true, "Mobile is required."],
    trim: true,
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
  aadharCard: {
    type: String,
    required: [true, "Aadhar card is required."],
  },
  memberId: {
    type: String,
    required: [true, "Member ID is required."],
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
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  updatedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
}, { timestamps: true });

const Maid = mongoose.model("Maid", maidSchema);

export default Maid;