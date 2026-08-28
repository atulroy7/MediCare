import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getApiBaseUrl } from '../services/api';
import Icon from './Icons';

const initialForm = {
    patient_name: '',
    phone: '',
    address: '',
    notes: '',
};

const emailConfigured =
    import.meta.env.VITE_EMAILJS_SERVICE_ID &&
    import.meta.env.VITE_EMAILJS_PRESCRIPTION_TEMPLATE &&
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export default function PrescriptionUpload() {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState(() => ({
        ...initialForm,
        patient_name: user?.name || '',
        phone: user?.phone || '',
        address: user?.address || ''
    }));
    const [file, setFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [sending, setSending] = useState(false);

    const onChange = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    };

    const setPrescriptionFile = (event) => {
        const selected = event.target.files?.[0];
        if (selected) {
            setFile(selected);
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setDragActive(false);
        const droppedFile = event.dataTransfer.files?.[0];
        if (droppedFile) {
            setFile(droppedFile);
        }
    };

    const removeFile = () => setFile(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!isAuthenticated || !user) {
            toast.error('You must be logged in to submit a prescription.');
            navigate('/login', { state: { from: '/prescription' } });
            return;
        }

        if (!file) {
            toast.error('Please attach a prescription file (JPG, PNG, or PDF).');
            return;
        }

        // CRITICAL: define cleanEmail once here — used throughout handleSubmit
        const cleanEmail = (user.email || '').toLowerCase();

        setSending(true);
        try {
            // Read ALL file types as DataURL (images AND PDFs) so the agent can view them
            const photoUrlData = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.onerror = () => resolve(null);
                reader.readAsDataURL(file);
            });

            if (emailConfigured) {
                await emailjs.send(
                    import.meta.env.VITE_EMAILJS_SERVICE_ID,
                    import.meta.env.VITE_EMAILJS_PRESCRIPTION_TEMPLATE,
                    {
                        ...form,
                        user_email: user.email,
                        file_name: file.name,
                    },
                    { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY },
                );
            }

            // Get current cart items & compute unique cart signature
            const userCartKey = `jaya-medical-cart-${user.id || user.email}`;
            const cartItemsRaw = JSON.parse(localStorage.getItem(userCartKey) || '[]');
            const cartSignature = cartItemsRaw.length > 0 
                ? cartItemsRaw.map(i => `${i.id}:${i.quantity}`).sort().join('|')
                : 'general_prescription';
            const medicinesSummary = cartItemsRaw.length > 0
                ? cartItemsRaw.map(i => `${i.name} (x${i.quantity})`).join(', ')
                : 'General Prescription Upload';

            // Save to LocalStorage for User Account & Pharmacist Verification Queue
            const rxItem = {
                id: 'RX-' + Math.floor(1000 + Math.random() * 9000),
                patient: form.patient_name || user.name,
                doctor: form.notes ? `Note: ${form.notes.substring(0, 30)}...` : 'Dr. Verified Practitioner',
                phone: form.phone || user.phone,
                address: form.address || user.address,
                notes: form.notes || '',
                date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
                createdAt: new Date().toISOString(),
                timestamp: Date.now(),
                status: 'PENDING_VERIFICATION',
                filename: file.name,
                photoUrl: photoUrlData,
                userEmail: user.email.toLowerCase(),
                userId: user.id || '',
                cartSignature,
                medicinesSummary
            };

            // Send to Backend API to persist in MongoDB Atlas
            try {
                const backendUrl = getApiBaseUrl();
                await fetch(`${backendUrl}/prescriptions`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        rxId: rxItem.id,
                        id: rxItem.id,
                        patient_name: form.patient_name || user.name,
                        phone: form.phone || user.phone,
                        address: form.address || user.address,
                        notes: form.notes || '',
                        filename: file.name,
                        photoUrl: photoUrlData,
                        userEmail: user.email.toLowerCase(),
                        userId: user.id || user._id,
                        medicinesSummary
                    })
                });
            } catch (apiErr) {
                console.warn('Backend API prescription upload warning:', apiErr.message);
            }

            // Save FULL version (with DataURL) to sessionStorage for same-session display
            const rxItemFull = { ...rxItem };
            // Save COMPACT version (no large DataURL) to localStorage as fallback
            const rxItemCompact = { ...rxItem, photoUrl: null };

            // --- PRIMARY: Save to localStorage with correct email key ---
            const emailKey = `jaya_prescriptions_${cleanEmail}`;
            try {
                const existingEmailRx = JSON.parse(localStorage.getItem(emailKey) || '[]');
                const updatedEmailRx = [rxItemFull, ...existingEmailRx.filter(r => r.id !== rxItem.id)];
                localStorage.setItem(emailKey, JSON.stringify(updatedEmailRx));
            } catch (e1) {
                // Full DataURL too large — store compact version
                console.warn('Quota hit saving full image for email key; saving compact:', e1.message);
                try {
                    const existingEmailRx = JSON.parse(localStorage.getItem(emailKey) || '[]');
                    localStorage.setItem(emailKey, JSON.stringify([rxItemCompact, ...existingEmailRx.filter(r => r.id !== rxItem.id)]));
                } catch (_) {}
            }

            // --- SECONDARY: Update the global all-prescriptions list ---
            try {
                const globalRx = JSON.parse(localStorage.getItem('jaya_all_prescriptions') || '[]');
                localStorage.setItem('jaya_all_prescriptions', JSON.stringify([rxItemFull, ...globalRx.filter(r => r.id !== rxItem.id)]));
            } catch (e2) {
                console.warn('Quota hit saving full image to global list; saving compact:', e2.message);
                try {
                    const globalRx = JSON.parse(localStorage.getItem('jaya_all_prescriptions') || '[]');
                    localStorage.setItem('jaya_all_prescriptions', JSON.stringify([rxItemCompact, ...globalRx.filter(r => r.id !== rxItem.id)]));
                } catch (_) {}
            }

            // Also keep full version in sessionStorage so agent/customer can view image this session
            try {
                const sessionRx = JSON.parse(sessionStorage.getItem('jaya_session_prescriptions') || '[]');
                sessionStorage.setItem('jaya_session_prescriptions', JSON.stringify([rxItemFull, ...sessionRx.filter(r => r.id !== rxItem.id)]));
            } catch (_) { /* sessionStorage full */ }

            // Trigger real-time sync event
            window.dispatchEvent(new Event('jaya_prescription_update'));
            window.dispatchEvent(new Event('storage'));

            toast.success('Prescription submitted successfully for Pharmacist review!');
            setForm({
                ...initialForm,
                patient_name: user?.name || '',
                phone: user?.phone || '',
                address: user?.address || ''
            });
            setFile(null);

            setTimeout(() => {
                navigate('/prescription');
            }, 1000);
        } catch (error) {
            console.error(error);
            toast.error('Prescription submission failed. Please try again.');
        } finally {
            setSending(false);
        }
    };

    const inputBaseClass =
        'w-full rounded-xl border border-border bg-bg px-4 py-3.5 text-sm text-text outline-none transition-colors duration-200 placeholder:text-text-muted/50 focus:border-primary focus:ring-1 focus:ring-primary/20';

    if (!isAuthenticated || !user) {
        return (
            <div className="glass-card p-8 sm:p-10 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 mb-4">
                    <Icon name="Lock" className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-2">
                    Account Login Required
                </h3>
                <p className="text-sm text-text-muted max-w-md mx-auto mb-6">
                    To upload and process doctor prescriptions securely, you must be logged into a registered Customer account.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/login', { state: { from: '/prescription' } })}
                        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-md hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                    >
                        <Icon name="User" className="w-4 h-4" />
                        Log In / Create Account
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="glass-card p-7 sm:p-9">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <span className="kicker">
                        <Icon name="ClipboardList" className="h-3.5 w-3.5" />
                        Prescription Portal
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                        Account: {user.email}
                    </span>
                </div>
                <h2 className="display-heading text-3xl sm:text-4xl !mb-3">
                    Share securely
                </h2>
                <p className="text-sm leading-relaxed text-text-muted">
                    Upload a JPG, PNG, or PDF and provide details so our licensed pharmacists can review and approve your order.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* File drop zone */}
                <div
                    onDragOver={(event) => {
                        event.preventDefault();
                        setDragActive(true);
                    }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={handleDrop}
                    className={`group relative rounded-2xl border-2 border-dashed p-8 transition-all duration-300 ${
                        dragActive
                            ? 'border-primary bg-primary/5'
                            : file
                              ? 'border-primary/30 bg-primary/5'
                              : 'border-border bg-bg-subtle hover:border-primary/30'
                    }`}
                >
                    {!file ? (
                        <label className="flex cursor-pointer flex-col items-center justify-center gap-4 text-center">
                            <span className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-105 border border-primary/20">
                                <Icon name="Upload" className="h-7 w-7" />
                            </span>
                            <div>
                                <span className="text-base font-medium text-text">
                                    Drop your prescription here
                                </span>
                                <span className="mt-1 block text-sm text-text-muted">
                                    or <span className="font-medium text-primary hover:underline underline-offset-2">browse files</span> to upload
                                </span>
                            </div>
                            <div className="flex gap-2">
                                {['JPG', 'PNG', 'PDF'].map((fmt) => (
                                    <span
                                        key={fmt}
                                        className="rounded-lg border border-border bg-bg px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest text-text-muted shadow-sm"
                                    >
                                        {fmt}
                                    </span>
                                ))}
                            </div>
                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png,.pdf"
                                className="hidden"
                                onChange={setPrescriptionFile}
                            />
                        </label>
                    ) : (
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                                    <Icon name="FileText" className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-text line-clamp-1">{file.name}</p>
                                    <p className="text-xs text-text-muted mt-0.5">
                                        {(file.size / 1024).toFixed(1)} KB · Ready to upload
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={removeFile}
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-bg border border-border text-text-muted transition-colors duration-200 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-500"
                            >
                                <Icon name="X" className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Name & Phone */}
                <div className="grid gap-5 sm:grid-cols-2">
                    <label className="block space-y-2">
                        <span className="text-xs font-bold uppercase tracking-widest text-text-muted">Patient Name</span>
                        <input
                            name="patient_name"
                            value={form.patient_name}
                            onChange={onChange}
                            required
                            placeholder="Full name"
                            className={inputBaseClass}
                        />
                    </label>
                    <label className="block space-y-2">
                        <span className="text-xs font-bold uppercase tracking-widest text-text-muted">Phone Number</span>
                        <input
                            name="phone"
                            value={form.phone}
                            onChange={onChange}
                            required
                            type="tel"
                            placeholder="+91 XXXXX XXXXX"
                            className={inputBaseClass}
                        />
                    </label>
                </div>

                {/* Address */}
                <label className="block space-y-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-text-muted">Delivery Address</span>
                    <textarea
                        name="address"
                        value={form.address}
                        onChange={onChange}
                        rows="3"
                        required
                        placeholder="House no., street, locality, city, pincode"
                        className={inputBaseClass + ' resize-none'}
                    />
                </label>

                {/* Notes */}
                <label className="block space-y-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-text-muted flex items-center gap-2">
                        Notes / Dosage Instructions
                        <span className="text-[10px] text-text-muted/60">(optional)</span>
                    </span>
                    <textarea
                        name="notes"
                        value={form.notes}
                        onChange={onChange}
                        rows="3"
                        placeholder="Mention dosage timing, brand preference, or any delivery note."
                        className={inputBaseClass + ' resize-none'}
                    />
                </label>

                {/* Submit button */}
                <button
                    type="submit"
                    disabled={sending}
                    className="glass-button-primary w-full sm:w-auto px-10 py-4 justify-center mt-2"
                >
                    {sending ? (
                        <>
                            <Icon name="RefreshCw" className="h-4 w-4 animate-spin mr-2" />
                            Submitting...
                        </>
                    ) : (
                        <>
                            Submit Prescription
                            <Icon name="ArrowRight" className="ml-2 h-4 w-4" />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}