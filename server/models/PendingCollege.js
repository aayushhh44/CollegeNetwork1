const mongoose = require('mongoose');

const pendingCollegeSchema = new mongoose.Schema({
  collegeName: {
    type: String,
    required: true,
    trim: true
  },
  collegeEmail: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  verificationDocs: {
    type: String, // URL to uploaded document
    required: true
  },
  termsAgreed: {
    type: Boolean,
    required: true,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: {
    type: Date
  },
  rejectionReason: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('PendingCollege', pendingCollegeSchema); 