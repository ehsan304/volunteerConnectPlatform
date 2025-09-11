import { Client } from '@googlemaps/google-maps-services-js';
import { InternalServerError } from '../utils/AppError.js';

const client = new Client({});

// Calculate distance between two points using Google Maps Distance Matrix API
export const calculateDistance = async (origin, destination) => {
    try {
        const response = await client.distancematrix({
            params: {
                origins: [origin],
                destinations: [destination],
                key: process.env.GOOGLE_MAPS_API_KEY,
                mode: 'driving',
                units: 'imperial'
            },
            timeout: 1000
        });

        if (response.data.rows[0].elements[0].status === 'OK') {
            return {
                distance: response.data.rows[0].elements[0].distance.value, // in meters
                duration: response.data.rows[0].elements[0].duration.text
            };
        } else {
            throw new Error('Could not calculate distance');
        }
    } catch (error) {
        console.error('Google Maps API error:', error);
        throw new InternalServerError('Error calculating distance');
    }
};

// Calculate straight-line distance as fallback (Haversine formula)
export const calculateStraightLineDistance = (coord1, coord2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (coord1.lat * Math.PI) / 180;
    const φ2 = (coord2.lat * Math.PI) / 180;
    const Δφ = ((coord2.lat - coord1.lat) * Math.PI) / 180;
    const Δλ = ((coord2.lng - coord1.lng) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
};