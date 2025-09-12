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


const app = express();

connectDB();

app.use(cors({
    origin: [
        'https://volunteer-connect-platform.vercel.app',
        'http://localhost:4173' // for local development
    ],
    credentials: true
}));


app.use(cookieParser());


app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});
app.use(express.json({ limit: '10mb' }));

app.get('/api/test', (req, res) => {
    console.log('Test route hit');
    res.json({ message: 'Test successful', timestamp: new Date().toISOString() });
});



// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/applications', applicationRoutes);



app.get('/api/test', (req, res) => {
    res.json({ message: 'Test successful', timestamp: new Date().toISOString() });
});

// Catch-all handler for undefined routes
app.use('/', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

// Use the global error handling middleware (must be the last middleware)
app.use(errorHandler);


const PORT = process.env.PORT || 5001

// Start the server
app.listen(PORT,
    () => console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`));