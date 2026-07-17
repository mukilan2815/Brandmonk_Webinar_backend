const express = require('express');
const router = express.Router();
const CourseStudent = require('../models/CourseStudent');
const StudentVerification = require('../models/StudentVerification');

// @desc    Store student form submission
// @route   POST /api/verify-student
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, mobile } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Name is required'
      });
    }

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

    // Optionally check if student exists in CourseStudent to grab real course details
    const student = await CourseStudent.findOne({ phoneNumber: cleanMobile });

    let courseName = null;
    let courseSlug = null;
    let certificateId = null;

    if (student) {
      courseName = student.courseName || null;
      courseSlug = student.courseSlug || null;
      certificateId = student.certificateId || null;
    }

    // Store the submission
    const entry = await StudentVerification.create({
      name: name.trim(),
      email: (email || '').trim().toLowerCase(),
      mobile: cleanMobile,
      courseName,
      courseSlug,
      certificateId
    });

    res.json({
      success: true,
      student: {
        name: name.trim(),
        email: (email || '').trim(),
        mobile: cleanMobile,
        courseName,
        courseSlug,
        certificateId
      }
    });
  } catch (error) {
    console.error('VerifyStudent Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while saving student data'
    });
  }
});

// @desc    Delete a verification entry
// @route   DELETE /api/verify-student/entries/:id
// @access  Private (Admin only)
router.delete('/entries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await StudentVerification.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Verification entry not found'
      });
    }

    res.json({
      success: true,
      message: 'Verification entry deleted'
    });
  } catch (error) {
    console.error('DeleteVerificationEntry Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete verification entry'
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
      .select('name email mobile courseName courseSlug certificateId createdAt');

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
