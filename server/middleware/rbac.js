// server/middleware/rbac.js
import { ForbiddenError } from '../utils/AppError.js';

// Restrict to specific roles
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ForbiddenError('You do not have permission to perform this action'));
        }
        next();
    };
};

export default restrictTo;