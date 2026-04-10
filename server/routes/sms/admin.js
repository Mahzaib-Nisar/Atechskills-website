import express from 'express';
import Student from '../../models/sms/Student.js';
import FeeRecord from '../../models/sms/FeeRecord.js';
import Course from '../../models/sms/Course.js';
import authMiddleware from '../../middleware/authMiddleware.js';
const router = express.Router();

// Admin role check middleware
function adminOnly(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Admins only' });
  next();
}

// GET /api/sms/admin/stats
router.get('/api/sms/admin/stats', authMiddleware, adminOnly, async (req, res) => {
  try {
    const totalEnrolled = await Student.countDocuments({ enrollmentStatus: 'enrolled' });
    const pendingApprovals = await FeeRecord.countDocuments({ status: 'pending' });
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const feeCollected = await FeeRecord.aggregate([
      { $match: { status: 'approved', submissionDate: { $gte: monthStart } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const activeCourses = await Course.countDocuments({ isActive: true });
    const activeBatches = await Course.distinct('batchNo', { isActive: true });
    res.json({
      totalEnrolled,
      pendingApprovals,
      feeCollected: feeCollected[0]?.total || 0,
      activeCourses,
      activeBatches: activeBatches.length
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/sms/admin/pending-approvals
router.get('/api/sms/admin/pending-approvals', authMiddleware, adminOnly, async (req, res) => {
  try {
    const pending = await FeeRecord.find({ status: 'pending' })
      .populate('studentId', 'name studentId selectedCourse enrollmentDate')
      .populate('courseId', 'name')
      .sort({ submissionDate: -1 });
    res.json(pending);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/sms/admin/enrolled-students
router.get('/api/sms/admin/enrolled-students', authMiddleware, adminOnly, async (req, res) => {
  try {
    const filter = { enrollmentStatus: 'enrolled' };
    if (req.query.course) filter['selectedCourse'] = req.query.course;
    if (req.query.batch) filter['batch'] = req.query.batch;
    if (req.query.track) filter['track'] = req.query.track;
    if (req.query.status) filter['status'] = req.query.status;
    const students = await Student.find(filter)
      .populate('selectedCourse', 'name track bootcampType')
      .sort({ enrollmentDate: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/sms/admin/fee-records
router.get('/api/sms/admin/fee-records', authMiddleware, adminOnly, async (req, res) => {
  try {
    const records = await FeeRecord.find({})
      .populate('studentId', 'name studentId')
      .populate('courseId', 'name')
      .sort({ dueDate: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/sms/fee/create
router.post('/api/sms/fee/create', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { studentId, courseId, amount, dueDate, label } = req.body;
    const feeRecord = new FeeRecord({
      studentId,
      courseId,
      amount,
      dueDate,
      label,
      status: 'pending'
    });
    await feeRecord.save();
    res.status(201).json(feeRecord);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/sms/courses/:id
router.put('/api/sms/courses/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
