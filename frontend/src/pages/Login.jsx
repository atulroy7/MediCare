import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Icon from '../components/Icons';
import Seo from '../components/Seo';

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, register, logout, user, role, isAuthenticated, loading } = useAuth();

    // Roles: 'customer' | 'agent'
    const [selectedRole, setSelectedRole] = useState('customer');
    // Mode: 'login' | 'signup'
    const [mode, setMode] = useState('login');

    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Form inputs - ALL hooks must be declared before any conditional return
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        agentCode: '',
        licenseNumber: ''
    });

    // If user is ALREADY logged in, prevent logging in twice
    if (isAuthenticated && user) {
        return (
            <div className="relative min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                <Seo title="Active Session | MediCare" description="You are already logged into your account." />
                
                <div className="w-full max-w-lg glass-card p-8 sm:p-10 text-center space-y-6 border border-border shadow-2xl relative z-10">
                    <div className="mx-auto w-16 h-16 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                        <Icon name="ShieldCheck" className="w-8 h-8" />
                    </div>

                    <div className="space-y-2">
                        <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 text-xs font-extrabold uppercase tracking-wider">
                            Active Session Detected
                        </span>
                        <h2 className="font-serif text-3xl font-bold text-text">Already Logged In</h2>
                        <p className="text-sm text-text-muted leading-relaxed">
                            You are currently signed in as <strong className="text-text">{user.name}</strong> ({user.email}).
                            Our security policy prevents logging in twice simultaneously with the same user account.
                        </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-bg-subtle border border-border text-xs text-text-muted flex items-center justify-between">
                        <span>Active Account Role:</span>
                        <span className="font-extrabold text-primary uppercase">{role === 'agent' ? 'Medical Agent' : 'Customer'}</span>
                    </div>

                    <div className="space-y-3 pt-2">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="glass-button-primary w-full py-3.5 justify-center text-sm font-bold"
                        >
                            Go to My Dashboard
                            <Icon name="ArrowRight" className="w-4 h-4 ml-1" />
                        </button>
                        <button
                            onClick={() => {
                                logout();
                                toast.success('Logged out successfully. You can now sign into another account.');
                            }}
                            className="w-full py-3 rounded-xl border border-red-500/30 text-red-600 dark:text-red-400 font-bold text-xs hover:bg-red-500/10 transition-all flex items-center justify-center gap-2"
                        >
                            <Icon name="LogOut" className="w-4 h-4" />
                            Log Out Current Account
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const handlePhoneChange = (e) => {
        const numericVal = e.target.value.replace(/\D/g, '').slice(0, 10);
        setFormData(prev => ({ ...prev, phone: numericVal }));
        setErrorMsg('');
        setSuccessMsg('');
    };

    const handleChange = (e) => {
        if (e.target.name === 'phone') {
            handlePhoneChange(e);
            return;
        }
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
        setErrorMsg('');
        setSuccessMsg('');
    };

    const handleRoleSwitch = (role) => {
        setSelectedRole(role);
        setErrorMsg('');
        setSuccessMsg('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        try {
            if (mode === 'login') {
                const res = await login(formData.email, formData.password, selectedRole);
                if (res?.success) {
                    setSuccessMsg(`Welcome back, ${res.user.name}! Redirecting...`);
                    setTimeout(() => {
                        const from = location.state?.from?.pathname || '/dashboard';
                        navigate(from, { replace: true });
                    }, 800);
                }
            } else {
                if (!formData.name || !formData.email || !formData.password || !formData.phone) {
                    setErrorMsg('Please fill in all required fields.');
                    return;
                }

                // Enforce exact 10 digits for phone number
                const cleanPhone = formData.phone.replace(/\D/g, '');
                if (cleanPhone.length !== 10) {
                    setErrorMsg('Phone number must be exactly 10 digits long (e.g. 9876543210).');
                    return;
                }

                const payload = {
                    ...formData,
                    role: selectedRole
                };

                const res = await register(payload);
                if (res?.success) {
                    setSuccessMsg(`Account created successfully! Welcome, ${res.user.name}.`);
                    setTimeout(() => {
                        navigate('/dashboard', { replace: true });
                    }, 800);
                }
            }
        } catch (err) {
            setErrorMsg(err.message || 'An error occurred during authentication.');
        }
    };

    const handleQuickDemo = async (role) => {
        setErrorMsg('');
        setSuccessMsg('');
        const demoEmail = role === 'agent' ? 'agent@demo.com' : 'customer@demo.com';
        const demoPass = 'password123';

        setFormData(prev => ({
            ...prev,
            email: demoEmail,
            password: demoPass
        }));

        try {
            const res = await login(demoEmail, demoPass, role);
            if (res?.success) {
                setSuccessMsg(`Logged in as Demo ${role === 'agent' ? 'Medical Agent' : 'Customer'}! Redirecting...`);
                setTimeout(() => {
                    navigate('/dashboard', { replace: true });
                }, 700);
            }
        } catch (err) {
            setErrorMsg(err.message || 'Demo login failed');
        }
    };

    return (
        <div className="relative min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <Seo 
                title={`${selectedRole === 'agent' ? 'Medical Agent' : 'Customer'} Login | MediCare`}
                description="Secure access portal for customers and authorized medical agents at MediCare."
            />

            {/* Background Decorative Blobs */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-72 h-72 bg-secondary/10 rounded-full blur-2xl pointer-events-none" />

            <div className="w-full max-w-xl relative z-10">
                {/* Header Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
                        <Icon name="Shield" className="w-4 h-4" />
                        Secure Healthcare Portal
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-serif font-bold text-text tracking-tight">
                        Welcome to <span className="text-primary">MediCare</span>
                    </h1>
                    <p className="mt-2 text-sm text-text-muted">
                        Sign in to manage prescription orders, medical supplies, or agent verification.
                    </p>
                </div>

                {/* Role Switcher Tabs */}
                <div className="grid grid-cols-2 p-1.5 bg-surface/80 border border-border backdrop-blur-xl rounded-2xl shadow-sm mb-6">
                    <button
                        type="button"
                        onClick={() => handleRoleSwitch('customer')}
                        className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                            selectedRole === 'customer'
                                ? 'bg-primary text-white shadow-md'
                                : 'text-text-muted hover:text-text hover:bg-bg-subtle'
                        }`}
                    >
                        <Icon name="User" className="w-4 h-4" />
                        Customer Portal
                    </button>
                    <button
                        type="button"
                        onClick={() => handleRoleSwitch('agent')}
                        className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                            selectedRole === 'agent'
                                ? 'bg-secondary text-white shadow-md'
                                : 'text-text-muted hover:text-text hover:bg-bg-subtle'
                        }`}
                    >
                        <Icon name="Stethoscope" className="w-4 h-4" />
                        Medical Agent Portal
                    </button>
                </div>

                {/* Main Card */}
                <div className="bg-surface/90 border border-border backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
                    {/* Quick Demo Access Bar */}
                    <div className="mb-6 p-4 rounded-2xl bg-bg-subtle/80 border border-border flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 text-xs font-medium text-text">
                            <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                            Want a quick live test?
                        </div>
                        <button
                            type="button"
                            onClick={() => handleQuickDemo(selectedRole)}
                            className="w-full sm:w-auto text-xs font-bold px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-all flex items-center justify-center gap-1.5"
                        >
                            <Icon name="Zap" className="w-3.5 h-3.5" />
                            Instant 1-Click {selectedRole === 'agent' ? 'Agent' : 'Customer'} Demo
                        </button>
                    </div>

                    {/* Mode Toggle (Sign In / Register) */}
                    <div className="flex border-b border-border mb-6">
                        <button
                            type="button"
                            onClick={() => setMode('login')}
                            className={`pb-3 text-sm font-semibold border-b-2 transition-colors mr-6 ${
                                mode === 'login'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-text-muted hover:text-text'
                            }`}
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode('signup')}
                            className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
                                mode === 'signup'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-text-muted hover:text-text'
                            }`}
                        >
                            Create {selectedRole === 'agent' ? 'Agent' : 'Customer'} Account
                        </button>
                    </div>

                    {/* Alerts */}
                    <AnimatePresence mode="wait">
                        {errorMsg && (
                            <motion.div
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                className="mb-5 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs sm:text-sm flex items-center gap-2"
                            >
                                <Icon name="AlertCircle" className="w-4 h-4 flex-shrink-0" />
                                <span>{errorMsg}</span>
                            </motion.div>
                        )}
                        {successMsg && (
                            <motion.div
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                className="mb-5 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm flex items-center gap-2"
                            >
                                <Icon name="CheckCircle" className="w-4 h-4 flex-shrink-0" />
                                <span>{successMsg}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {mode === 'signup' && (
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                                    Full Name *
                                </label>
                                <div className="relative">
                                    <Icon name="User" className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder={selectedRole === 'agent' ? 'Dr. Ananya Verma' : 'Rahul Sharma'}
                                        required
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                                Email Address *
                            </label>
                            <div className="relative">
                                <Icon name="Mail" className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder={selectedRole === 'agent' ? 'agent@demo.com' : 'customer@demo.com'}
                                    required
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                                Password *
                            </label>
                            <div className="relative">
                                <Icon name="Lock" className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                />
                            </div>
                        </div>

                        {mode === 'signup' && (
                            <>
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                                        Phone Number (10 Digits Only) *
                                    </label>
                                    <div className="relative">
                                        <Icon name="Phone" className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            minLength={10}
                                            maxLength={10}
                                            pattern="[0-9]{10}"
                                            placeholder="9876543210"
                                            required
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                        />
                                    </div>
                                </div>

                                {selectedRole === 'agent' && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                                                Agent Code
                                            </label>
                                            <input
                                                type="text"
                                                name="agentCode"
                                                value={formData.agentCode}
                                                onChange={handleChange}
                                                placeholder="AG-8849"
                                                className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                                                Pharmacy License #
                                            </label>
                                            <input
                                                type="text"
                                                name="licenseNumber"
                                                value={formData.licenseNumber}
                                                onChange={handleChange}
                                                placeholder="MH-PHARM-2024"
                                                className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                            />
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3.5 px-6 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 mt-6 ${
                                selectedRole === 'agent'
                                    ? 'bg-secondary hover:bg-secondary/90 shadow-md'
                                    : 'bg-primary hover:bg-primary/90 shadow-md'
                            } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Processing...
                                </span>
                            ) : (
                                <>
                                    <span>{mode === 'login' ? `Sign In as ${selectedRole === 'agent' ? 'Medical Agent' : 'Customer'}` : 'Register Account'}</span>
                                    <Icon name="ArrowRight" className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
