const Referral = require('../models/Referral');
const User = require('../models/User');

// @desc    Get referral stats
// @route   GET /api/referrals/stats
const getReferralStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    const referrals = await Referral.find({ referrer: req.user._id })
      .populate('referred', 'name email createdAt')
      .sort({ createdAt: -1 });

    res.json({
      referralCode: user.referralCode,
      totalReferrals: user.totalReferrals,
      totalEarnings: user.totalEarnings,
      pendingEarnings: user.pendingEarnings,
      withdrawnEarnings: user.withdrawnEarnings,
      referrals
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get referral history
// @route   GET /api/referrals/history
const getReferralHistory = async (req, res) => {
  try {
    const referrals = await Referral.find({ referrer: req.user._id })
      .populate('referred', 'name email')
      .sort({ createdAt: -1 });

    res.json(referrals);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Validate referral code
// @route   GET /api/referrals/validate/:code
const validateReferralCode = async (req, res) => {
  try {
    const user = await User.findOne({ 
      referralCode: req.params.code.toUpperCase() 
    });

    if (user) {
      res.json({ 
        valid: true, 
        referrerName: user.name.split(' ')[0] 
      });
    } else {
      res.json({ valid: false });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getReferralStats, getReferralHistory, validateReferralCode };
