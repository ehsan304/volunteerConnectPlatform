import Profile from '../models/Profile.model.js';
import { NotFoundError, InternalServerError } from '../utils/AppError.js';

// Get current user's profile
export const getProfile = async (req, res, next) => {
    try {
        const profile = await Profile.findOne({ user: req.user._id }).populate('user', 'email role');

        if (!profile) {
            return next(new NotFoundError('Profile not found'));
        }

        res.status(200).json({
            success: true,
            data: profile
        });
    } catch (error) {
        next(new InternalServerError('Error fetching profile'));
    }
};

// Update profile
export const updateProfile = async (req, res, next) => {
    try {
        const { fullName, location, skills, availability } = req.body;

        // Check if profile exists
        let profile = await Profile.findOne({ user: req.user._id });

        if (!profile) {
            return next(new NotFoundError('Profile not found'));
        }

        // Update profile
        profile = await Profile.findOneAndUpdate(
            { user: req.user._id },
            {
                fullName,
                location: {
                    ...profile.location,
                    ...location
                },
                skills,
                availability: {
                    ...profile.availability,
                    ...availability
                }
            },
            {
                new: true,
                runValidators: true
            }
        ).populate('user', 'email role');

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: profile
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(el => el.message);
            return next(new BadRequestError(`Invalid input data: ${errors.join(', ')}`));
        }
        next(new InternalServerError('Error updating profile'));
    }
};