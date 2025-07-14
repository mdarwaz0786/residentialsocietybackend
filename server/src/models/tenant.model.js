import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema({
  paymentStatus: {
    type: String,
    enum: ["Pending", "Success", "Failed"],
    default: "Pending",
  },
  paymentLink: {
    type: String,
  },
}, { timestamps: true });

const Tenant = mongoose.model("Tenant", tenantSchema);

export default Tenant;