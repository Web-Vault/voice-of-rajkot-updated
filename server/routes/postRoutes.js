import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
      createPost,
      getPosts,
      getPostById,
      updatePost,
      deletePost,
      likePost,
      getPostsByAuthor,
      getPostsByTag
} from '../controllers/postController.js';

const router = express.Router();

// Public routes
router.get('/', getPosts);
router.get('/:id', getPostById);
router.get('/author/:id', getPostsByAuthor);
router.get('/tag/:tag', getPostsByTag);

// Protected routes
router.post('/', protect, createPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);
router.put('/:id/like', protect, likePost);

export default router;