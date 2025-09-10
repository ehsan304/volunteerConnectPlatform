
import User from '../models/User.model.js';
import Profile from '../models/Profile.model.js';
import generateToken from '../utils/generateToken.js';
import { BadRequestError, InternalServerError } from '../utils/AppError.js';
console.log("outside controller")
// Signup controller
export const signup = async (req, res, next) => {
    console.log("inside controller")
    console.log("request reaches here")
    try {
        const { email, password, role } = req.body;

        // Create user
        const user = await User.create({
            email,
            password,
            role
        });

        // If volunteer, create an empty profile
        if (role === 'volunteer') {
            await Profile.create({
                user: user._id,
                fullName: '', // Will be updated later
                location: {
                    city: '',
                    zipCode: ''
                },
                skills: [],
                availability: {
                    days: [],
                    times: {
                        start: '',
                        end: ''
                    }
                }
            });
        }

        // Generate token
        const token = generateToken(user._id);

        // Remove password from response
        const userResponse = { ...user.toObject() };
        delete userResponse.password;

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                user: userResponse,
                token
            }
        });
    } catch (error) {
        if (error.code === 11000) {
            return next(new BadRequestError('Email already exists'));
        }
        next(new InternalServerError('Error creating user'));
    }
};

// Login controller
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find user and include password for comparison
        const user = await User.findByEmail(email);

        if (!user || !(await user.correctPassword(password, user.password))) {
            return next(new BadRequestError('Invalid email or password'));
        }

        // Generate token
        const token = generateToken(user._id);

        // Remove password from response
        const userResponse = { ...user.toObject() };
        delete userResponse.password;

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: userResponse,
                token
            }
        });
    } catch (error) {
        next(new InternalServerError('Error during login'));
    }
};