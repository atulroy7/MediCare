import { motion } from 'framer-motion';
import Seo from '../components/Seo';
import PrescriptionUpload from '../components/PrescriptionUpload';
import Icon from '../components/Icons';

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
    visible: {
        transition: {
            staggerChildren: 0.25,
        },
    },
};

const stepVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: 'easeOut' },
    },
};

const lineVariants = {
    hidden: { scaleX: 0 },
    visible: {
        scaleX: 1,
        transition: { duration: 0.7, ease: 'easeOut' },
    },
};

const lineVariantsMobile = {
    hidden: { scaleY: 0 },
    visible: {
        scaleY: 1,
        transition: { duration: 0.7, ease: 'easeOut' },
    },
};

export default function Prescription() {
    return (
        <>
            <Seo
                title="Upload Prescription"
                description="Upload a prescription for medicines that require pharmacist review before dispatch."
            />

            {/* ─── Hero ─── */}
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
                            Send us your <span className="text-primary italic font-normal">prescription</span>
                        </h1>
                        <p className="mx-auto max-w-xl text-lg text-text-muted">
                            Upload your valid medical prescription for swift processing by our clinical pharmacists. We ensure the highest standards of data privacy and medical accuracy.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ─── Form section ─── */}
            <section className="mx-auto max-w-7xl px-4 py-12 md:py-20">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-12"
                >
                    {/* Left: Form */}
                    <PrescriptionUpload />

                    {/* Right: Info sidebar */}
                    <div className="space-y-6 lg:sticky lg:top-28">
                        {/* Pharmacist review card */}
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

                        {/* Accepted files card */}
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
                                            <span
                                                key={fmt}
                                                className="inline-flex items-center rounded-lg border border-border bg-bg-subtle px-3 py-1 text-xs font-bold tracking-widest text-text-muted"
                                            >
                                                .{fmt}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Fast support card */}
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

                        {/* Trust badge */}
                        <div className="flex items-center gap-3 rounded-xl bg-bg-subtle border border-border p-4">
                            <Icon name="BadgeCheck" className="h-5 w-5 text-green-500" />
                            <p className="text-xs font-medium text-text-muted">
                                100% secure — your data is never shared with third parties.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* ─── How It Works ─── */}
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
                        <h2 className="display-heading !mb-4">
                            Three simple steps
                        </h2>
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

                                    <h3 className="mb-3 font-serif text-xl font-medium text-text">
                                        {step.title}
                                    </h3>
                                    <p className="text-sm text-text-muted">
                                        {step.description}
                                    </p>
                                </motion.div>

                                {/* Connecting line */}
                                {index < steps.length - 1 && (
                                    <>
                                        {/* Desktop */}
                                        <motion.div
                                            variants={lineVariants}
                                            className="absolute top-14 hidden md:block z-0"
                                            style={{
                                                left: `calc(50% + 140px)`,
                                                width: `calc(100% - 280px)`,
                                                transformOrigin: 'left center',
                                            }}
                                        >
                                            <div className="h-[2px] w-full bg-gradient-to-r from-primary/30 to-primary/5" />
                                        </motion.div>

                                        {/* Mobile */}
                                        <motion.div
                                            variants={lineVariantsMobile}
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