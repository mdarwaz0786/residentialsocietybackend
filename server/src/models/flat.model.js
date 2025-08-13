import mongoose from "mongoose";

const flatSchema = new mongoose.Schema({
  flatNumber: {
    type: String,
    required: [true, "Flat number is required."],
    trim: true,
    unique: [true, "This flat mumber already exists."]
  },
  tower: {
    type: String,
    trim: true,
  },
  floor: {
    type: String,
    trim: true,
  },
  flatType: {
    type: String,
    enum: ["1BHK", "2BHK", "3BHK", "4BHK", "Studio", "Penthouse", "Other"],
  },
  status: {
    type: String,
    enum: ["Approved", "Pending", "Rejected"],
    default: "Approved",
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

const Flat = mongoose.model("Flat", flatSchema);

export default Flat;
