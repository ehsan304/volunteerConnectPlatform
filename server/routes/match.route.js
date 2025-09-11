// server/routes/match.js
import express from 'express';
import protect from '../middleware/auth.js';
import restrictTo from '../middleware/rbac.js';
import { getMatchedOpportunities } from '../controllers/match.controller.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Only volunteers can access matching routes
router.use(restrictTo('volunteer'));

// Get matched opportunities for current volunteer
router.get('/', getMatchedOpportunities);

export default router;