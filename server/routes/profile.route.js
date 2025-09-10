import express from 'express';
import protect from '../middleware/auth.js';
import restrictTo from '../middleware/rbac.js';
import { validateProfileUpdate } from '../middleware/validation/profileValidation.js';
import { getProfile, updateProfile } from '../controllers/profile.controller.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Only volunteers can access profile routes
router.use(restrictTo('volunteer'));

// Get current user's profile
router.get('/', getProfile);

// Update profile
router.put('/', validateProfileUpdate, updateProfile);

export default router;