import express from 'express';
import protect from '../middleware/auth.js';
import restrictTo from '../middleware/rbac.js';
import {
    validateOpportunityCreate,
    validateOpportunityUpdate
} from '../middleware/validation/opportunityValidation.js';
import {
    getAllOpportunities,
    getOpportunity,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity,
    getMyOpportunities
} from '../controllers/opportunity.controller.js';

const router = express.Router();

// Public routes
router.get('/', getAllOpportunities);
router.get('/:id', getOpportunity);

// Protected routes (authenticated users only)
router.use(protect);

// Organizer-only routes
router.get('/my/opportunities', restrictTo('organizer'), getMyOpportunities);
router.post('/', restrictTo('organizer'), validateOpportunityCreate, createOpportunity);
router.put('/:id', restrictTo('organizer'), validateOpportunityUpdate, updateOpportunity);
router.delete('/:id', restrictTo('organizer'), deleteOpportunity);

export default router;