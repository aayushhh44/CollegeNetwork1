const PendingCollege = require('../models/PendingCollege');
const College = require('../models/College');
const { sendCollegeVerificationEmail } = require('../services/emailService');

// Register a new college (pending verification)
const registerCollege = async (req, res) => {
  try {
    const { collegeName, collegeEmail, verificationDocs, termsAgreed } = req.body;

    // Validate required fields
    if (!collegeName || !collegeEmail || !verificationDocs || !termsAgreed) {
      return res.status(400).json({ 
        message: 'All fields are required and terms must be agreed to' 
      });
    }

    // Check if terms are agreed
    if (!termsAgreed) {
      return res.status(400).json({ 
        message: 'You must agree to the terms and conditions' 
      });
    }

    // Check if college already exists (pending or approved)
    const existingPending = await PendingCollege.findOne({ collegeEmail });
    const existingCollege = await College.findOne({ collegeEmail });

    if (existingPending || existingCollege) {
      return res.status(400).json({ 
        message: 'A college with this email already exists' 
      });
    }

    // Create pending college registration
    const pendingCollege = new PendingCollege({
      collegeName,
      collegeEmail,
      verificationDocs,
      termsAgreed
    });

    await pendingCollege.save();

    res.status(201).json({
      message: 'College registration submitted successfully. We will review your application and contact you soon.',
      collegeId: pendingCollege._id
    });
  } catch (error) {
    console.error('College registration error:', error);
    res.status(500).json({ message: 'Server error during college registration' });
  }
};

// Get all pending colleges (admin only)
const getPendingColleges = async (req, res) => {
  try {
    const pendingColleges = await PendingCollege.find({ status: 'pending' })
      .sort({ createdAt: -1 });

    res.json({ pendingColleges });
  } catch (error) {
    console.error('Get pending colleges error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify/reject college request (admin only)
const verifyCollegeRequest = async (req, res) => {
  try {
    const { collegeId, action, rejectionReason } = req.body;
    const { user } = req;

    if (!collegeId || !action) {
      return res.status(400).json({ message: 'College ID and action are required' });
    }

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ message: 'Action must be either approve or reject' });
    }

    const pendingCollege = await PendingCollege.findById(collegeId);
    if (!pendingCollege) {
      return res.status(404).json({ message: 'Pending college not found' });
    }

    if (action === 'approve') {
      // Extract domain from email
      const domain = pendingCollege.collegeEmail.split('@')[1];

      // Create verified college
      const college = new College({
        collegeName: pendingCollege.collegeName,
        collegeEmail: pendingCollege.collegeEmail,
        domain,
        verifiedBy: user._id,
        verifiedAt: new Date()
      });

      await college.save();

      // Update pending college status
      pendingCollege.status = 'approved';
      pendingCollege.isVerified = true;
      pendingCollege.verifiedBy = user._id;
      pendingCollege.verifiedAt = new Date();
      await pendingCollege.save();

      // Send approval email
      await sendCollegeVerificationEmail(
        pendingCollege.collegeEmail,
        pendingCollege.collegeName,
        true
      );

      res.json({
        message: 'College approved successfully',
        college: {
          id: college._id,
          collegeName: college.collegeName,
          collegeEmail: college.collegeEmail,
          domain: college.domain
        }
      });
    } else {
      // Reject college
      pendingCollege.status = 'rejected';
      pendingCollege.rejectionReason = rejectionReason || 'Application rejected';
      await pendingCollege.save();

      // Send rejection email
      await sendCollegeVerificationEmail(
        pendingCollege.collegeEmail,
        pendingCollege.collegeName,
        false,
        rejectionReason
      );

      res.json({
        message: 'College rejected successfully',
        rejectionReason: rejectionReason || 'Application rejected'
      });
    }
  } catch (error) {
    console.error('Verify college request error:', error);
    res.status(500).json({ message: 'Server error during college verification' });
  }
};

// SuperAdmin: Approve a pending college by ID and move to Colleges
const verifyCollegeRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;
    const pendingCollege = await PendingCollege.findById(id);
    if (!pendingCollege) {
      return res.status(404).json({ message: 'Pending college not found' });
    }
    if (pendingCollege.status !== 'pending') {
      return res.status(400).json({ message: 'College already processed' });
    }
    // Extract domain from email
    const domain = pendingCollege.collegeEmail.split('@')[1];
    // Create verified college
    const college = new College({
      collegeName: pendingCollege.collegeName,
      collegeEmail: pendingCollege.collegeEmail,
      domain,
      verifiedBy: user._id,
      verifiedAt: new Date()
    });
    await college.save();
    // Update pending college status
    pendingCollege.status = 'approved';
    pendingCollege.isVerified = true;
    pendingCollege.verifiedBy = user._id;
    pendingCollege.verifiedAt = new Date();
    await pendingCollege.save();
    // Send approval email
    await sendCollegeVerificationEmail(
      pendingCollege.collegeEmail,
      pendingCollege.collegeName,
      true
    );
    res.json({
      message: 'College approved and moved to Colleges collection',
      college: {
        id: college._id,
        collegeName: college.collegeName,
        collegeEmail: college.collegeEmail,
        domain: college.domain
      }
    });
  } catch (error) {
    console.error('SuperAdmin verifyCollegeRequestById error:', error);
    res.status(500).json({ message: 'Server error during college verification' });
  }
};

// Get all verified colleges
const getVerifiedColleges = async (req, res) => {
  try {
    const colleges = await College.find({ isActive: true })
      .select('collegeName collegeEmail domain')
      .sort({ collegeName: 1 });

    res.json({ colleges });
  } catch (error) {
    console.error('Get verified colleges error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Check if email domain is from a verified college
const checkCollegeDomain = async (req, res) => {
  try {
    const { email } = req.params;
    
    if (!email || !email.includes('@')) {
      return res.status(400).json({ message: 'Valid email is required' });
    }

    const domain = email.split('@')[1];
    const college = await College.findOne({ 
      domain, 
      isActive: true 
    });

    if (!college) {
      return res.status(404).json({ 
        message: 'This email domain is not from a verified college' 
      });
    }

    res.json({
      isValid: true,
      college: {
        name: college.collegeName,
        domain: college.domain
      }
    });
  } catch (error) {
    console.error('Check college domain error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerCollege,
  getPendingColleges,
  verifyCollegeRequest,
  getVerifiedColleges,
  checkCollegeDomain,
  verifyCollegeRequestById
}; 