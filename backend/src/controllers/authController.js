import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { asyncHandler, Errors } from '../utils/errors.js';

// Predefined In-Memory Users for instant testing & fallback when MongoDB is not connected
const IN_MEMORY_USERS = [
    {
        _id: 'demo_customer_id',
        name: 'Rahul Sharma',
        email: 'customer@demo.com',
        password: 'password123',
        role: 'customer',
        phone: '+91 9876543210',
        address: '123 Health Park, New Delhi, India'
    },
    {
        _id: 'demo_agent_id',
        name: 'Dr. Ananya Verma',
        email: 'agent@demo.com',
        password: 'password123',
        role: 'agent',
        phone: '+91 9123456789',
        address: 'Jaya Medical Store, Store #42, Mumbai',
        agentCode: 'AG-8849',
        licenseNumber: 'MH-PHARM-2024-9918'
    }
];

const isDbConnected = () => mongoose.connection.readyState === 1;

/**
 * Admin login
 * POST /api/auth/admin/login
 */
export const adminLogin = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const jwtSecret = process.env.JWT_SECRET || 'jaya_medical_store_super_secret_jwt_key_2026';

    if (username !== adminUsername || password !== adminPassword) {
        throw Errors.unauthorized('Invalid admin credentials');
    }

    const token = jwt.sign(
        { username, role: 'admin' },
        jwtSecret,
        { expiresIn: '24h' }
    );

    res.json({
        success: true,
        token,
        user: { username, role: 'admin' },
        expiresIn: '24h'
    });
});

/**
 * User Login (Customer or Agent)
 * POST /api/auth/login
 */
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password, role = 'customer' } = req.body;
    const jwtSecret = process.env.JWT_SECRET || 'jaya_medical_store_super_secret_jwt_key_2026';

    let user = null;
    const cleanEmail = email ? email.toLowerCase().trim() : '';

    // 1. Check MongoDB if connected
    if (isDbConnected()) {
        try {
            user = await User.findOne({ email: cleanEmail });
        } catch (err) {
            console.warn('MongoDB query warning in loginUser:', err.message);
        }
    }

    // 2. Fallback to In-Memory users if not found in DB
    if (!user) {
        user = IN_MEMORY_USERS.find(u => u.email.toLowerCase() === cleanEmail);
    }

    if (!user) {
        throw Errors.unauthorized('No account found with this email address.');
    }

    if (user.password !== password) {
        throw Errors.unauthorized('Invalid password entered.');
    }

    // 3. Upsert user into MongoDB on login so every user appears in MongoDB Compass
    if (isDbConnected()) {
        try {
            const dbUser = await User.findOneAndUpdate(
                { email: cleanEmail },
                {
                    $set: {
                        name: user.name,
                        email: cleanEmail,
                        password: user.password,
                        role: user.role || role,
                        phone: user.phone || '',
                        address: user.address || '',
                        agentCode: user.agentCode || '',
                        licenseNumber: user.licenseNumber || '',
                        lastLoginAt: new Date()
                    }
                },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
            user = dbUser;
        } catch (err) {
            console.warn('Could not sync user to MongoDB on login:', err.message);
        }
    }

    const payload = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || role
    };

    const token = jwt.sign(payload, jwtSecret, { expiresIn: '7d' });

    res.json({
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role || role,
            phone: user.phone || '',
            address: user.address || '',
            agentCode: user.agentCode || '',
            licenseNumber: user.licenseNumber || '',
            lastLoginAt: user.lastLoginAt || new Date()
        }
    });
});

/**
 * User Registration (Customer or Agent)
 * POST /api/auth/register
 */
export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role = 'customer', phone, address, agentCode, licenseNumber } = req.body;
    const jwtSecret = process.env.JWT_SECRET || 'jaya_medical_store_super_secret_jwt_key_2026';
    const cleanEmail = email ? email.toLowerCase().trim() : '';
    const cleanPhone = phone ? phone.replace(/\D/g, '').trim() : '';

    let existingEmailUser = null;
    let existingPhoneUser = null;

    if (process.env.MONGO_URI) {
        try {
            existingEmailUser = await User.findOne({ email: cleanEmail });
            if (cleanPhone) {
                existingPhoneUser = await User.findOne({ phone: cleanPhone });
            }
        } catch (err) {
            console.warn('MongoDB query warning in registerUser:', err.message);
        }
    }

    if (!existingEmailUser) {
        existingEmailUser = IN_MEMORY_USERS.find(u => u.email.toLowerCase() === cleanEmail);
    }
    if (!existingPhoneUser && cleanPhone) {
        existingPhoneUser = IN_MEMORY_USERS.find(u => u.phone && u.phone.replace(/\D/g, '') === cleanPhone);
    }

    if (existingEmailUser) {
        throw Errors.conflict('An account with this email address already exists.');
    }
    if (existingPhoneUser) {
        throw Errors.conflict('An account with this phone number already exists.');
    }

    let newUser = null;

    if (process.env.MONGO_URI) {
        try {
            newUser = await User.create({
                name,
                email: cleanEmail,
                password,
                role,
                phone: cleanPhone || phone || '',
                address: address || '',
                agentCode: agentCode || (role === 'agent' ? `AG-${Math.floor(1000 + Math.random() * 9000)}` : ''),
                licenseNumber: licenseNumber || '',
                lastLoginAt: new Date()
            });
        } catch (err) {
            console.error('User.create failed in MongoDB:', err.message);
            if (err.code === 11000) {
                const dupKey = Object.keys(err.keyPattern || {})[0];
                if (dupKey === 'phone') {
                    throw Errors.conflict('An account with this phone number already exists.');
                }
                throw Errors.conflict('An account with these credentials already exists.');
            }
            throw Errors.internal(`Failed to save new user to MongoDB: ${err.message}`);
        }
    }

    if (!newUser) {
        newUser = {
            _id: 'usr_' + Date.now(),
            name,
            email: cleanEmail,
            password,
            role,
            phone: phone || '',
            address: address || '',
            agentCode: agentCode || (role === 'agent' ? `AG-${Math.floor(1000 + Math.random() * 9000)}` : ''),
            licenseNumber: licenseNumber || ''
        };
        IN_MEMORY_USERS.push(newUser);
    }

    const payload = {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
    };

    const token = jwt.sign(payload, jwtSecret, { expiresIn: '7d' });

    res.status(201).json({
        success: true,
        token,
        user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            phone: newUser.phone,
            address: newUser.address,
            agentCode: newUser.agentCode,
            licenseNumber: newUser.licenseNumber
        }
    });
});

/**
 * Get Current Logged In User Profile
 * GET /api/auth/me
 */
export const getCurrentUser = asyncHandler(async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw Errors.unauthorized('No authorization token provided');
    }

    const token = authHeader.split(' ')[1];
    const jwtSecret = process.env.JWT_SECRET || 'jaya_medical_store_super_secret_jwt_key_2026';

    try {
        const decoded = jwt.verify(token, jwtSecret);
        res.json({
            success: true,
            user: decoded
        });
    } catch (err) {
        throw Errors.unauthorized('Invalid or expired authentication token');
    }
});
