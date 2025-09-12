import express from 'express';
import { validateSignup, validateLogin } from '../middleware/validation/authValidation.js';
import { signup, login, verifyToken, logout } from '../controllers/auth.controller.js';
import protect from '../middleware/auth.js'; 


const router = express.Router();
console.log("route file")
// Signup route
router.post('/signup', validateSignup, signup);

console.log("route file")
// Login route
router.post('/login', validateLogin, login);


// Add verify route
router.get('/verify', protect, verifyToken);
// logout route
router.post('/logout', logout);
export default router;