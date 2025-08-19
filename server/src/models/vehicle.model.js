import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
  vehicleNumber: {
    type: String,
    required: [true, "Vehicle number is required."],
    trim: true,
    unique: true,
  },
  vehicleType: {
    type: String,
    enum: ["Car", "Bike", "Scooter", "Bicycle", "Others"],
    required: [true, "Vehicle type is required."],
  },
  vehiclePhoto: {
    type: String,
    required: [true, "Vehicle photo is required."],
  },
  vehicleRC: {
    type: String,
    required: [true, "Vehicle RC is required."],
  },
  remarks: {
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
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, { timestamps: true });

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;