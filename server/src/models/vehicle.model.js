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
    enum: ["Car", "Bike", "Scooter", "Others"],
    required: [true, "Vehicle type is required."],
  },
  vehiclePhoto: {
    type: String,
    required: [true, "Vehicle photo is required."],
  },
  vehicleOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Vehicle owner is required."],
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

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;