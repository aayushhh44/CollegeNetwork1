const OTP = require('../models/OTP');
const User = require('../models/User');
const College = require('../models/College');
const { sendOTPEmail } = require('../services/emailService');
const jwt = require('jsonwebtoken');

// Generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP to student email
const sendOTP = async (req, res) => {
  try {
    const { email, name, semester, gender } = req.body;

    // Validate required fields
    if (!email || !name || !semester || !gender) {
      return res.status(400).json({ 
        message: 'All fields are required' 
      });
    }

    // Check if email is from a verified college
    const domain = email.split('@')[1];
    const college = await College.findOne({ 
      domain, 
      isActive: true 
    });

    if (!college) {
      return res.status(400).json({ 
        message: 'This email domain is not from a verified college' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'A user with this email already exists' 
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete any existing OTP for this email
    await OTP.deleteMany({ email, purpose: 'student_verification' });

    // Create new OTP
    const otpRecord = new OTP({
      email,
      otp,
      purpose: 'student_verification',
      expiresAt
    });

    await otpRecord.save();

    // Send OTP email
    const emailResult = await sendOTPEmail(email, otp, 'student_verification');
    
    if (!emailResult.success) {
      await OTP.findByIdAndDelete(otpRecord._id);
      return res.status(500).json({ 
        message: 'Failed to send OTP email' 
      });
    }

    // Store temporary user data in session or cache
    // For now, we'll store it in the OTP record
    otpRecord.userData = { name, semester, gender, collegeId: college._id };
    await otpRecord.save();

    res.json({
      message: 'OTP sent successfully to your email',
      email: email
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ message: 'Server error during OTP sending' });
  }
};

// Verify OTP and create student account
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ 
        message: 'Email and OTP are required' 
      });
    }

    // Find the OTP record
    const otpRecord = await OTP.findOne({
      email,
      otp,
      purpose: 'student_verification',
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      return res.status(400).json({ 
        message: 'Invalid or expired OTP' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'A user with this email already exists' 
      });
    }

    // Get college information
    const college = await College.findById(otpRecord.userData.collegeId);
    if (!college) {
      return res.status(400).json({ 
        message: 'College not found' 
      });
    }

    // Create student user
    const user = new User({
      firstName: otpRecord.userData.name.split(' ')[0] || otpRecord.userData.name,
      lastName: otpRecord.userData.name.split(' ').slice(1).join(' ') || '',
      email,
      password: Math.random().toString(36).slice(-8), // Generate random password
      role: 'student',
      department: college.collegeName,
      graduationYear: new Date().getFullYear() + 4, // Estimate graduation year
      isActive: true
    });

    await user.save();

    // Mark OTP as used
    otpRecord.isUsed = true;
    await otpRecord.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Student account created successfully',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        department: user.department
      }
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Server error during OTP verification' });
  }
};

// Resend OTP
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        message: 'Email is required' 
      });
    }

    // Check if email is from a verified college
    const domain = email.split('@')[1];
    const college = await College.findOne({ 
      domain, 
      isActive: true 
    });

    if (!college) {
      return res.status(400).json({ 
        message: 'This email domain is not from a verified college' 
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete any existing OTP for this email
    await OTP.deleteMany({ email, purpose: 'student_verification' });

    // Create new OTP
    const otpRecord = new OTP({
      email,
      otp,
      purpose: 'student_verification',
      expiresAt
    });

    await otpRecord.save();

    // Send OTP email
    const emailResult = await sendOTPEmail(email, otp, 'student_verification');
    
    if (!emailResult.success) {
      await OTP.findByIdAndDelete(otpRecord._id);
      return res.status(500).json({ 
        message: 'Failed to send OTP email' 
      });
    }

    res.json({
      message: 'OTP resent successfully',
      email: email
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ message: 'Server error during OTP resending' });
  }
};

module.exports = {
  sendOTP,
  verifyOTP,
  resendOTP
}; 