// postRoutes.js

const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.get('/', postController.getAllPosts);
router.get('/:postId', postController.getPostById);
router.post('/', postController.createPost);
router.put('/:postId', postController.updatePost);
router.delete('/:postId', postController.deletePost);

// Add other post-related routes as needed

module.exports = router;
