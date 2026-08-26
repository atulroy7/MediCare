import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '../components/Icons';
import Seo from '../components/Seo';
import { featuredCategories } from '../data/products';
import { useAuth } from '../context/AuthContext';

function AgentHomeView() {
    const { user } = useAuth();
    const [queue, setQueue] = useState([]);

    const loadData = () => {
        const stored = JSON.parse(localStorage.getItem('jaya_all_prescriptions') || '[]');
        setQueue(stored);
    };

    useEffect(() => {
        loadData();
        const handleSync = () => loadData();
        window.addEventListener('jaya_prescription_update', handleSync);
        window.addEventListener('storage', handleSync);
        return () => {
            window.removeEventListener('jaya_prescription_update', handleSync);
            window.removeEventListener('storage', handleSync);
        };
    }, []);

    const pendingList = queue.filter(q => q.status === 'PENDING_VERIFICATION');
    const approvedList = queue.filter(q => q.status === 'APPROVED');
    const rejectedList = queue.filter(q => q.status === 'REJECTED');

    return (
        <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
            <Seo title="Agent Command Center | Jaya Medical Store" description="Real-time clinical verification dashboard and new approval request management." />

            {/* Agent Hero Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1B4F72] via-[#2E86C1] to-[#154360] text-white p-8 sm:p-12 shadow-2xl border border-white/20">
                <div className="relative z-10 max-w-3xl space-y-4">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/30 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        Pharmacist Clinical Command Center
                    </div>
                    <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight leading-tight text-white">
                        Welcome Back, Agent {user?.name || 'Pharmacist'}
                    </h1>
                    <p className="text-sm sm:text-base text-sky-100 leading-relaxed max-w-2xl">
                        Monitor live incoming doctor prescription requests, verify order medicines, and issue pharmacist clearance notes in real-time.
                    </p>
                    <div className="pt-2 flex flex-wrap gap-4">
                        <Link
                            to="/dashboard"
                            className="px-6 py-3.5 rounded-2xl bg-white text-[#1B4F72] font-extrabold text-sm hover:bg-sky-50 transition-all shadow-lg flex items-center gap-2"
                        >
                            <Icon name="Stethoscope" className="w-4 h-4 text-[#1B4F72]" />
                            Open Workstation Queue ({pendingList.length} Pending)
                        </Link>
                    </div>
                </div>
            </div>

            {/* Live Verification Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-xs text-text-muted">
                        <span>New Requests Pending</span>
                        <Icon name="Clock" className="w-5 h-5 text-amber-500" />
                    </div>
                    <p className="font-serif font-bold text-3xl text-amber-500">{pendingList.length}</p>
                    <p className="text-xs text-text-muted">Awaiting Agent Approval</p>
                </div>

                <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-xs text-text-muted">
                        <span>Approved Clearances</span>
                        <Icon name="CheckCircle" className="w-5 h-5 text-emerald-500" />
                    </div>
                    <p className="font-serif font-bold text-3xl text-emerald-600">{approvedList.length}</p>
                    <p className="text-xs text-text-muted">Orders Cleared for Dispatch</p>
                </div>

                <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-xs text-text-muted">
                        <span>Rejected Requests</span>
                        <Icon name="XCircle" className="w-5 h-5 text-red-500" />
                    </div>
                    <p className="font-serif font-bold text-3xl text-red-500">{rejectedList.length}</p>
                    <p className="text-xs text-text-muted">Flagged Prescriptions</p>
                </div>

                <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-xs text-text-muted">
                        <span>Pharmacy License</span>
                        <Icon name="ShieldCheck" className="w-5 h-5 text-secondary" />
                    </div>
                    <p className="font-mono font-bold text-base text-secondary">{user?.licenseNumber || 'MH-PHARM-2024-9918'}</p>
                    <p className="text-xs text-text-muted">Licensed Agent Active</p>
                </div>
            </div>

            {/* Live Incoming Approval Requests Section */}
            <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-border pb-4">
                    <div>
                        <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Icon name="FileText" className="w-6 h-6 text-secondary" />
                            Live Pending Approval Requests ({pendingList.length})
                        </h2>
                        <p className="text-xs text-text-muted mt-0.5">Real-time incoming customer prescription verification queue.</p>
                    </div>
                    <Link to="/dashboard" className="text-xs font-bold text-secondary hover:underline">
                        View All in Workstation →
                    </Link>
                </div>

                {pendingList.length === 0 ? (
                    <div className="p-10 rounded-2xl bg-bg-subtle text-center text-text-muted text-sm space-y-2 border border-dashed border-border">
                        <Icon name="CheckCircle2" className="w-10 h-10 text-emerald-500 mx-auto opacity-70" />
                        <p className="font-bold text-text">No pending approval requests right now!</p>
                        <p className="text-xs">All customer doctor notes are cleared.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pendingList.map((p) => (
                            <div key={p.id} className="p-5 rounded-2xl bg-bg-subtle border border-border space-y-3 hover:border-secondary/40 transition-all shadow-sm">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-surface border border-border text-secondary">
                                            {p.id}
                                        </span>
                                        <h3 className="font-bold text-slate-900 dark:text-white text-base mt-1">{p.patient}</h3>
                                        <p className="text-xs text-text-muted">{p.userEmail} • {p.date}</p>
                                    </div>
                                    <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 font-bold text-[11px] border border-amber-500/20">
                                        PENDING
                                    </span>
                                </div>

                                {p.medicinesSummary && (
                                    <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-xs">
                                        <span className="font-bold text-primary block mb-0.5">💊 Requested Order Medicines:</span>
                                        <span className="text-text font-semibold">{p.medicinesSummary}</span>
                                    </div>
                                )}

                                <div className="pt-1 flex items-center justify-between">
                                    <span className="text-xs text-text-muted">Doc: {p.doctor || 'Practitioner'}</span>
                                    <Link
                                        to="/dashboard"
                                        className="px-3.5 py-1.5 rounded-xl bg-secondary text-white font-bold text-xs hover:bg-secondary/90 transition-all flex items-center gap-1 shadow-sm"
                                    >
                                        Review & Approve →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

const trustBadges = [
    { title: 'Licensed Pharmacy', icon: 'ShieldCheck' },
    { title: '100% Genuine Medicines', icon: 'BadgeCheck' },
    { title: 'Same-Day Delivery', icon: 'Truck' },
    { title: 'Expert Consultation', icon: 'Stethoscope' },
];

const collectionCards = [
    {
        title: 'Medicines',
        category: 'Medicines',
        description: 'Comprehensive pharmaceutical care, sourced strictly from certified global manufacturers.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD49expR2znvOL7qB6D50TlQBdUgtizsNudzj-6pxZGO_xZrwBSXCI1tLClB139tPjeUY_6-RSdQsD2yhhpf6tFZUFPtMIZcmQ3iUjYJeTAecFa620xx8QxFyaHHsMNNf3AonnjuGpd0y77rbEOkY7l7F50mTmls8pk6ZxEDa7fE9AnmeJB696HS79j8t4SKKfVK3E9iARcmCICR6Wg7twzL2tpHP2awMzcL4kiuvmSHTqft11KiDbtkgPbSfVIqFLIWaG7FLo1xN4',
        large: true,
    },
    {
        title: 'Vitamins & Supplements',
        category: 'Vitamins & Supplements',
        description: 'Daily nutritional & immunity support.',
        image: import.meta.env.BASE_URL + 'images/vitamins.webp',
    },
    {
        title: 'Personal Care',
        category: 'Personal Care',
        description: 'Premium skin & hygiene essentials.',
        image: import.meta.env.BASE_URL + 'images/personalcare.webp',
    },
    {
        title: 'Baby Care',
        category: 'Baby Care',
        description: 'Gentle pediatric & infant care.',
        image: import.meta.env.BASE_URL + 'images/babycare.webp',
    },
    {
        title: 'Diabetic Care',
        category: 'Diabetic Care',
        description: 'Glucose monitoring & blood sugar management.',
        image: import.meta.env.BASE_URL + 'images/diabeticcare.webp',
    },
    {
        title: 'Surgical & First Aid',
        category: 'Surgical & First Aid',
        description: 'Thermometers, bandages, masks, & clinical supplies.',
        image: import.meta.env.BASE_URL + 'images/coughandcold.webp',
    },
];

const processSteps = [
    {
        title: '1. Search & Select',
        description: 'Browse our curated inventory to find your prescribed or wellness items.',
        icon: 'Search',
    },
    {
        title: '2. Upload Prescription',
        description: 'Securely submit your medical documents for rapid pharmacist verification.',
        icon: 'Upload',
    },
    {
        title: '3. Direct Delivery',
        description: 'Receive your meticulously packaged order swiftly at your doorstep.',
        icon: 'Truck',
    },
];

const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

export default function Home() {
    const { role } = useAuth();
    const [newsletterEmail, setNewsletterEmail] = useState('');

    if (role === 'agent') {
        return <AgentHomeView />;
    }

    const handleSubscribe = (event) => {
        event.preventDefault();
        toast.success('Newsletter signup submitted.');
        setNewsletterEmail('');
    };

    return (
        <>
            <Seo
                title="Home"
                description="Jaya Medical Store is a curated medical store experience with medicines, prescription uploads, wellness products, and local delivery support."
            />

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-8 pb-16 md:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
                        
                        {/* Left Column Content */}
                        <motion.div 
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            className="lg:col-span-7 space-y-8"
                        >
                            <span className="kicker">
                                <Icon name="Activity" className="h-4 w-4" /> Certified Pharmacy Care
                            </span>

                            <div className="space-y-4">
                                <h1 className="display-heading text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-text leading-[1.05]">
                                    Authentic Healthcare, <br />
                                    <span className="text-primary italic font-normal">Simplified.</span>
                                </h1>
                                <p className="text-base sm:text-lg text-text-muted max-w-2xl leading-relaxed">
                                    Direct access to 100% genuine medicines, vitamins, baby care, and surgical supplies with same-day doorstep fulfillment.
                                </p>
                            </div>

                            {/* Live Search & Actions */}
                            <div className="space-y-4 max-w-xl">
                                <form 
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        const query = e.target.elements.search.value;
                                        if (query) window.location.href = `/products?search=${encodeURIComponent(query)}`;
                                    }}
                                    className="glass-card p-2 flex items-center gap-2 border border-border shadow-2xl focus-within:border-primary transition-all"
                                >
                                    <Icon name="Search" className="h-5 w-5 text-primary ml-3" />
                                    <input
                                        name="search"
                                        placeholder="Search for medicines, vitamins, baby care..."
                                        className="w-full bg-transparent text-sm text-text outline-none placeholder:text-text-muted py-2"
                                    />
                                    <button type="submit" className="glass-button-primary !py-2.5 !px-5 whitespace-nowrap">
                                        Find Items
                                    </button>
                                </form>

                                <div className="flex flex-wrap items-center gap-4 pt-2">
                                    <Link to="/products" className="glass-button-primary">
                                        Browse Products
                                        <Icon name="ArrowRight" className="h-4 w-4" />
                                    </Link>
                                    <Link to="/prescription" className="glass-button-secondary">
                                        <Icon name="Upload" className="h-4 w-4 text-primary" />
                                        Upload Prescription
                                    </Link>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Column Interactive Showcase Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.15 }}
                            className="lg:col-span-5 relative"
                        >
                            <div className="glass-card p-6 sm:p-8 relative overflow-hidden border border-border shadow-2xl space-y-6">
                                <div className="flex items-center justify-between border-b border-border/80 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
                                            <Icon name="ShieldCheck" className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-serif text-lg font-bold text-text">Jaya Pharmacy</h3>
                                            <p className="text-xs text-text-muted">Licensed Retail Pharmacy</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 rounded-full bg-primary/15 text-primary text-[10px] uppercase font-extrabold tracking-wider">
                                        Verified
                                    </span>
                                </div>

                                {/* Floating Live Category Chips */}
                                <div className="space-y-3">
                                    <p className="text-xs uppercase font-extrabold text-text-muted tracking-wider">Top Categories</p>
                                    <div className="grid grid-cols-2 gap-2.5">
                                        {featuredCategories.slice(0, 4).map((cat) => (
                                            <Link
                                                key={cat.name}
                                                to={`/products?category=${encodeURIComponent(cat.name)}`}
                                                className="p-3 rounded-2xl bg-bg-subtle/80 hover:bg-primary/10 border border-border hover:border-primary/30 transition-all flex items-center gap-2.5 group"
                                            >
                                                <div className="p-1.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                                    <Icon name={cat.iconKey || 'Pill'} className="w-4 h-4" />
                                                </div>
                                                <span className="text-xs font-bold text-text group-hover:text-primary transition-colors truncate">{cat.name}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                {/* Quick Prescription Dropzone Callout */}
                                <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-xs font-bold text-text">Have a Doctor's Note?</p>
                                        <p className="text-[11px] text-text-muted">Upload Prescription for instant verification</p>
                                    </div>
                                    <Link to="/prescription" className="glass-button-primary !py-2 !px-4 !text-[11px] whitespace-nowrap">
                                        Upload Now
                                    </Link>
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </section>

            {/* Trust Badges */}
            <section className="border-y border-border bg-surface/50 backdrop-blur-md">
                <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="grid grid-cols-2 gap-8 md:grid-cols-4"
                    >
                        {trustBadges.map((badge) => (
                            <motion.div key={badge.title} variants={fadeInUp} className="group flex flex-col items-center gap-4 text-center">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-bg border border-border shadow-sm text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/10">
                                    <Icon name={badge.icon} className="h-6 w-6" />
                                </div>
                                <h3 className="text-base font-medium text-text">{badge.title}</h3>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Collections */}
            <section className="mx-auto max-w-7xl px-4 py-24 md:px-8">
                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6"
                >
                    <div className="max-w-2xl">
                        <span className="kicker">Collections</span>
                        <h2 className="display-heading mb-4">Curated Categories</h2>
                        <p className="text-lg text-text-muted">
                            Explore our meticulously selected categories, designed to address your specific health and wellness needs.
                        </p>
                    </div>
                    <Link to="/products" className="glass-button-secondary inline-flex w-max">
                        View All Categories
                        <Icon name="ArrowRight" className="h-4 w-4" />
                    </Link>
                </motion.div>

                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="grid auto-rows-[280px] grid-cols-1 gap-6 md:grid-cols-12"
                >
                    {collectionCards.map((card) =>
                        card.large ? (
                            <motion.div variants={fadeInUp} key={card.title} className="md:col-span-8 md:row-span-2">
                                <Link to={`/products?category=${encodeURIComponent(card.category)}`} className="group relative block w-full h-full overflow-hidden rounded-3xl border border-border shadow-lg">
                                    <img
                                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        alt={card.title}
                                        src={card.image}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                    <div className="absolute bottom-0 left-0 p-8 md:p-10 w-full">
                                        <h3 className="mb-3 font-serif text-4xl font-semibold text-white">{card.title}</h3>
                                        <p className="max-w-md text-base text-white/80">{card.description}</p>
                                    </div>
                                </Link>
                            </motion.div>
                        ) : (
                            <motion.div variants={fadeInUp} key={card.title} className="md:col-span-4">
                                <Link to={`/products?category=${encodeURIComponent(card.category)}`} className="group relative flex flex-col justify-end overflow-hidden rounded-3xl border border-border bg-surface p-6 h-full shadow-md hover:shadow-xl transition-all duration-300">
                                    {card.image && (
                                        <>
                                            <img
                                                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                                                alt={card.title}
                                                src={card.image}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
                                        </>
                                    )}
                                    <div className="relative z-10">
                                        <div className="mb-4 inline-flex rounded-xl bg-white/20 backdrop-blur-md p-2 text-white">
                                            <Icon name={card.icon || 'Pill'} className="h-6 w-6" />
                                        </div>
                                        <h3 className="font-serif text-2xl font-medium text-white mb-1">{card.title}</h3>
                                        <p className="text-sm text-white/70 line-clamp-2">{card.description}</p>
                                    </div>
                                </Link>
                            </motion.div>
                        )
                    )}
                </motion.div>
            </section>

            {/* Process */}
            <section className="bg-surface border-y border-border py-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-lofi opacity-20 blur-[100px] pointer-events-none" />
                
                <div className="mx-auto max-w-7xl px-4 md:px-8 relative z-10">
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="mb-16 text-center max-w-2xl mx-auto"
                    >
                        <span className="kicker">How it works</span>
                        <h2 className="display-heading mb-4">A Seamless Process</h2>
                        <p className="text-lg text-text-muted">
                            Acquiring your essential medications should be as calming as the cure itself. Follow our streamlined three-step approach.
                        </p>
                    </motion.div>

                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="relative flex flex-col gap-12 md:flex-row md:items-start md:justify-between"
                    >
                        {/* Connecting Line */}
                        <div className="absolute left-1/2 md:left-0 top-0 md:top-10 h-full md:h-px w-px md:w-full -translate-x-1/2 md:translate-x-0 bg-border md:block" />
                        
                        {processSteps.map((step, index) => (
                            <motion.div variants={fadeInUp} key={step.title} className="z-10 flex w-full flex-col items-center bg-surface md:bg-transparent px-4 text-center md:w-1/3 pt-4 md:pt-0">
                                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-bg border border-border shadow-lg text-primary">
                                    <Icon name={step.icon} className="h-8 w-8" />
                                </div>
                                <h4 className="mb-3 font-serif text-2xl font-medium text-text">{step.title}</h4>
                                <p className="text-base text-text-muted max-w-xs">{step.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Owner Section */}
            <section className="mx-auto max-w-7xl px-4 py-24 md:px-8">
                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="grid grid-cols-1 items-center gap-16 md:grid-cols-2"
                >
                    <motion.div variants={fadeInUp} className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl shadow-2xl">
                        <img
                            className="h-full w-full object-cover"
                            alt="Madan Mohan Mishra"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvLR3jdxYJOrAIhUGI00WIuVfHFtqPy3-XgSkwQLQHqugGoqmYpqsZecRw6mhaUfUy71UpewC33x5BM_9ICyj2bK9yHfckn5uAn8wV7XSJDDhnFYIU62S9T-904OxYNG9SLYbLW4SgzbCCBitIPaKB3I6pIaJVlnuZ3nYLzgkmSV4cr70WEfsaxWHNJ-bOPvkjSfn5-8XdRuIN2sGao0AKiWPqInpq6OhlEcYVEPHhoNSC5k86ktriB55v4mmYhpg8nW6pefT14Mw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 p-8 text-white">
                            <p className="font-serif text-2xl font-medium">Madan Mohan Mishra</p>
                            <p className="text-white/80">Founder & Owner</p>
                        </div>
                    </motion.div>

                    <motion.div variants={staggerContainer} className="flex flex-col items-start gap-8">
                        <motion.span variants={fadeInUp} className="kicker">The Visionary</motion.span>
                        <motion.h2 variants={fadeInUp} className="font-serif text-4xl lg:text-5xl leading-tight text-text">
                            &quot;True care requires a synthesis of unyielding precision and profound empathy.&quot;
                        </motion.h2>
                        <motion.div variants={fadeInUp} className="h-1 w-16 bg-primary rounded-full" />
                        <motion.p variants={fadeInUp} className="text-lg text-text-muted leading-relaxed">
                            Founded by Madan Mohan Mishra, Jaya Medical Store was established to elevate the standard of pharmaceutical provision. We view every prescription not merely as a transaction, but as a critical component of your personal health journey, deserving of the utmost respect and rigorous attention to detail.
                        </motion.p>
                        <motion.div variants={fadeInUp}>
                            <Link to="/about" className="glass-button-secondary">
                                Read Our Full Story
                            </Link>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </section>

            {/* Newsletter */}
            <section className="bg-lofi py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-bg/80 dark:bg-bg/90 backdrop-blur-[50px] z-0" />
                <div className="mx-auto max-w-3xl px-4 text-center relative z-10">
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="glass-card p-12 md:p-16"
                    >
                        <motion.div variants={fadeInUp} className="inline-flex bg-primary/10 p-4 rounded-full mb-6">
                            <Icon name="Mail" className="h-8 w-8 text-primary" />
                        </motion.div>
                        <motion.h2 variants={fadeInUp} className="display-heading !mb-4">Join The Sanctuary</motion.h2>
                        <motion.p variants={fadeInUp} className="mb-10 text-lg text-text-muted">
                            Subscribe to receive sophisticated insights on wellness, exclusive product curations, and priority medical updates.
                        </motion.p>
                        <motion.form variants={fadeInUp} onSubmit={handleSubscribe} className="mx-auto flex flex-col sm:flex-row gap-4 max-w-lg">
                            <input
                                type="email"
                                required
                                value={newsletterEmail}
                                onChange={(event) => setNewsletterEmail(event.target.value)}
                                placeholder="Enter your email address"
                                className="flex-1 rounded-full border border-border bg-surface px-6 py-4 text-text outline-none focus:border-primary transition-colors shadow-sm"
                            />
                            <button type="submit" className="glass-button-primary py-4 px-8">
                                Subscribe
                            </button>
                        </motion.form>
                    </motion.div>
                </div>
            </section>
        </>
    );
}