const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['internship', 'hackathon', 'competition', 'job'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    default: 'Remote'
  },
  stipend: {
    type: String
  },
  deadline: {
    type: Date
  },
  applyLink: {
    type: String,
    required: true
  },
  tags: [{
    type: String
  }],
  isPremium: {
    type: Boolean,
    default: false
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  postedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Opportunity', opportunitySchema);
