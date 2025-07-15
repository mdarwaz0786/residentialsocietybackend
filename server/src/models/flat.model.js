import mongoose from "mongoose";

const flatSchema = new mongoose.Schema({
  flatNumber: {
    type: String,
    required: [true, "Flat number is required."],
    trim: true,
    unique: true,
  },
  floor: {
    type: String,
    required: [true, "Floor is required."],
    trim: true,
  },
  flatType: {
    type: String,
    enum: ["1BHK", "2BHK", "3BHK", "Studio", "Penthouse", "Other"],
    required: [true, "Flat type is required."],
  },
  flatOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FlatOwner",
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

const Flat = mongoose.model("Flat", flatSchema);

export default Flat;
