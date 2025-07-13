const jwt = require('jsonwebtoken');
const User = require('../models/User');
const College = require('../models/College');
const OTP = require('../models/OTP');
const { sendOTPEmail } = require('../services/emailService');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
};

// Register new user
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, department, graduationYear } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      role: role || 'student',
      department,
      graduationYear
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        department: user.department,
        graduationYear: user.graduationYear
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Register student: check college domain, send OTP
const registerStudent = async (req, res) => {
  try {
    const { name, email, semester, gender } = req.body;
    if (!name || !email || !semester || !gender) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    // Check if email domain matches a verified college
    const domain = email.split('@')[1];
    const college = await College.findOne({ domain, isActive: true });
    if (!college) {
      return res.status(400).json({ message: 'Email domain does not match any approved college' });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min
    await OTP.deleteMany({ email, purpose: 'student_verification' });
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
      return res.status(500).json({ message: 'Failed to send OTP email' });
    }
    // Store user data in OTP record (for demo, not best practice)
    otpRecord.userData = { name, semester, gender, collegeId: college._id };
    await otpRecord.save();
    res.json({ message: 'OTP sent to your email', email });
  } catch (error) {
    console.error('registerStudent error:', error);
    res.status(500).json({ message: 'Server error during student registration' });
  }
};

// Verify OTP and create student user
const verifyStudentOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }
    const otpRecord = await OTP.findOne({
      email,
      otp,
      purpose: 'student_verification',
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    // Get college info
    const college = await College.findById(otpRecord.userData.collegeId);
    if (!college) {
      return res.status(400).json({ message: 'College not found' });
    }
    // Create user
    const user = new User({
      firstName: otpRecord.userData.name.split(' ')[0] || otpRecord.userData.name,
      lastName: otpRecord.userData.name.split(' ').slice(1).join(' ') || '',
      email,
      password: Math.random().toString(36).slice(-8),
      role: 'student',
      department: college.collegeName,
      graduationYear: new Date().getFullYear() + 4,
      isActive: true
    });
    await user.save();
    otpRecord.isUsed = true;
    await otpRecord.save();
    // Generate JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    res.json({
      message: 'Student account created',
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
    console.error('verifyStudentOTP error:', error);
    res.status(500).json({ message: 'Server error during OTP verification' });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        department: user.department,
        graduationYear: user.graduationYear,
        profilePicture: user.profilePicture,
        bio: user.bio
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, department, graduationYear, bio, profilePicture } = req.body;
    
    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (department) updateData.department = department;
    if (graduationYear) updateData.graduationYear = graduationYear;
    if (bio !== undefined) updateData.bio = bio;
    if (profilePicture) updateData.profilePicture = profilePicture;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error during profile update' });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    
    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error during password change' });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  registerStudent,
  verifyStudentOTP
}; 