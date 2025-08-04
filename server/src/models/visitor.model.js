import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema({
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
  },
  photo: {
    type: String,
  },
  date: {
    type: Date,
    required: [true, "Date is required."],
  },
  time: {
    type: String,
    required: [true, "Time is required."],
  },
  purpose: {
    type: String,
    required: [true, "Purpose is required."],
  },
  visitorId: {
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
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  updatedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
}, { timestamps: true });

const Visitor = mongoose.model("Visitor", visitorSchema);

export default Visitor;