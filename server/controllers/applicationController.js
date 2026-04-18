const Application = require('../models/Application');
const Opportunity = require('../models/Opportunity');
const User = require('../models/User');

// Apply for opportunity
const applyForOpportunity = async (req, res) => {
  try {
    const { opportunityId } = req.params;
    const { resume, coverLetter, cgpa, skills } = req.body;

    if (!opportunityId) {
      return res.status(400).json({
        success: false,
        message: 'Opportunity ID is required'
      });
    }

    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found'
      });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      studentId: req.user._id,
      opportunityId: opportunityId
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this opportunity'
      });
    }

    const application = await Application.create({
      studentId: req.user._id,
      opportunityId: opportunityId,
      adminId: opportunity.adminId,
      resume: resume || '',
      coverLetter: coverLetter || '',
      cgpa: cgpa || '',
      skills: skills || ''
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get applications for admin (their opportunities)
const getAdminApplications = async (req, res) => {
  try {
    const applications = await Application.find({ adminId: req.user._id })
      .populate('studentId', 'name email phone college')
      .populate('opportunityId', 'title company type')
      .sort({ appliedAt: -1 });

    res.json({
      success: true,
      applications: applications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get student applications
const getStudentApplications = async (req, res) => {
  try {
    const applications = await Application.find({ studentId: req.user._id })
      .populate('opportunityId', 'title company type location')
      .sort({ appliedAt: -1 });

    res.json({
      success: true,
      applications: applications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Accept application (admin only)
const acceptApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Verify admin owns this opportunity
    if (application.adminId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    application.status = 'accepted';
    application.decidedAt = new Date();
    await application.save();

    res.json({
      success: true,
      message: 'Application accepted',
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Reject application (admin only)
const rejectApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { rejectionReason } = req.body;

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Verify admin owns this opportunity
    if (application.adminId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    application.status = 'rejected';
    application.rejectionReason = rejectionReason || '';
    application.decidedAt = new Date();
    await application.save();

    res.json({
      success: true,
      message: 'Application rejected',
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get specific application
const getApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('studentId', 'name email phone college skills')
      .populate('opportunityId', 'title company type location stipend description');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.json({
      success: true,
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Download resume
const downloadResume = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const application = await Application.findById(applicationId);

    if (!application || !application.resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    // If resume is base64 or file path, handle accordingly
    if (application.resume.startsWith('data:')) {
      // Base64 encoded file
      const matches = application.resume.match(/^data:([^;]+);base64,(.+)$/);
      if (matches) {
        const mimeType = matches[1];
        const buffer = Buffer.from(matches[2], 'base64');
        res.setHeader('Content-Type', mimeType);
        res.setHeader('Content-Disposition', `attachment; filename="resume.pdf"`);
        return res.send(buffer);
      }
    }

    // If it's a file path/URL
    res.json({
      success: true,
      resume: application.resume
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  applyForOpportunity,
  getAdminApplications,
  getStudentApplications,
  acceptApplication,
  rejectApplication,
  getApplication,
  downloadResume
};
