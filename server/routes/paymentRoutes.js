const express = require('express');
const router = express.Router();
const { createOrder, processPayment, getPaymentHistory, purchaseCourse } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.post('/create-order', protect, createOrder);
router.post('/process', protect, processPayment);
router.post('/course-purchase', protect, purchaseCourse);
router.get('/history', protect, getPaymentHistory);

module.exports = router;

