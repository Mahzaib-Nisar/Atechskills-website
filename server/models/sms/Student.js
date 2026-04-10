import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  studentId: { type: String, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  course: { type: String, enum: ['DEVSECAI Bootcamp', 'Short Bootcamp'] },
  batch: { type: String },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  profilePic: { type: String },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  // Enrollment system fields
  selectedCourse: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  enrollmentStatus: { type: String, enum: ['pending_payment', 'enrolled', 'rejected'], default: 'pending_payment' },
  enrollmentDate: { type: Date },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' }, // admin ref
  approvedAt: { type: Date }
});

// Auto-generate studentId before saving
studentSchema.pre('save', async function(next) {
  if (!this.studentId) {
    const Student = mongoose.model('Student', studentSchema);
    const count = await Student.countDocuments({}) + 1;
    this.studentId = `ATS-2024-${String(count).padStart(3, '0')}`;
  }
  next();
});

// Hash password before saving
studentSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

studentSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const Student = mongoose.model('Student', studentSchema);
export default Student;
