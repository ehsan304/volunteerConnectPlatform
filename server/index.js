// server/index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'; 
import connectDB from './config/database.js';
import authRoutes from './routes/auth.route.js';
import errorHandler from './middleware/errorHandler.js';
import profileRoutes from './routes/profile.route.js';
import opportunityRoutes from './routes/opportunity.route.js';
import matchRoutes from './routes/match.route.js';
import applicationRoutes from './routes/application.route.js';


// Load environment variables
dotenv.config();

// Initialize Express application
const app = express();

connectDB();

// ✅ Allow cookies to be sent from frontend (adjust origin if needed)
app.use(cors({
    origin: 'http://localhost:5173', // your React app
    credentials: true
}));


app.use(cookieParser());  // ✅ parse cookies


// Middlewares
// app.use(cors());
// Add this right after your CORS middleware in server/index.js
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});
app.use(express.json({ limit: '10mb' }));
// Add this before your other routes in server/index.js
// Add this before your other routes in server/index.js
app.get('/api/test', (req, res) => {
    console.log('Test route hit');
    res.json({ message: 'Test successful', timestamp: new Date().toISOString() });
});
// Health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({ success: true, message: 'Server is up and running!' });
});


// API Routes
console.log("first")
app.use('/api/auth', authRoutes);
console.log("second1")
app.use('/api/profile', profileRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/applications', applicationRoutes);


// Catch-all handler for undefined routes
app.use('/', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

// Use the global error handling middleware (must be the last middleware)
app.use(errorHandler);

// Define the port
const PORT = process.env.PORT
// || 5000;

// Start the server
app.listen(PORT,
    () => console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`));