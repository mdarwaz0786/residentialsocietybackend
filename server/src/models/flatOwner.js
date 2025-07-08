import mongoose from "mongoose";

const flatOwnerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  aadharCard: {
    type: String,
    required: [true, "Aadhar card is required."],
  },
  allotment: {
    type: String,
    required: [true, "Allotment is required."],
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

const FlatOwner = mongoose.model("FlatOwner", flatOwnerSchema);

export default FlatOwner;