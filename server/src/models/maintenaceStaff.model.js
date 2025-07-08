import mongoose from "mongoose";

const maintenanceStaffSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  aadharCard: {
    type: String,
    required: [true, "Aadhar card is required."],
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
}, { timestamps: true });

const MaintenanceStaff = mongoose.model("SecurityGuard", maintenanceStaffSchema);

export default MaintenanceStaff;