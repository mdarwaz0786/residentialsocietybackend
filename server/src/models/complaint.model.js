import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Complaint title is required.'],
    trim: true,
  },
  type: {
    type: String,
    required: [true, 'Complaint type is required.'],
    enum: ['Plumbing', 'Electricity', 'Cleanliness', 'Other'],
  },
  image: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved'],
    default: 'Pending',
  },
  date: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Complaint = mongoose.model('Complaint', complaintSchema);

export default Complaint;
