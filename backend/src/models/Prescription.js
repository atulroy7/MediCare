import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
    rxId: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userEmail: { type: String, required: true, lowercase: true, trim: true },
    patientName: { type: String, required: true, trim: true },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    notes: { type: String, default: '' },
    filename: { type: String, default: '' },
    photoUrl: { type: String, default: '' }, // DataURL or Cloudinary URL
    status: { 
        type: String, 
        enum: ['PENDING_VERIFICATION', 'APPROVED', 'REJECTED', 'FULFILLED'], 
        default: 'PENDING_VERIFICATION' 
    },
    doctor: { type: String, default: 'Dr. Verified Practitioner' },
    medicinesSummary: { type: String, default: 'General Prescription Upload' },
    agentNotes: { type: String, default: '' },
    requiresVerification: { type: Boolean, default: false },
    rxMedicines: [{ type: String }]
}, { timestamps: true });

export default mongoose.model('Prescription', prescriptionSchema);
