import express from 'express';
import jwt from 'jsonwebtoken';
import Student from '../../models/sms/Student.js';
import authMiddleware from '../../middleware/authMiddleware.js';
const router = express.Router();

// Register
router.post('/api/sms/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone, course, batch, role, profilePic } = req.body;
    const existing = await Student.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });
    const student = new Student({ name, email, password, phone, course, batch, role, profilePic });
    await student.save();
    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Login
router.post('/api/sms/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ email });
    if (!student) return res.status(400).json({ message: 'Invalid credentials' });
    const isMatch = await student.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign(
      { id: student._id, name: student.name, role: student.role, studentId: student.studentId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token, user: { id: student._id, name: student.name, role: student.role, studentId: student.studentId } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get current user
router.get('/api/sms/auth/me', authMiddleware, async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select('-password');
    if (!student) return res.status(404).json({ message: 'User not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
