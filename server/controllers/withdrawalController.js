const Withdrawal = require('../models/Withdrawal');
const User = require('../models/User');

// Request withdrawal
const requestWithdrawal = async (req, res) => {
  try {
    const { amount, accountHolder, accountNumber, ifscCode, bankName } = req.body;

    if (!amount || amount < 100) {
      return res.status(400).json({
        success: false,
        message: 'Minimum withdrawal amount is ₹100'
      });
    }

    const user = await User.findById(req.user._id);
    
    if (user.pendingEarnings < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient earnings'
      });
    }

    const withdrawal = await Withdrawal.create({
      userId: req.user._id,
      amount,
      bankDetails: {
        accountHolder,
        accountNumber,
        ifscCode,
        bankName
      }
    });

    // Deduct from pending earnings
    user.pendingEarnings -= amount;
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Withdrawal request submitted',
      data: withdrawal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get withdrawal history
const getWithdrawalHistory = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({ userId: req.user._id })
      .sort({ requestedAt: -1 });

    res.json({
      success: true,
      data: withdrawals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Admin: Get all pending withdrawals
const getPendingWithdrawals = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const withdrawals = await Withdrawal.find({ status: 'pending' })
      .populate('userId', 'name email')
      .sort({ requestedAt: -1 });

    res.json({
      success: true,
      data: withdrawals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Admin: Approve withdrawal
const approveWithdrawal = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const withdrawal = await Withdrawal.findByIdAndUpdate(
      req.params.id,
      {
        status: 'completed',
        approvedAt: new Date(),
        completedAt: new Date()
      },
      { new: true }
    );

    if (!withdrawal) {
      return res.status(404).json({
        success: false,
        message: 'Withdrawal not found'
      });
    }

    // Add to withdrawn earnings
    const user = await User.findById(withdrawal.userId);
    user.withdrawnEarnings += withdrawal.amount;
    await user.save();

    res.json({
      success: true,
      message: 'Withdrawal approved',
      data: withdrawal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Admin: Reject withdrawal
const rejectWithdrawal = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const { reason } = req.body;
    const withdrawal = await Withdrawal.findByIdAndUpdate(
      req.params.id,
      {
        status: 'rejected',
        rejectionReason: reason
      },
      { new: true }
    );

    if (!withdrawal) {
      return res.status(404).json({
        success: false,
        message: 'Withdrawal not found'
      });
    }

    // Refund to pending earnings
    const user = await User.findById(withdrawal.userId);
    user.pendingEarnings += withdrawal.amount;
    await user.save();

    res.json({
      success: true,
      message: 'Withdrawal rejected',
      data: withdrawal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  requestWithdrawal,
  getWithdrawalHistory,
  getPendingWithdrawals,
  approveWithdrawal,
  rejectWithdrawal
};
