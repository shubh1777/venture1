const Payment = require('../models/Payment');
const User = require('../models/User');
const Referral = require('../models/Referral');
const Course = require('../models/Course');

// Dummy payment system configuration
const PLANS = {
  basic: { price: 49, commission: 10 },
  standard: { price: 99, commission: 20 },
  premium: { price: 199, commission: 40 }
};

// Generate unique order ID
const generateOrderId = () => {
  return 'order_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
};

// Generate unique payment ID
const generatePaymentId = () => {
  return 'pay_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
};

// @desc    Create dummy payment order
// @route   POST /api/payment/create-order
const createOrder = async (req, res) => {
  try {
    const { plan } = req.body;
    
    if (!PLANS[plan]) {
      return res.status(400).json({ message: 'Invalid plan selected' });
    }

    const orderId = generateOrderId();
    const amount = PLANS[plan].price;

    // Create payment record in database
    const payment = await Payment.create({
      user: req.user.id,
      razorpayOrderId: orderId,
      amount: amount,
      plan,
      status: 'created'
    });

    res.json({
      orderId: orderId,
      amount: amount,
      currency: 'INR',
      plan,
      isDummy: true,
      message: 'Dummy payment order created. Use any credentials to proceed.'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};

// @desc    Process dummy payment
// @route   POST /api/payment/process
const processPayment = async (req, res) => {
  try {
    const { orderId, plan, cardNumber, expiryDate, cvv } = req.body;

    if (!orderId || !plan) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!PLANS[plan]) {
      return res.status(400).json({ message: 'Invalid plan selected' });
    }

    // Find the payment record
    const payment = await Payment.findOne({ razorpayOrderId: orderId });

    if (!payment) {
      return res.status(404).json({ message: 'Payment order not found' });
    }

    // Validate dummy card details (basic validation for demo)
    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    
    if (cleanCardNumber.length !== 16 || isNaN(cleanCardNumber)) {
      await Payment.findByIdAndUpdate(payment._id, { status: 'failed' });
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid card number. Please use a 16-digit card number.' 
      });
    }

    if (!expiryDate || expiryDate.trim().length === 0) {
      await Payment.findByIdAndUpdate(payment._id, { status: 'failed' });
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid expiry date.' 
      });
    }

    if (!cvv || cvv.length !== 3 || isNaN(cvv)) {
      await Payment.findByIdAndUpdate(payment._id, { status: 'failed' });
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid CVV. Please enter a 3-digit CVV.' 
      });
    }

    const paymentId = generatePaymentId();

    // Update payment record
    const updatedPayment = await Payment.findByIdAndUpdate(
      payment._id,
      {
        razorpayPaymentId: paymentId,
        status: 'paid'
      },
      { new: true }
    );

    // Update user to premium
    const user = await User.findByIdAndUpdate(
      payment.user,
      {
        isPremium: true,
        premiumPlan: plan
      },
      { new: true }
    );

    // Process referral commission if user was referred
    if (user.referredBy) {
      const commission = PLANS[plan].commission;
      
      await Referral.create({
        referrer: user.referredBy,
        referred: user.id,
        plan: plan,
        amount: payment.amount,
        commission,
        status: 'completed'
      });

      await User.findByIdAndUpdate(user.referredBy, {
        $inc: {
          totalReferrals: 1,
          totalEarnings: commission,
          pendingEarnings: commission
        }
      });
    }

    res.json({
      success: true,
      message: 'Dummy payment processed successfully!',
      paymentId: paymentId,
      isPremium: true,
      plan: plan,
      amount: payment.amount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error processing payment', error: error.message });
  }
};

// @desc    Get payment history
// @route   GET /api/payment/history
const getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id, status: 'paid' })
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Purchase course
// @route   POST /api/payment/course-purchase
const purchaseCourse = async (req, res) => {
  try {
    const { courseId, cardNumber, expiryDate, cvv, cardholderName, referredBy } = req.body;

    // Find course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Validate card details
    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    
    if (cleanCardNumber.length !== 16 || isNaN(cleanCardNumber)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid card number. Please use a 16-digit card number.' 
      });
    }

    if (!expiryDate || expiryDate.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid expiry date.' 
      });
    }

    if (!cvv || cvv.length !== 3 || isNaN(cvv)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid CVV. Please enter a 3-digit CVV.' 
      });
    }

    // Get user details
    const user = await User.findById(req.user._id);

    // Create payment record
    const paymentId = generatePaymentId();
    const payment = await Payment.create({
      user: req.user._id,
      razorpayPaymentId: paymentId,
      amount: course.price,
      status: 'paid'
    });

    // Add student to course enrollment
    course.enrolledStudents.push({
      studentId: req.user._id,
      referredBy: referredBy,
      status: 'pending'
    });
    await course.save();

    // Add course to user's enrolled courses
    user.enrolledCourses.push({ courseId: course._id });
    await user.save();

    // Create referral record and credit admin + referrer
    const referrerCommission = course.commission;

    // Credit admin earnings
    const admin = await User.findById(course.adminId);
    admin.totalEarnings += course.price;
    admin.pendingEarnings += course.price;
    await admin.save();

    // If student was referred, credit referrer
    if (referredBy) {
      const referrer = await User.findById(referredBy);
      
      await Referral.create({
        referrer: referredBy,
        referred: req.user._id,
        plan: `course-${course._id}`,
        amount: course.price,
        commission: referrerCommission,
        status: 'completed'
      });

      referrer.totalReferrals += 1;
      referrer.totalEarnings += referrerCommission;
      referrer.pendingEarnings += referrerCommission;
      await referrer.save();
    }

    res.json({
      success: true,
      message: 'Course purchased successfully!',
      courseId: course._id,
      courseName: course.name,
      amount: course.price,
      paymentId: paymentId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: 'Error processing purchase', 
      error: error.message 
    });
  }
};

module.exports = { createOrder, processPayment, getPaymentHistory, purchaseCourse };
