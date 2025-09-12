import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import { UnauthorizedError } from '../utils/AppError.js';

// Protect routes - verify JWT
const protect = async (req, res, next) => {
    try {
        let token = req.cookies?.token;  // ✅ read from cookie


        // Check if token exists in headers
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return next(new UnauthorizedError('Not authorized to access this route'));
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from token
        const user = await User.findById(decoded.userId);

        if (!user) {
            return next(new UnauthorizedError('Not authorized, user not found'));
        }

        // Add user to request object
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return next(new UnauthorizedError('Not authorized, invalid token'));
        }

        if (error.name === 'TokenExpiredError') {
            return next(new UnauthorizedError('Not authorized, token expired'));
        }

        next(error);
    }
};

export default protect;