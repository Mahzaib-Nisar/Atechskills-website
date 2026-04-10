import express from 'express';
import Course from '../../models/sms/Course.js';
import Student from '../../models/sms/Student.js';
import FeeRecord from '../../models/sms/FeeRecord.js';
import authMiddleware from '../../middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
const router = express.Router();

// Multer setup for fee proof uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '../../uploads/fee-proofs/');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random()*1e6)}${ext}`);
  }
});
const upload = multer({ storage });

// GET all active courses
router.get('/api/sms/courses/all', async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET course detail
router.get('/api/sms/courses/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST select course
router.post('/api/sms/enrollment/select-course', authMiddleware, async (req, res) => {
  try {
    const { courseId } = req.body;
    const student = await Student.findById(req.user.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    if (student.selectedCourse) return res.status(400).json({ message: 'Course already selected' });
    student.selectedCourse = courseId;
    student.enrollmentStatus = 'pending_payment';
    student.enrollmentDate = new Date();
    await student.save();
    res.json({ message: 'Course selected. Please submit fee.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST submit fee
router.post('/api/sms/enrollment/submit-fee', authMiddleware, upload.single('paymentProof'), async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    if (!student || !student.selectedCourse) return res.status(400).json({ message: 'No course selected' });
    const course = await Course.findById(student.selectedCourse);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    // Create FeeRecord
    const feeRecord = new FeeRecord({
      studentId: student._id,
      courseId: course._id,
      amount: course.fee,
      dueDate: new Date(Date.now() + 7*24*60*60*1000), // 7 days from now
      paymentProofUrl: req.file ? `/uploads/fee-proofs/${req.file.filename}` : undefined,
      submissionDate: new Date(),
      status: 'pending'
    });
    await feeRecord.save();
    res.json({ message: 'Fee submitted. Awaiting admin approval.', challanNo: feeRecord.challanNo });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET my enrollment + fee status
router.get('/api/sms/enrollment/my-status', authMiddleware, async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).populate('selectedCourse');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    const feeRecord = await FeeRecord.findOne({ studentId: student._id, courseId: student.selectedCourse?._id }).sort({ submissionDate: -1 });
    res.json({ student, feeRecord });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin Approve Enrollment
router.put('/api/sms/enrollment/approve/:studentId', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admins only' });
    const student = await Student.findById(req.params.studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    // Approve student
    student.enrollmentStatus = 'enrolled';
    student.approvedBy = req.user.id;
    student.approvedAt = new Date();
    await student.save();
    // Approve fee record
    await FeeRecord.updateMany({ studentId: student._id, status: 'pending' }, { status: 'approved', approvedBy: req.user.id, approvedAt: new Date() });
    res.json({ message: 'Student enrollment approved.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin Reject Enrollment
router.put('/api/sms/enrollment/reject/:studentId', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admins only' });
    const { reason } = req.body;
    const student = await Student.findById(req.params.studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    student.enrollmentStatus = 'rejected';
    await student.save();
    // Reject fee record
    await FeeRecord.updateMany({ studentId: student._id, status: 'pending' }, { status: 'rejected', rejectionReason: reason });
    res.json({ message: 'Student enrollment rejected.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
