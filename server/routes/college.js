const express = require('express');
const router = express.Router();
const collegeController = require('../controllers/collegeController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Public routes
router.post('/register', collegeController.registerCollege);
router.get('/verified', collegeController.getVerifiedColleges);
router.get('/check-domain/:email', collegeController.checkCollegeDomain);

// Admin only routes
router.get('/pending', authenticateToken, authorizeRole('teacher'), collegeController.getPendingColleges);
router.post('/verify', authenticateToken, authorizeRole('teacher'), collegeController.verifyCollegeRequest);

// SuperAdmin route for verifying a college by ID
router.post('/verifyCollegeRequest/:id', authenticateToken, authorizeRole('teacher'), collegeController.verifyCollegeRequestById);

module.exports = router; 