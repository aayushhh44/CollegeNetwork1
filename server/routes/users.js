const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Get all users (teachers can see all, others see limited info)
router.get('/', usersController.getUsers);

// Search users
router.get('/search', usersController.searchUsers);

// Get user by ID
router.get('/:id', usersController.getUserById);

// Update user (teachers only)
router.put('/:id', authorizeRole('teacher'), usersController.updateUser);

// Delete user (teachers only)
router.delete('/:id', authorizeRole('teacher'), usersController.deleteUser);

// Get user statistics (teachers only)
router.get('/stats/overview', authorizeRole('teacher'), usersController.getUserStats);

module.exports = router; 