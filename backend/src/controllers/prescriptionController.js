import mongoose from 'mongoose';
import Prescription from '../models/Prescription.js';
import User from '../models/User.js';
import { asyncHandler, Errors } from '../utils/errors.js';

// Predefined in-memory queue for offline backup
const IN_MEMORY_QUEUE = [
    { 
        _id: 'rx_demo_1',
        rxId: 'RX-9082', 
        patientName: 'Rahul Sharma', 
        doctor: 'Dr. S. Mehta (MD Internal Med)', 
        createdAt: new Date('2026-08-04'), 
        status: 'PENDING_VERIFICATION', 
        filename: 'prescription_rahul.pdf', 
        userEmail: 'customer@demo.com',
        phone: '9876543210',
        notes: 'Rx for Paracetamol 650mg & Amoxicillin 500mg (10 days duration)',
        medicinesSummary: 'Paracetamol 650mg (x2), Amoxicillin 500mg (x1)'
    },
    { 
        _id: 'rx_demo_2',
        rxId: 'RX-9083', 
        patientName: 'Priya Verma', 
        doctor: 'Dr. K. N. Rao (Cardiologist)', 
        createdAt: new Date('2026-08-05'), 
        status: 'APPROVED', 
        filename: 'prescription_priya.jpg', 
        userEmail: 'priya@demo.com',
        phone: '9123456789',
        notes: 'Rx for Atorvastatin 10mg daily after dinner',
        medicinesSummary: 'Atorvastatin 10mg (x1)'
    }
];

/**
 * Submit / Upload Prescription
 * POST /api/prescriptions
 */
export const createPrescription = asyncHandler(async (req, res) => {
    const { 
        patient_name, 
        phone, 
        address, 
        notes, 
        filename, 
        photoUrl, 
        userEmail, 
        userId, 
        medicinesSummary,
        rxId: incomingRxId,
        id: incomingId
    } = req.body;

    const email = (userEmail || req.user?.email || '').toLowerCase().trim();
    if (!email) {
        throw Errors.badRequest('User email is required to submit a prescription.');
    }

    const rxId = incomingRxId || incomingId || ('RX-' + Math.floor(1000 + Math.random() * 9000));
    let rxDoc = null;

    if (process.env.MONGO_URI) {
        try {
            const validUserId = userId && mongoose.Types.ObjectId.isValid(userId) ? userId : undefined;
            rxDoc = await Prescription.create({
                rxId,
                user: validUserId,
                userEmail: email,
                patientName: patient_name || req.user?.name || 'Patient',
                phone: phone || '',
                address: address || '',
                notes: notes || '',
                filename: filename || 'prescription.jpg',
                photoUrl: photoUrl || '',
                doctor: notes ? `Note: ${notes.substring(0, 30)}...` : 'Dr. Verified Practitioner',
                medicinesSummary: medicinesSummary || 'General Prescription Upload',
                status: 'PENDING_VERIFICATION'
            });
        } catch (err) {
            console.error('Prescription.create failed in MongoDB:', err.message);
        }
    }

    if (!rxDoc) {
        rxDoc = {
            _id: 'rx_' + Date.now(),
            rxId,
            userEmail: email,
            patientName: patient_name || 'Patient',
            phone: phone || '',
            address: address || '',
            notes: notes || '',
            filename: filename || 'prescription.jpg',
            photoUrl: photoUrl || '',
            doctor: notes ? `Note: ${notes.substring(0, 30)}...` : 'Dr. Verified Practitioner',
            medicinesSummary: medicinesSummary || 'General Prescription Upload',
            status: 'PENDING_VERIFICATION',
            createdAt: new Date()
        };
        IN_MEMORY_QUEUE.unshift(rxDoc);
    }

    res.status(201).json({
        success: true,
        message: 'Prescription submitted successfully',
        prescription: rxDoc
    });
});

/**
 * Get User Prescriptions
 * GET /api/prescriptions/my-prescriptions
 */
export const getUserPrescriptions = asyncHandler(async (req, res) => {
    const email = (req.query.email || req.user?.email || '').toLowerCase().trim();
    let prescriptions = [];

    if (process.env.MONGO_URI && email) {
        try {
            prescriptions = await Prescription.find({ userEmail: email }).sort({ createdAt: -1 });
        } catch (err) {
            console.warn('MongoDB query failed for user prescriptions:', err.message);
        }
    }

    if (prescriptions.length === 0 && email) {
        prescriptions = IN_MEMORY_QUEUE.filter(p => p.userEmail.toLowerCase() === email);
    }

    res.json({
        success: true,
        prescriptions
    });
});

/**
 * Get All Prescriptions for Agent Queue
 * GET /api/prescriptions/all
 */
export const getAllPrescriptions = asyncHandler(async (req, res) => {
    const map = new Map();

    // 1. Add in-memory items first
    IN_MEMORY_QUEUE.forEach(p => {
        const key = p.rxId || p._id;
        if (key) map.set(key, p);
    });

    // 2. Fetch and merge from MongoDB
    if (process.env.MONGO_URI) {
        try {
            const dbPrescriptions = await Prescription.find({}).sort({ createdAt: -1 });
            dbPrescriptions.forEach(p => {
                const key = p.rxId || p._id.toString();
                if (key) map.set(key, p);
            });
        } catch (err) {
            console.warn('MongoDB query failed for all prescriptions:', err.message);
        }
    }

    const prescriptions = Array.from(map.values()).sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB - dateA;
    });

    res.json({
        success: true,
        prescriptions
    });
});

/**
 * Update Prescription Status (Approve/Reject)
 * PATCH /api/prescriptions/:id/status
 */
export const updatePrescriptionStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, agentNotes } = req.body;

    if (!['APPROVED', 'REJECTED', 'PENDING_VERIFICATION', 'FULFILLED'].includes(status)) {
        throw Errors.badRequest('Invalid prescription status.');
    }

    let updated = null;

    if (process.env.MONGO_URI) {
        try {
            const filter = mongoose.Types.ObjectId.isValid(id)
                ? { $or: [{ _id: id }, { rxId: id }] }
                : { rxId: id };

            updated = await Prescription.findOneAndUpdate(
                filter,
                { $set: { status, agentNotes: agentNotes || '' } },
                { new: true }
            );
        } catch (err) {
            console.warn('MongoDB update failed for prescription status:', err.message);
        }
    }

    if (!updated) {
        const item = IN_MEMORY_QUEUE.find(p => p._id === id || p.rxId === id);
        if (item) {
            item.status = status;
            item.agentNotes = agentNotes || '';
            updated = item;
        }
    }

    if (!updated) {
        throw Errors.notFound('Prescription not found.');
    }

    res.json({
        success: true,
        message: `Prescription status updated to ${status}`,
        prescription: updated
    });
});
