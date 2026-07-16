const mongoose = require('mongoose');

const studentVerificationSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    default: ''
  },
  mobile: {
    type: String,
    required: true,
    trim: true
  },
  courseName: {
    type: String,
    trim: true,
    default: ''
  },
  courseSlug: {
    type: String,
    trim: true,
    default: ''
  },
  certificateId: {
    type: String,
    trim: true,
    default: null
  }
}, {
  timestamps: true
});

studentVerificationSchema.index({ mobile: 1 });
studentVerificationSchema.index({ createdAt: -1 });

const StudentVerification = mongoose.model('StudentVerification', studentVerificationSchema);

module.exports = StudentVerification;
