import { body } from 'express-validator';
import { validateRequest } from './validateRequest.js';

export const validateOpportunityCreate = [
    body('title')
        .trim()
        .isLength({ min: 5, max: 100 })
        .withMessage('Title must be between 5 and 100 characters'),

    body('description')
        .trim()
        .isLength({ min: 10, max: 1000 })
        .withMessage('Description must be between 10 and 1000 characters'),

    body('location.address')
        .trim()
        .isLength({ min: 5 })
        .withMessage('Address is required'),

    body('location.city')
        .trim()
        .isLength({ min: 2 })
        .withMessage('City is required'),

    body('location.zipCode')
        .trim()
        .isLength({ min: 3 })
        .withMessage('Zip code is required'),

    body('requiredSkills')
        .isArray({ min: 1 })
        .withMessage('At least one skill is required'),

    body('requiredSkills.*')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Skill cannot be empty'),

    body('date')
        .isISO8601()
        .withMessage('Valid date is required')
        .custom((value) => {
            if (new Date(value) < new Date()) {
                throw new Error('Date cannot be in the past');
            }
            return true;
        }),

    body('time.start')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('Start time must be in HH:MM format'),

    body('time.end')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('End time must be in HH:MM format'),

    body('volunteersNeeded')
        .isInt({ min: 1 })
        .withMessage('At least one volunteer is required'),

    validateRequest
];

export const validateOpportunityUpdate = [
    body('title')
        .optional()
        .trim()
        .isLength({ min: 5, max: 100 })
        .withMessage('Title must be between 5 and 100 characters'),

    body('description')
        .optional()
        .trim()
        .isLength({ min: 10, max: 1000 })
        .withMessage('Description must be between 10 and 1000 characters'),

    body('location.address')
        .optional()
        .trim()
        .isLength({ min: 5 })
        .withMessage('Address is required'),

    body('location.city')
        .optional()
        .trim()
        .isLength({ min: 2 })
        .withMessage('City is required'),

    body('location.zipCode')
        .optional()
        .trim()
        .isLength({ min: 3 })
        .withMessage('Zip code is required'),

    body('requiredSkills')
        .optional()
        .isArray({ min: 1 })
        .withMessage('At least one skill is required'),

    body('requiredSkills.*')
        .optional()
        .trim()
        .isLength({ min: 1 })
        .withMessage('Skill cannot be empty'),

    body('date')
        .optional()
        .isISO8601()
        .withMessage('Valid date is required')
        .custom((value) => {
            if (new Date(value) < new Date()) {
                throw new Error('Date cannot be in the past');
            }
            return true;
        }),

    body('time.start')
        .optional()
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('Start time must be in HH:MM format'),

    body('time.end')
        .optional()
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('End time must be in HH:MM format'),

    body('volunteersNeeded')
        .optional()
        .isInt({ min: 1 })
        .withMessage('At least one volunteer is required'),

    validateRequest
];