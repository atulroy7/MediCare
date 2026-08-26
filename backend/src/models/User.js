import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'agent'], default: 'customer' },
    phone: { type: String, trim: true, default: '', unique: true, sparse: true },
    address: { type: String, trim: true, default: '' },
    agentCode: { type: String, trim: true, default: '' }, // For medical agents/pharmacists
    licenseNumber: { type: String, trim: true, default: '' }, // Medical Agent verification license
    lastLoginAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
