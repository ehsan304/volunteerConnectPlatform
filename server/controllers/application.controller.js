import Application from '../models/Application.model.js';
import Opportunity from '../models/Opportunity.model.js';
import { NotFoundError, BadRequestError } from '../utils/AppError.js';

export const createApplication = async (req, res, next) => {
    try {
        const { opportunityId, message } = req.body;

        // Check if opportunity exists
        const opportunity = await Opportunity.findById(opportunityId);
        if (!opportunity) {
            return next(new NotFoundError('Opportunity not found'));
        }

        // Check if already applied
        const existingApplication = await Application.findOne({
            opportunity: opportunityId,
            volunteer: req.user._id
        });

        if (existingApplication) {
            return next(new BadRequestError('You have already applied to this opportunity'));
        }

        // Create application
        const application = await Application.create({
            opportunity: opportunityId,
            volunteer: req.user._id,
            message
        });

        // Populate related data
        await application.populate('opportunity', 'title');

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            data: application
        });
    } catch (error) {
        next(error);
    }
};

export const getApplications = async (req, res, next) => {
    try {
        const { opportunityId } = req.params;

        const applications = await Application.find({ opportunity: opportunityId })
            .populate('volunteer', 'email')
            .populate('opportunity', 'title');

        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications
        });
    } catch (error) {
        next(error);
    }
};

export const getMyApplications = async (req, res, next) => {
    try {
        const applications = await Application.find({ volunteer: req.user._id })
            .populate('opportunity', 'title organizer location date')
            .populate({
                path: 'opportunity',
                populate: {
                    path: 'organizer',
                    select: 'email'
                }
            })
            .sort({ appliedAt: -1 });

        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications
        });
    } catch (error) {
        next(error);
    }
};

export const updateApplicationStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            return next(new BadRequestError('Invalid status'));
        }

        const application = await Application.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        ).populate('volunteer', 'email');

        if (!application) {
            return next(new NotFoundError('Application not found'));
        }

        res.status(200).json({
            success: true,
            message: `Application ${status}`,
            data: application
        });
    } catch (error) {
        next(error);
    }
};