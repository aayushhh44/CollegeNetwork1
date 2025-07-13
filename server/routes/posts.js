const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Public routes (for viewing posts)
router.get('/', postsController.getPosts);
router.get('/:id', authenticateToken, postsController.getPost);

// Protected routes (require authentication)
router.use(authenticateToken);

// Create post
router.post('/', postsController.createPost);

// Update post (author or teacher only)
router.put('/:id', postsController.updatePost);

// Delete post (author or teacher only)
router.delete('/:id', postsController.deletePost);

// Like/unlike post
router.post('/:id/like', postsController.toggleLike);

// Comments
router.post('/:id/comments', postsController.addComment);
router.delete('/:id/comments/:commentId', postsController.deleteComment);

module.exports = router; 