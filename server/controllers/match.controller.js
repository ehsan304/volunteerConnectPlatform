import Opportunity from '../models/Opportunity.model.js';
import Profile from '../models/Profile.model.js';
import { calculateDistance, calculateStraightLineDistance } from '../utils/distanceCalculator.js';
import { NotFoundError, InternalServerError } from '../utils/AppError.js';


const calculateSkillMatch = (volunteerSkills, opportunitySkills) => {
    const safeVolunteerSkills = Array.isArray(volunteerSkills) ? volunteerSkills : [];
    const safeOpportunitySkills = Array.isArray(opportunitySkills) ? opportunitySkills : [];

    if (!safeVolunteerSkills.length || !safeOpportunitySkills.length) return 0;

    const matchingSkills = safeVolunteerSkills.filter(skill =>
        safeOpportunitySkills.some(oppSkill =>
            String(oppSkill).toLowerCase().includes(String(skill).toLowerCase()) ||
            String(skill).toLowerCase().includes(String(oppSkill).toLowerCase())
        )
    );

    return (matchingSkills.length / safeOpportunitySkills.length) * 100;
};

// Get matched opportunities for a volunteer
export const getMatchedOpportunities = async (req, res, next) => {
    try {
        const volunteerId = req.user._id;

        // Get volunteer profile with skills and location
        const volunteerProfile = await Profile.findOne({ user: volunteerId });

        if (!volunteerProfile) {
            return next(new NotFoundError('Volunteer profile not found'));
        }

        if (!volunteerProfile.location.coordinates) {
            return next(new NotFoundError('Volunteer location not set'));
        }

        // Get all opportunities
        const opportunities = await Opportunity.find({
            date: { $gte: new Date() } // Only future opportunities
        }).populate('organizer', 'email');

        // Calculate matches
        const matches = [];

        for (const opportunity of opportunities) {
            // Calculate skill match score
            const skillMatchScore = calculateSkillMatch(
                volunteerProfile.skills,
                opportunity.requiredSkills
            );

            // Calculate distance (try Google Maps API first, fallback to straight-line)
            let distance = null;
            let duration = null;

            try {
                const volunteerCoords = {
                    lat: volunteerProfile.location.coordinates.coordinates[1],
                    lng: volunteerProfile.location.coordinates.coordinates[0]
                };

                const opportunityCoords = {
                    lat: opportunity.location.coordinates.coordinates[1],
                    lng: opportunity.location.coordinates.coordinates[0]
                };

                // Try Google Maps API
                const distanceData = await calculateDistance(
                    `${volunteerCoords.lat},${volunteerCoords.lng}`,
                    `${opportunityCoords.lat},${opportunityCoords.lng}`
                );

                distance = distanceData.distance;
                duration = distanceData.duration;
            } catch (error) {
                // Fallback to straight-line distance
                const volunteerCoords = {
                    lat: volunteerProfile.location.coordinates.coordinates[1],
                    lng: volunteerProfile.location.coordinates.coordinates[0]
                };

                const opportunityCoords = {
                    lat: opportunity.location.coordinates.coordinates[1],
                    lng: opportunity.location.coordinates.coordinates[0]
                };

                distance = calculateStraightLineDistance(volunteerCoords, opportunityCoords);
                duration = null;
            }

            // Convert distance to miles
            const distanceMiles = distance ? (distance / 1609.34).toFixed(1) : null;

            // Only include opportunities with at least some skill match
            if (skillMatchScore > 0) {
                matches.push({
                    opportunity: opportunity.toObject(),
                    matchScore: {
                        skills: skillMatchScore.toFixed(1),
                        distance: distanceMiles,
                        duration: duration,
                        overall: (skillMatchScore * 0.7 + (distanceMiles ? (100 - Math.min(distanceMiles, 100)) * 0.3 : 0)).toFixed(1)
                    }
                });
            }
        }

        // Sort by overall match score (descending)
        matches.sort((a, b) => b.matchScore.overall - a.matchScore.overall);

        res.status(200).json({
            success: true,
            count: matches.length,
            data: matches
        });
    } catch (error) {
        console.error('Matching algorithm error:', error);
        next(new InternalServerError('Error finding matched opportunities'));
    }
};