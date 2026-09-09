import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Seo from '../components/Seo';
import PrescriptionUpload from '../components/PrescriptionUpload';
import PrescriptionDetailModal from '../components/dashboard/PrescriptionDetailModal';
import Icon from '../components/Icons';
import { useAuth } from '../context/AuthContext';

const steps = [
    {
        icon: 'Upload',
        title: 'Upload Prescription',
        description: 'Share a clear photo or PDF of your valid medical prescription through our secure portal.',
    },
    {
        icon: 'ShieldCheck',
        title: 'Pharmacist Verification',
        description: 'Our licensed pharmacist carefully reviews every detail for accuracy and compliance.',
    },
    {
        icon: 'Truck',
        title: 'Doorstep Delivery',
        description: 'Your verified medicines are meticulously packed and delivered right to your doorstep.',
    },
];

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.25 } },
};

const stepVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const statusConfig = {
    APPROVED: { label: 'Approved', cls: 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' },
    FULFILLED: { label: 'Fulfilled (Ordered)', cls: 'bg-blue-500/10 text-blue-600 border border-blue-500/20' },
    REJECTED: { label: 'Rejected', cls: 'bg-red-500/10 text-red-600 border border-red-500/20' },
    PENDING_VERIFICATION: { label: 'Pending Review', cls: 'bg-amber-500/10 text-amber-600 border border-amber-500/20' },
};

function getStatusConfig(status) {
    return statusConfig[status] || statusConfig['PENDING_VERIFICATION'];
}

export default function Prescription() {
    const { user, isAuthenticated } = useAuth();
    const [prescriptions, setPrescriptions] = useState([]);
    const [selectedRx, setSelectedRx] = useState(null);

    const loadPrescriptions = useCallback(() => {
        if (!user) { setPrescriptions([]); return; }

        const cleanEmail = user.email.toLowerCase();
        const rxMap = new Map();

        // Load from localStorage
        try {
            const globalRx = JSON.parse(localStorage.getItem('medicare_all_prescriptions') || localStorage.getItem('jaya_all_prescriptions') || '[]');
            const emailKeyRx = JSON.parse(localStorage.getItem(`medicare_prescriptions_${cleanEmail}`) || localStorage.getItem(`jaya_prescriptions_${cleanEmail}`) || '[]');
            const idKeyRx = user.id ? JSON.parse(localStorage.getItem(`medicare_prescriptions_${user.id}`) || localStorage.getItem(`jaya_prescriptions_${user.id}`) || '[]') : [];

            [...globalRx.filter(r => r.userEmail && r.userEmail.toLowerCase() === cleanEmail), ...emailKeyRx, ...idKeyRx]
                .forEach(r => { if (r && r.id) rxMap.set(r.id, r); });
        } catch (_) {}

        // Merge sessionStorage (has full DataURLs for current session)
        try {
            const sessionRx = JSON.parse(sessionStorage.getItem('medicare_session_prescriptions') || sessionStorage.getItem('jaya_session_prescriptions') || '[]');
            sessionRx.forEach(r => {
                if (r && r.id) {
                    const existing = rxMap.get(r.id);
                    rxMap.set(r.id, { ...existing, ...r });
                }
            });
        } catch (_) {}

        const sorted = Array.from(rxMap.values()).sort((a, b) => {
            const tA = a.timestamp || (a.createdAt ? new Date(a.createdAt).getTime() : 0);
            const tB = b.timestamp || (b.createdAt ? new Date(b.createdAt).getTime() : 0);
            if (tA && tB && tA !== tB) return tB - tA;
            return (b.id || '').localeCompare(a.id || '');
        });
        setPrescriptions(sorted);
    }, [user]);

    useEffect(() => {
        loadPrescriptions();
        const handleSync = () => loadPrescriptions();
        window.addEventListener('medicare_prescription_update', handleSync);
        window.addEventListener('jaya_prescription_update', handleSync);
        window.addEventListener('storage', handleSync);
        return () => {
            window.removeEventListener('medicare_prescription_update', handleSync);
            window.removeEventListener('jaya_prescription_update', handleSync);
            window.removeEventListener('storage', handleSync);
        };
    }, [loadPrescriptions]);

    return (
        <>
            <Seo
                title="Upload Prescription | MediCare"
                description="Upload a prescription for medicines that require pharmacist review before dispatch."
            />

            {/* Hero */}
            <section className="bg-lofi relative overflow-hidden">
                <div className="absolute inset-0 bg-bg/80 dark:bg-bg/90 backdrop-blur-[40px] z-0" />
                <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                        <span className="kicker justify-center">Secure Upload</span>
                        <h1 className="display-heading !mb-4">
                            Send us your <span className="text-primary font-bold">prescription</span>
                        </h1>
                        <p className="mx-auto max-w-xl text-lg text-text-muted">
                            Upload your valid medical prescription for swift processing by our clinical pharmacists. We ensure the highest standards of data privacy and medical accuracy.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Form section */}
            <section className="mx-auto max-w-7xl px-4 py-12 md:py-20">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-12"
                >
                    <PrescriptionUpload />

                    <div className="space-y-6 lg:sticky lg:top-28">
                        <div className="glass-card p-6 bg-primary/5">
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                                    <Icon name="ShieldCheck" className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="font-serif text-xl font-medium text-text">Pharmacist Reviewed</p>
                                    <p className="mt-2 text-sm text-text-muted leading-relaxed">
                                        Every prescription is personally verified by our licensed pharmacist before dispatch. If anything needs clarification, we'll contact you directly.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-6">
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary border border-secondary/20">
                                    <Icon name="FileText" className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="font-serif text-xl font-medium text-text">Accepted Files</p>
                                    <p className="mt-2 text-sm text-text-muted leading-relaxed">
                                        JPG, PNG, and PDF are supported. Keep the file readable and include a clear patient name on the prescription.
                                    </p>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {['JPG', 'PNG', 'PDF'].map((fmt) => (
                                            <span key={fmt} className="inline-flex items-center rounded-lg border border-border bg-bg-subtle px-3 py-1 text-xs font-bold tracking-widest text-text-muted">
                                                .{fmt}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-6">
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                                    <Icon name="MessageCircle" className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="font-serif text-xl font-medium text-text">Need Help?</p>
                                    <p className="mt-2 text-sm text-text-muted leading-relaxed">
                                        Use the contact page or WhatsApp if you need help before uploading your prescription.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 rounded-xl bg-bg-subtle border border-border p-4">
                            <Icon name="BadgeCheck" className="h-5 w-5 text-green-500" />
                            <p className="text-xs font-medium text-text-muted">
                                100% secure — your data is never shared with third parties.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* My Prescriptions Section */}
            {isAuthenticated && (
                <section className="mx-auto max-w-7xl px-4 pb-16 md:pb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6">
                                <div>
                                    <h2 className="text-xl font-bold font-serif text-text flex items-center gap-2">
                                        <Icon name="ClipboardList" className="w-6 h-6 text-primary" />
                                        My Uploaded Prescriptions
                                    </h2>
                                    <p className="text-xs text-text-muted mt-1">
                                        Track verification status and pharmacist feedback on all your uploaded prescriptions.
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold text-text-muted bg-bg-subtle border border-border rounded-xl px-3 py-2">
                                    <Icon name="FileText" className="w-4 h-4 text-primary" />
                                    {prescriptions.length} prescription{prescriptions.length !== 1 ? 's' : ''}
                                </div>
                            </div>

                            {prescriptions.length === 0 ? (
                                <div className="text-center py-12 border-2 border-dashed border-border rounded-2xl space-y-3">
                                    <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                                        <Icon name="Upload" className="w-8 h-8" />
                                    </div>
                                    <h4 className="text-sm font-bold text-text">No prescriptions uploaded yet</h4>
                                    <p className="text-xs text-text-muted max-w-sm mx-auto">
                                        Fill in the form above and upload your first prescription to get started.
                                    </p>
                                </div>
                            ) : (
                                <AnimatePresence>
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                        {prescriptions.map((rx, i) => {
                                            const sc = getStatusConfig(rx.status);
                                            const hasImage = rx.photoUrl && rx.photoUrl.startsWith('data:image/');
                                            const isPdf = rx.photoUrl && rx.photoUrl.startsWith('data:application/pdf');

                                            return (
                                                <motion.div
                                                    key={rx.id}
                                                    initial={{ opacity: 0, y: 16 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: i * 0.06 }}
                                                    className="bg-surface-hover border border-border rounded-2xl overflow-hidden shadow-sm hover:border-primary/40 transition-all group"
                                                >
                                                    {/* Thumbnail */}
                                                    <div className="relative h-36 bg-bg flex items-center justify-center overflow-hidden border-b border-border">
                                                        {hasImage ? (
                                                            <img
                                                                src={rx.photoUrl}
                                                                alt={rx.filename}
                                                                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                            />
                                                        ) : isPdf ? (
                                                            <div className="flex flex-col items-center gap-2 text-primary/60">
                                                                <Icon name="FileText" className="w-10 h-10" />
                                                                <span className="text-[10px] font-bold uppercase tracking-wider">PDF Document</span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-col items-center gap-2 text-text-muted/50">
                                                                <Icon name="File" className="w-10 h-10" />
                                                                <span className="text-[10px] font-bold uppercase tracking-wider">Document</span>
                                                            </div>
                                                        )}
                                                        <div className="absolute top-2 right-2">
                                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${sc.cls}`}>
                                                                {sc.label}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="p-4 space-y-3">
                                                        <div>
                                                            <p className="font-mono text-[10px] font-bold text-primary">{rx.id}</p>
                                                            <h4 className="font-semibold text-text text-sm truncate mt-0.5">{rx.filename || 'Prescription Document'}</h4>
                                                            <p className="text-[11px] text-text-muted mt-0.5">Uploaded: {rx.date || 'Recent'}</p>
                                                        </div>

                                                        {rx.medicinesSummary && rx.medicinesSummary !== 'General Prescription Upload' && (
                                                            <div className="bg-bg rounded-xl border border-border p-2.5">
                                                                <p className="text-[10px] font-bold text-text-muted uppercase mb-1">Cart Medicines</p>
                                                                <p className="text-[11px] text-primary font-semibold truncate">{rx.medicinesSummary}</p>
                                                            </div>
                                                        )}

                                                        {rx.agentSuggestion && (
                                                            <div className="bg-secondary/5 border border-secondary/20 rounded-xl p-2.5 space-y-1">
                                                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-secondary">
                                                                    <Icon name="Stethoscope" className="w-3.5 h-3.5" />
                                                                    Pharmacist Advice
                                                                </div>
                                                                <p className="text-[11px] text-text font-bold leading-relaxed">{rx.agentSuggestion}</p>
                                                            </div>
                                                        )}

                                                        {rx.status === 'PENDING_VERIFICATION' && (
                                                            <div className="flex items-center gap-1.5 text-[10px] text-amber-600 dark:text-amber-400">
                                                                <Icon name="Clock" className="w-3.5 h-3.5" />
                                                                Awaiting pharmacist review
                                                            </div>
                                                        )}

                                                        <button
                                                            type="button"
                                                            onClick={() => setSelectedRx(rx)}
                                                            className="w-full py-2 rounded-xl bg-primary/10 text-primary font-bold text-xs hover:bg-primary/20 transition-all flex items-center justify-center gap-1.5 border border-primary/20"
                                                        >
                                                            <Icon name="Eye" className="w-3.5 h-3.5" />
                                                            View Full Details
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </AnimatePresence>
                            )}
                        </div>
                    </motion.div>
                </section>
            )}

            {/* Detail Modal (read-only for customer) */}
            <PrescriptionDetailModal
                selectedRx={selectedRx}
                onClose={() => setSelectedRx(null)}
                onApprove={() => {}}
                onReject={() => {}}
                onSaveSuggestion={() => {}}
                agentSuggestions={{}}
                setAgentSuggestions={() => {}}
                isAgent={false}
            />

            {/* How It Works */}
            <section className="bg-surface relative overflow-hidden py-16 md:py-24">
                <div className="absolute top-0 right-0 w-1/3 h-64 bg-primary/5 blur-[100px] pointer-events-none" />

                <div className="mx-auto max-w-5xl px-4 sm:px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="mb-16 text-center"
                    >
                        <span className="kicker justify-center">How It Works</span>
                        <h2 className="display-heading !mb-4">Three simple steps</h2>
                        <p className="mx-auto max-w-xl text-lg text-text-muted">
                            Our streamlined process ensures your prescriptions are handled with clinical precision from upload to delivery.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        className="relative flex flex-col items-center gap-12 md:flex-row md:items-start md:justify-between md:gap-4"
                    >
                        {steps.map((step, index) => (
                            <div key={step.title} className="flex flex-col items-center md:flex-1 w-full relative">
                                <motion.div
                                    variants={stepVariants}
                                    className="relative z-10 flex w-full max-w-[280px] flex-col items-center text-center glass-card p-6 border-transparent hover:border-primary/20 hover:bg-surface transition-colors"
                                >
                                    <div className="relative mb-6">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-bg shadow-sm text-primary font-serif text-2xl font-bold">
                                            {index + 1}
                                        </div>
                                        <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
                                            <Icon name={step.icon} className="h-4 w-4" />
                                        </div>
                                    </div>
                                    <h3 className="mb-3 font-serif text-xl font-medium text-text">{step.title}</h3>
                                    <p className="text-sm text-text-muted">{step.description}</p>
                                </motion.div>

                                {index < steps.length - 1 && (
                                    <>
                                        <motion.div
                                            variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { duration: 0.7, ease: 'easeOut' } } }}
                                            className="absolute top-14 hidden md:block z-0"
                                            style={{ left: `calc(50% + 140px)`, width: `calc(100% - 280px)`, transformOrigin: 'left center' }}
                                        >
                                            <div className="h-[2px] w-full bg-gradient-to-r from-primary/30 to-primary/5" />
                                        </motion.div>
                                        <motion.div
                                            variants={{ hidden: { scaleY: 0 }, visible: { scaleY: 1, transition: { duration: 0.7, ease: 'easeOut' } } }}
                                            className="my-4 block md:hidden z-0"
                                            style={{ transformOrigin: 'top center' }}
                                        >
                                            <div className="mx-auto h-8 w-[2px] bg-gradient-to-b from-primary/30 to-primary/5" />
                                        </motion.div>
                                    </>
                                )}
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>
        </>
    );
}