const express = require('express');
const router = express.Router();
const { 
  requestWithdrawal, 
  getWithdrawalHistory,
  getPendingWithdrawals,
  approveWithdrawal,
  rejectWithdrawal
} = require('../controllers/withdrawalController');
const { protect } = require('../middleware/auth');

router.post('/request', protect, requestWithdrawal);
router.get('/history', protect, getWithdrawalHistory);
router.get('/admin/pending', protect, getPendingWithdrawals);
router.put('/admin/approve/:id', protect, approveWithdrawal);
router.put('/admin/reject/:id', protect, rejectWithdrawal);

module.exports = router;
