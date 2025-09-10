import Opportunity from '../models/Opportunity.model.js';
import { NotFoundError, ForbiddenError, InternalServerError, BadRequestError  } from '../utils/AppError.js';

// Get all opportunities (public)
export const getAllOpportunities = async (req, res, next) => {
    try {
        const opportunities = await Opportunity.find()
            .populate('organizer', 'email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: opportunities.length,
            data: opportunities
        });
    } catch (error) {
        next(new InternalServerError('Error fetching opportunities'));
    }
};

// Get single opportunity (public)
export const getOpportunity = async (req, res, next) => {
    try {
        const opportunity = await Opportunity.findById(req.params.id)
            .populate('organizer', 'email')
            .populate('volunteersRegistered', 'email');

        if (!opportunity) {
            return next(new NotFoundError('Opportunity not found'));
        }

        res.status(200).json({
            success: true,
            data: opportunity
        });
    } catch (error) {
        next(new InternalServerError('Error fetching opportunity'));
    }
};

// Create opportunity (organizer only)
export const createOpportunity = async (req, res, next) => {
    try {
        const {
            title,
            description,
            location,
            requiredSkills,
            date,
            time,
            volunteersNeeded
        } = req.body;

        const opportunity = await Opportunity.create({
            title,
            description,
            organizer: req.user._id,
            location,
            requiredSkills,
            date,
            time,
            volunteersNeeded
        });

        // Populate organizer details
        await opportunity.populate('organizer', 'email');

        res.status(201).json({
            success: true,
            message: 'Opportunity created successfully',
            data: opportunity
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(el => el.message);
            return next(new BadRequestError(`Invalid input data: ${errors.join(', ')}`));
        }
        next(new InternalServerError('Error creating opportunity'));
    }
};

// Update opportunity (organizer only)
export const updateOpportunity = async (req, res, next) => {
    try {
        let opportunity = await Opportunity.findById(req.params.id);

        if (!opportunity) {
            return next(new NotFoundError('Opportunity not found'));
        }

        // Check if user is the organizer
        if (opportunity.organizer.toString() !== req.user._id.toString()) {
            return next(new ForbiddenError('Not authorized to update this opportunity'));
        }

        opportunity = await Opportunity.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('organizer', 'email');

        res.status(200).json({
            success: true,
            message: 'Opportunity updated successfully',
            data: opportunity
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(el => el.message);
            return next(new BadRequestError(`Invalid input data: ${errors.join(', ')}`));
        }
        next(new InternalServerError('Error updating opportunity'));
    }
};

// Delete opportunity (organizer only)
export const deleteOpportunity = async (req, res, next) => {
    try {
        const opportunity = await Opportunity.findById(req.params.id);

        if (!opportunity) {
            return next(new NotFoundError('Opportunity not found'));
        }

        // Check if user is the organizer
        if (opportunity.organizer.toString() !== req.user._id.toString()) {
            return next(new ForbiddenError('Not authorized to delete this opportunity'));
        }

        await Opportunity.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Opportunity deleted successfully'
        });
    } catch (error) {
        next(new InternalServerError('Error deleting opportunity'));
    }
};

// Get opportunities created by current organizer
export const getMyOpportunities = async (req, res, next) => {
    try {
        const opportunities = await Opportunity.find({ organizer: req.user._id })
            .populate('organizer', 'email')
            .populate('volunteersRegistered', 'email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: opportunities.length,
            data: opportunities
        });
    } catch (error) {
        next(new InternalServerError('Error fetching your opportunities'));
    }
};