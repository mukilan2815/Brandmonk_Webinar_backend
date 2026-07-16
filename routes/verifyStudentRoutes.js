const express = require('express');
const router = express.Router();
const CourseStudent = require('../models/CourseStudent');
const StudentVerification = require('../models/StudentVerification');

// @desc    Verify student by mobile number
// @route   POST /api/verify-student
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, mobile } = req.body;

    if (!mobile || !mobile.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number is required'
      });
    }

    const cleanMobile = mobile.trim().replace(/\D/g, '');

    if (cleanMobile.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-digit mobile number'
      });
    }

    // Search for student by phone number across all courses
    const student = await CourseStudent.findOne({ phoneNumber: cleanMobile });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'No student found with this mobile number'
      });
    }

    // Verify name matches (case-insensitive)
    if (name && name.trim() && student.name.toLowerCase().trim() !== name.toLowerCase().trim()) {
      return res.status(404).json({
        success: false,
        message: 'The name does not match our records for this mobile number'
      });
    }

    // Verify email matches (case-insensitive)
    if (email && email.trim() && student.email && student.email.toLowerCase().trim() !== email.toLowerCase().trim()) {
      return res.status(404).json({
        success: false,
        message: 'The email does not match our records for this mobile number'
      });
    }

    // Save verification entry
    await StudentVerification.create({
      name: student.name,
      mobile: cleanMobile,
      courseName: student.courseName,
      courseSlug: student.courseSlug,
      certificateId: student.certificateId
    });

    res.json({
      success: true,
      student: {
        name: student.name,
        email: student.email || '',
        mobile: cleanMobile,
        courseName: student.courseName,
        certificateId: student.certificateId
      }
    });
  } catch (error) {
    console.error('VerifyStudent Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while verifying student'
    });
  }
});

// @desc    Get all student verification entries
// @route   GET /api/verify-student/entries
// @access  Private (Admin only)
router.get('/entries', async (req, res) => {
  try {
    const entries = await StudentVerification.find({})
      .sort({ createdAt: -1 })
      .select('name mobile courseName courseSlug certificateId createdAt');

    res.json({
      success: true,
      count: entries.length,
      entries
    });
  } catch (error) {
    console.error('GetVerificationEntries Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch verification entries'
    });
  }
});

module.exports = router;
