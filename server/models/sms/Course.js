import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bootcampType: { type: String, enum: ['short', 'complete'], required: true },
  track: { type: String }, // e.g. AI, Development, Cybersecurity, QA/QES
  duration: { type: String, required: true },
  fee: { type: Number, required: true },
  mode: { type: String, default: 'Online' },
  syllabus: [{ type: String }],
  startDate: { type: Date },
  batchNo: { type: String },
  maxSeats: { type: Number },
  enrolledCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
});

const Course = mongoose.model('Course', courseSchema);
export default Course;
