const express = require('express');
const router = express.Router();
const { 
  getOpportunities, 
  getOpportunity, 
  createOpportunity,
  getAdminOpportunities,
  updateOpportunity,
  deleteOpportunity
} = require('../controllers/opportunityController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getOpportunities);
router.get('/:id', protect, getOpportunity);
router.post('/create', protect, createOpportunity);
router.get('/admin/opportunities', protect, getAdminOpportunities);
router.put('/admin/:id', protect, updateOpportunity);
router.delete('/admin/:id', protect, deleteOpportunity);

module.exports = router;
