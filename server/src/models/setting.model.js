import mongoose from "mongoose";

const settingSchema = new mongoose.Schema({
  appVersion: {
    type: String,
    trim: true,
  },
  appName: {
    type: String,
    trim: true,
  },
  playStoreLink: {
    type: String,
    trim: true,
  },
  appStoreLink: {
    type: String,
    trim: true,
  },
  payuKey: {
    type: String,
    trim: true,
  },
  payuSalt: {
    type: String,
    trim: true,
  },
  tenantRegistrationFee: {
    type: Number,
    trim: true,
    default: 1,
  },
  maidRegistrationFee: {
    type: Number,
    trim: true,
    default: 1,
  },
}, { timestamps: true });

export default mongoose.model("Setting", settingSchema);