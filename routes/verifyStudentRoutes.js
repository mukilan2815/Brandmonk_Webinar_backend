const express = require('express');
const router = express.Router();
const CourseStudent = require('../models/CourseStudent');
const StudentVerification = require('../models/StudentVerification');
const { sendGraduationEmail } = require('../services/emailService');

const normalizeName = (value) => value
  .trim()
  .toUpperCase()
  .replace(/\s+/g, ' ')
  .replace(/[.,]/g, '');

const phonePattern = (digits) => new RegExp(`^${digits.split('').join('\\D*')}$`);

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

    // Match both name and mobile so a phone number assigned to another student
    // cannot return that student's course details.
    const students = await CourseStudent.find({
      phoneNumber: { $regex: phonePattern(cleanMobile) }
    }).select('name courseName courseSlug certificateId phoneNumber');

    const matchingStudents = students.filter((student) =>
      normalizeName(student.name) === normalizeName(name)
    );

    if (matchingStudents.length === 0) {
      const message = students.length === 0
        ? 'Mobile number not registered in our database. Please contact admin for assistance.'
        : 'The name and mobile number do not match our records. Please check your details.';

      return res.status(students.length === 0 ? 404 : 400).json({
        success: false,
        message
      });
    }

    if (matchingStudents.length > 1) {
      return res.status(409).json({
        success: false,
        message: 'Multiple student records match these details. Please contact admin for assistance.'
      });
    }

    const student = matchingStudents[0];
    const courseName = student.courseName || null;
    const courseSlug = student.courseSlug || null;
    const certificateId = student.certificateId || null;

    // Store the submission
    const entry = await StudentVerification.create({
      name: student.name,
      email: (email || '').trim().toLowerCase(),
      mobile: cleanMobile,
      courseName,
      courseSlug,
      certificateId
    });

    const recipientEmail = (email || '').trim().toLowerCase();
    console.log('[VerifyStudent] Registration saved:', {
      entryId: entry._id.toString(),
      name: student.name,
      email: recipientEmail || 'missing',
      mobile: cleanMobile,
      courseName: courseName || '24th Graduation Function'
    });

    const frontendUrl = process.env.FRONTEND_URL || 'https://registrations.brandmonkacademy.com';
    const boardingPassParams = new URLSearchParams({
      name: student.name,
      email: (email || '').trim(),
      mobile: cleanMobile,
      courseName: courseName || '24th Graduation Function'
    });
    const emailStatus = await sendGraduationEmail({
      to: (email || '').trim().toLowerCase(),
      studentName: student.name,
      boardingPassUrl: `${frontendUrl}/verified?${boardingPassParams.toString()}`
    });

    res.json({
      success: true,
      emailStatus,
      student: {
        name: student.name,
        email: (email || '').trim(),
        mobile: cleanMobile,
        courseName,
        courseSlug,
        certificateId
      },
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

// @desc    Toggle attendance for a verification entry
// @route   PATCH /api/verify-student/entries/:id/attendance
// @access  Private (Admin only)
router.patch('/entries/:id/attendance', async (req, res) => {
  try {
    const { id } = req.params;
    const entry = await StudentVerification.findById(id);

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Verification entry not found'
      });
    }

    entry.attended = !entry.attended;
    await entry.save();

    res.json({
      success: true,
      attended: entry.attended,
      message: entry.attended ? 'Marked as attended' : 'Marked as not attended'
    });
  } catch (error) {
    console.error('ToggleAttendance Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update attendance'
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
      .select('name email mobile courseName courseSlug certificateId attended createdAt');

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
