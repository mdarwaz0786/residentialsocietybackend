import mongoose from "mongoose";

const flatOwnerSchema = new mongoose.Schema({
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
  allotment: {
    type: String,
    required: [true, "Allotment is required."],
  },
}, { timestamps: true });

const FlatOwner = mongoose.model("FlatOwner", flatOwnerSchema);

export default FlatOwner;