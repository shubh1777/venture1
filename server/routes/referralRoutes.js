const express = require('express');
const router = express.Router();
const { getReferralStats, getReferralHistory, validateReferralCode } = require('../controllers/referralController');
const { protect } = require('../middleware/auth');

router.get('/stats', protect, getReferralStats);
router.get('/history', protect, getReferralHistory);
router.get('/validate/:code', validateReferralCode);

module.exports = router;
