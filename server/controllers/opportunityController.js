const Opportunity = require('../models/Opportunity');

// @desc    Get all opportunities (with premium filter)
// @route   GET /api/opportunities
const getOpportunities = async (req, res) => {
  try {
    const { type, search, page = 1, limit = 10 } = req.query;
    const isPremium = req.user?.isPremium || false;

    let query = { isActive: true };

    if (!isPremium) {
      query.isPremium = false;
    }

    if (type && type !== 'all') {
      query.type = type;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const opportunities = await Opportunity.find(query)
      .populate('adminId', 'name email')
      .sort({ postedAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Opportunity.countDocuments(query);

    res.json({
      opportunities,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single opportunity
// @route   GET /api/opportunities/:id
const getOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id)
      .populate('adminId', 'name email');
    
    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    if (opportunity.isPremium && !req.user?.isPremium) {
      return res.status(403).json({ message: 'Premium membership required' });
    }

    res.json(opportunity);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create opportunity (Admin only)
// @route   POST /api/opportunities/create
const createOpportunity = async (req, res) => {
  try {
    const user = req.user;
    
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can create opportunities'
      });
    }

    const { title, company, type, description, location, stipend, deadline, applyLink, tags, isPremium } = req.body;

    const opportunity = await Opportunity.create({
      title,
      company,
      type,
      description,
      location: location || 'Remote',
      stipend,
      deadline,
      applyLink,
      tags: tags || [],
      isPremium: isPremium || false,
      adminId: user._id
    });

    res.status(201).json({
      success: true,
      message: 'Opportunity created successfully',
      data: opportunity
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get admin's opportunities
const getAdminOpportunities = async (req, res) => {
  try {
    const opportunities = await Opportunity.find({ adminId: req.user._id });

    res.json({
      success: true,
      opportunities: opportunities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update opportunity (admin only)
const updateOpportunity = async (req, res) => {
  try {
    const { id } = req.params;
    const opportunity = await Opportunity.findById(id);

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found'
      });
    }

    // Verify admin owns this opportunity
    if (opportunity.adminId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own opportunities'
      });
    }

    const { title, company, type, description, location, stipend, deadline, applyLink, tags, isActive } = req.body;

    if (title) opportunity.title = title;
    if (company) opportunity.company = company;
    if (type) opportunity.type = type;
    if (description) opportunity.description = description;
    if (location) opportunity.location = location;
    if (stipend) opportunity.stipend = stipend;
    if (deadline) opportunity.deadline = deadline;
    if (applyLink) opportunity.applyLink = applyLink;
    if (tags) opportunity.tags = tags;
    if (isActive !== undefined) opportunity.isActive = isActive;

    await opportunity.save();

    res.json({
      success: true,
      message: 'Opportunity updated successfully',
      data: opportunity
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete opportunity
const deleteOpportunity = async (req, res) => {
  try {
    const { id } = req.params;
    const opportunity = await Opportunity.findById(id);

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found'
      });
    }

    if (opportunity.adminId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own opportunities'
      });
    }

    await Opportunity.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Opportunity deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { 
  getOpportunities, 
  getOpportunity, 
  createOpportunity,
  getAdminOpportunities,
  updateOpportunity,
  deleteOpportunity
};
