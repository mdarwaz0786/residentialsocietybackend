import mongoose from "mongoose";

const maintenanceStaffSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  currentAddress: {
    type: String,
    required: [true, "Current address is required."],
  },
  permanentAddress: {
    type: String,
    required: [true, "Permanent address is required."],
  },
  aadharCard: {
    type: String,
    required: [true, "Aadhar card is required."],
  },
}, { timestamps: true });

const MaintenanceStaff = mongoose.model("SecurityGuard", maintenanceStaffSchema);

export default MaintenanceStaff;