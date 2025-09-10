import {
    AppError,
    ValidationError,
    BadRequestError,
    UnauthorizedError
} from '../utils/AppError.js';

// Handle specific Mongoose validation errors
const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new ValidationError(message, errors);
};

const handleDuplicateFieldsDB = (err) => {
    const value = err.keyValue ? JSON.stringify(err.keyValue) : '';
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new BadRequestError(message);
};

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new BadRequestError(message);
};

const handleJWTError = () => new UnauthorizedError('Invalid token. Please log in again!');
const handleJWTExpiredError = () => new UnauthorizedError('Your token has expired! Please log in again.');

// Detailed error in development
const sendErrorDev = (err, res) => {
    res.status(err.statusCode || 500).json({
        success: false,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

// Simplified error in production
const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            ...(err.errors && { errors: err.errors }) // add validation details
        });
    } else {
        console.error('ERROR 💥', err);
        res.status(500).json({
            success: false,
            message: 'Something went very wrong!'
        });
    }
};

// Global error middleware
const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else {
        let error = err; // don’t spread — keep prototype

        if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (error.name === 'JsonWebTokenError') error = handleJWTError();
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

        sendErrorProd(error, res);
    }
};

export default errorHandler;
