import mongoose from "mongoose";

const flatSchema = new mongoose.Schema({
  flatNumber: {
    type: String,
    required: [true, "Flat number is required."],
    trim: true,
    unique: true,
  },
  block: {
    type: String,
    required: [true, "Block or tower is required."],
    trim: true,
  },
  floor: {
    type: String,
    required: [true, "Floor is required."],
    trim: true,
  },
  type: {
    type: String,
    enum: ["1BHK", "2BHK", "3BHK", "Studio", "Penthouse", "Other"],
    required: [true, "Flat type is required."],
  },
  areaInSqFt: {
    type: Number,
    required: [true, "Area is required."],
  },
  photos: {
    type: [String],
    default: [],
  },
  flatOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  tenants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  occupancyStatus: {
    type: String,
    enum: ["Occupied", "Vacant", "Under Maintenance"],
    default: "Vacant",
  },
  allotmentHistory: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    fromDate: { type: Date },
    toDate: { type: Date },
    role: { type: String, enum: ["Owner", "Tenant"] },
  }],
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Flat = mongoose.model("Flat", flatSchema);

export default Flat;
