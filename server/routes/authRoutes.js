import express from 'express';
import { register, login, getUserProfile, getAllPerformers, getUserById, updateUserProfile, artistOnboarding, getAllUsers, requestPasswordReset, confirmPasswordReset, verifyPasswordReset, setNewPassword  } from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

// Get user profile route (protected)
router.get('/profile', protect, getUserProfile);

// Update user profile route (protected)
router.put('/profile', protect, updateUserProfile);

// Get all performers route
router.get('/performers', getAllPerformers);

// Get user by ID route
router.get('/users/:id', getUserById);

// Get all users route (protected, admin only)
router.get('/users', protect, getAllUsers);

// Artist onboarding route (protected)
router.post('/artist-onboarding', protect, artistOnboarding);

// Password reset via OTP
router.post('/password-reset/request', requestPasswordReset);
router.post('/password-reset/confirm', confirmPasswordReset);
router.post('/password-reset/verify', verifyPasswordReset);
router.post('/password-reset/set', setNewPassword);

export default router;