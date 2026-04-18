const express = require('express');
const router = express.Router();
const { 
  getCourses, 
  getCourse, 
  createCourse, 
  getAdminCourses,
  approveEnrollment,
  rejectEnrollment,
  updateCourse,
  deleteCourse
} = require('../controllers/courseController');
const { protect } = require('../middleware/auth');

router.get('/', getCourses);
router.post('/create', protect, createCourse);
router.get('/admin/courses', protect, getAdminCourses);
router.post('/admin/approve-enrollment', protect, approveEnrollment);
router.post('/admin/reject-enrollment', protect, rejectEnrollment);
router.put('/:id', protect, updateCourse);
router.delete('/:id', protect, deleteCourse);
router.get('/:id', getCourse);

module.exports = router;
