import mongoose from 'mongoose';

const feeRecordSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  challanNo: { type: String, unique: true },
  amount: { type: Number, required: true },
  dueDate: { type: Date },
  submissionDate: { type: Date },
  paymentProofUrl: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  rejectionReason: { type: String },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' }, // admin ref
  approvedAt: { type: Date }
});

// Auto-generate challanNo before saving
feeRecordSchema.pre('save', async function(next) {
  if (!this.challanNo) {
    const FeeRecord = mongoose.model('FeeRecord', feeRecordSchema);
    const count = await FeeRecord.countDocuments({}) + 1;
    this.challanNo = `ATS-FEE-2025-${String(count).padStart(4, '0')}`;
  }
  next();
});

const FeeRecord = mongoose.model('FeeRecord', feeRecordSchema);
export default FeeRecord;
