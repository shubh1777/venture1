const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Please provide withdrawal amount'],
    min: [100, 'Minimum withdrawal amount is ₹100']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  bankDetails: {
    accountHolder: String,
    accountNumber: String,
    ifscCode: String,
    bankName: String
  },
  rejectionReason: String,
  requestedAt: {
    type: Date,
    default: Date.now
  },
  approvedAt: Date,
  completedAt: Date
});

module.exports = mongoose.model('Withdrawal', withdrawalSchema);
