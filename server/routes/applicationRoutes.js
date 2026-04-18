const express = require('express');
const router = express.Router();
const {
  applyForOpportunity,
  getAdminApplications,
  getStudentApplications,
  acceptApplication,
  rejectApplication,
  getApplication,
  downloadResume
} = require('../controllers/applicationController');
const { protect } = require('../middleware/auth');

// Student routes
router.post('/apply/:opportunityId', protect, applyForOpportunity);
router.get('/my-applications', protect, getStudentApplications);

// Admin routes
router.get('/admin/applications', protect, getAdminApplications);
router.put('/admin/accept/:applicationId', protect, acceptApplication);
router.put('/admin/reject/:applicationId', protect, rejectApplication);

// Resume download
router.get('/resume/:applicationId', protect, downloadResume);

// Get specific application
router.get('/:id', protect, getApplication);

module.exports = router;
