
import { body } from 'express-validator';
import User from '../../models/User.model.js';
import { validateRequest } from './validateRequest.js';

// Validation rules for signup
export const validateSignup = [
    
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail()
        .custom(async (value) => {
            const user = await User.findOne({ email: value });
            if (user) {
                throw new Error('Email already in use');
            }
        }),

    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),

    body('role')
        .isIn(['volunteer', 'organizer'])
        .withMessage('Role must be either volunteer or organizer'),

    validateRequest // This will handle the validation result
];

// Validation rules for login
export const validateLogin = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),

    body('password')
        .notEmpty()
        .withMessage('Password is required'),

    validateRequest // This will handle the validation result
];