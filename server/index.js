import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';

dotenv.config();

// Import Route Files (We will create these later)
// import authRoutes from './routes/auth.js';

// Initialize Express application
const app = express();

// Connect to the database
connectDB();

// Middlewares
// CORS middleware to allow requests from our frontend (we'll adjust this later for production)
app.use(cors());
// Body parser middleware to read JSON payloads from requests
app.use(express.json({ limit: '10mb' })); // 'limit' option handles large payloads

// Basic route for health check - Always good practice for monitoring
app.get('/api/health', (req, res) => {
    res.status(200).json({ success: true, message: 'Server is up and running!' });
});

// API Routes - *We will mount these in the next steps*
// app.use('/api/auth', authRoutes);

// Catch-all handler for undefined routes (404)
app.use('/', (req, res) => {
    res.status(404).json({ success: false, message: 'API endpoint does not exist' });
});

// Global Error Handling Middleware
// This is a basic catcher. We will enhance it later.
app.use((error, req, res, next) => {
    console.error('Unhandled Error:', error);
    res.status(500).json({ success: false, message: 'An unexpected internal server error occurred' });
});

// Define the port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`));