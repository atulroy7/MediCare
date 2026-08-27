import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB } from './src/config/db.js';
import { initFirebase } from './src/config/firebase.js';
import { connectCloudinary } from './src/config/cloudinary.js';
import { connectRedis } from './src/config/redis.js';
import { globalLimiter } from './src/middlewares/rateLimiter.js';
import { AppError, buildErrorResponse } from './src/utils/errors.js';

// Routes
import authRoutes from './src/routes/authRoutes.js';
import categoryRoutes from './src/routes/categoryRoutes.js';
import productRoutes from './src/routes/productRoutes.js';
import orderRoutes from './src/routes/orderRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import prescriptionRoutes from './src/routes/prescriptionRoutes.js';

// ─── Environment Validation ───────────────────────────────────────────────────
const validateEnv = () => {
    const optionalEnvVars = [
        'JWT_SECRET',
        'ADMIN_USERNAME',
        'ADMIN_PASSWORD',
        'UPSTASH_REDIS_REST_URL',
        'RAZORPAY_KEY_ID',
        'RAZORPAY_KEY_SECRET',
        'CLOUDINARY_CLOUD_NAME'
    ];

    optionalEnvVars.forEach((key) => {
        if (!process.env[key]) {
            console.warn(`⚠️  Warning: ${key} is not set. Some features may be disabled.`);
        }
    });
};

validateEnv();

// ─── Initialization ───────────────────────────────────────────────────────────
const app = express();

// Database and External Services
connectDB();
initFirebase();
connectCloudinary();
connectRedis();

// ─── Middlewares ──────────────────────────────────────────────────────────────
const allowedOrigins = process.env.CLIENT_URL 
    ? process.env.CLIENT_URL.split(',').map(url => url.trim())
    : ['http://localhost:5173'];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));

app.use(helmet());

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// Body parsing
// Increased limit for base64 prescription images and PDF attachments
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));

// Rate Limiting
app.use('/api', globalLimiter);

// ─── Routes ───────────────────────────────────────────────────────────────────

// Health Check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/prescriptions', prescriptionRoutes);

// Base route
app.get('/', (req, res) => {
    res.send('MediCare API is running...');
});

// ─── Error Handling ───────────────────────────────────────────────────────────

// 404 Handler
app.use((req, res, next) => {
    next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

// Global Error Handler
app.use((err, req, res, next) => {
    // Mongoose Validation Error
    if (err.name === 'ValidationError') {
        const details = Object.values(err.errors).map(val => ({
            field: val.path,
            message: val.message
        }));
        err = new AppError('Validation failed', 400, details);
    }

    // Mongoose Cast Error (invalid ObjectId)
    if (err.name === 'CastError') {
        err = new AppError(`Invalid ${err.path}: ${err.value}`, 400);
    }

    // MongoDB Duplicate Key Error
    if (err.code === 11000) {
        err = new AppError('Duplicate field value entered', 409);
    }

    const statusCode = err.statusCode || 500;
    const isDev = process.env.NODE_ENV === 'development';

    if (statusCode === 500) {
        console.error('🔥 Server Error:', err);
    }

    res.status(statusCode).json(buildErrorResponse(err, isDev));
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('\n========================================');
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`📡 Listening on port ${PORT}`);
    console.log(`🌐 Allowed origins: ${allowedOrigins.join(', ')}`);
    console.log('========================================\n');
});

export default app;
