import { body } from 'express-validator';
import { validateRequest } from './validateRequest.js';

export const validateProfileUpdate = [
    body('fullName')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Full name must be between 2 and 100 characters'),

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

    body('skills')
        .optional()
        .isArray()
        .withMessage('Skills must be an array'),

    body('skills.*')
        .optional()
        .trim()
        .isLength({ min: 1 })
        .withMessage('Skill cannot be empty'),

    body('availability.days')
        .optional()
        .isArray()
        .withMessage('Availability days must be an array'),

    body('availability.days.*')
        .optional()
        .isIn(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])
        .withMessage('Invalid day provided'),

    body('availability.times.start')
        .optional()
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('Start time must be in HH:MM format'),

    body('availability.times.end')
        .optional()
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('End time must be in HH:MM format'),

    validateRequest
];