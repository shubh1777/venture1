const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  opportunityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Opportunity',
    required: true
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  resume: {
    type: String
  },
  coverLetter: {
    type: String
  },
  cgpa: {
    type: String
  },
  skills: {
    type: String
  },
  rejectionReason: {
    type: String
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  decidedAt: {
    type: Date
  }
});

module.exports = mongoose.model('Application', applicationSchema);
