
import express from 'express';
import { validateSignup, validateLogin } from '../middleware/validation/authValidation.js';
import { signup, login } from '../controllers/auth.controller.js';

const router = express.Router();
console.log("route file")
// Signup route
router.post('/signup', validateSignup, signup);

console.log("route file")
// Login route
router.post('/login', validateLogin, login);

export default router;