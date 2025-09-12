import express from 'express';
import protect from '../middleware/auth.js';
import restrictTo from '../middleware/rbac.js';
import {
    createApplication,
    getApplications,
    updateApplicationStatus,
    getMyApplications
} from '../controllers/application.controller.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Volunteer routes
router.post('/',
    // restrictTo('volunteer'),
    createApplication);




router.get('/my-applications', restrictTo('volunteer'), getMyApplications);

// Organizer routes
router.get('/opportunity/:opportunityId', restrictTo('organizer'), getApplications);
router.patch('/:id/status', restrictTo('organizer'), updateApplicationStatus);

export default router;