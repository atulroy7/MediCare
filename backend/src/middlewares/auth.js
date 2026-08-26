import admin from '../config/firebase.js';
import jwt from 'jsonwebtoken';

// Middleware to verify Firebase ID token
export const verifyUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split('Bearer ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }

        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken; // contains uid, email, etc.
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized: Invalid user token' });
    }
};

// Middleware to verify Admin JWT
export const verifyAdmin = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split('Bearer ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        if (decoded.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden: Requires admin privileges' });
        }
        
        req.admin = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized: Invalid admin token' });
    }
};
