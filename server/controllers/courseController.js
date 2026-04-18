const Course = require('../models/Course');
const User = require('../models/User');

// Get all courses
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('adminId', 'name email');
    res.json({
      success: true,
      data: courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single course
const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('adminId', 'name email')
      .populate('enrolledStudents.studentId', 'name email');
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create course (Admin only)
const createCourse = async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can create courses'
      });
    }

    const { name, description, price, commission } = req.body;

    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name and price'
      });
    }

    const course = await Course.create({
      name,
      description,
      price,
      commission: commission || 0,
      adminId: user._id
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get courses created by admin
const getAdminCourses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const courses = await Course.find({ adminId: req.user._id })
      .populate('enrolledStudents.studentId', 'name email');

    res.json({
      success: true,
      courses: courses,
      totalEarnings: user.totalEarnings || 0
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Approve student enrollment
const approveEnrollment = async (req, res) => {
  try {
    const { courseId, studentId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.adminId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const enrollment = course.enrolledStudents.find(
      e => e.studentId.toString() === studentId
    );

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    enrollment.status = 'approved';
    await course.save();

    res.json({
      success: true,
      message: 'Student approved',
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Reject student enrollment
const rejectEnrollment = async (req, res) => {
  try {
    const { courseId, studentId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.adminId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const enrollment = course.enrolledStudents.find(
      e => e.studentId.toString() === studentId
    );

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    enrollment.status = 'rejected';
    await course.save();

    res.json({
      success: true,
      message: 'Student rejected',
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update course (Admin only)
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, level, totalHours, instructorName, commission } = req.body;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Verify admin owns this course
    if (course.adminId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this course'
      });
    }

    // Update fields
    if (name) course.name = name;
    if (description) course.description = description;
    if (price) course.price = price;
    if (category) course.category = category;
    if (level) course.level = level;
    if (totalHours) course.totalHours = totalHours;
    if (instructorName) course.instructorName = instructorName;
    if (commission) course.commission = commission;

    await course.save();

    res.json({
      success: true,
      message: 'Course updated successfully',
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete course (Admin only)
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Verify admin owns this course
    if (course.adminId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this course'
      });
    }

    await Course.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getCourses,
  getCourse,
  createCourse,
  getAdminCourses,
  approveEnrollment,
  rejectEnrollment,
  updateCourse,
  deleteCourse
};
