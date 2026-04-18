const express = require('express');
const router = express.Router();
const { updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Update user profile
router.put('/profile', protect, updateProfile);

module.exports = router;
