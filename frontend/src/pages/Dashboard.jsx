import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Icon from '../components/Icons';
import Seo from '../components/Seo';
import CustomerDashboard from '../components/dashboard/CustomerDashboard';
import AgentDashboard from '../components/dashboard/AgentDashboard';
import PrescriptionDetailModal from '../components/dashboard/PrescriptionDetailModal';

export default function Dashboard() {
    const navigate = useNavigate();
    const { user, role, logout } = useAuth();
    const { cartCount } = useCart();

    const userRxKey = user ? `jaya_prescriptions_${user.id || user.email}` : '';
    const userOrderKey = user ? `jaya_orders_${user.id || user.email}` : '';

    // States
    const [userPrescriptions, setUserPrescriptions] = useState([]);
    const [userOrders, setUserOrders] = useState([]);
    const [agentQueue, setAgentQueue] = useState([]);
    const [selectedRx, setSelectedRx] = useState(null);
    const [agentSuggestions, setAgentSuggestions] = useState({});
    const [agentFilter, setAgentFilter] = useState('ALL');

    const mapRx = (item) => ({
        id: item.rxId || item.id || item._id,
        patient: item.patientName || item.patient || 'Patient',
        doctor: item.doctor || 'Dr. Verified Practitioner',
        date: item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : (item.date || 'Today'),
        status: item.status || 'PENDING_VERIFICATION',
        filename: item.filename || 'prescription.jpg',
        userEmail: item.userEmail || '',
        phone: item.phone || '',
        address: item.address || '',
        notes: item.notes || '',
        photoUrl: item.photoUrl || '',
        medicinesSummary: item.medicinesSummary || 'General Prescription Upload',
        agentSuggestion: item.agentSuggestion || item.agentNotes || ''
    });

    // Load and sync data from LocalStorage, SessionStorage & Backend API
    const loadDashboardData = async () => {
        if (!user) return;

        const cleanEmail = user.email.toLowerCase();
        const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

        if (role === 'customer') {
            const rxMap = new Map();

            // 1. LocalStorage
            try {
                const globalRx = JSON.parse(localStorage.getItem('jaya_all_prescriptions') || '[]');
                const emailKeyRx = JSON.parse(localStorage.getItem(`jaya_prescriptions_${cleanEmail}`) || '[]');
                const idKeyRx = user.id ? JSON.parse(localStorage.getItem(`jaya_prescriptions_${user.id}`) || '[]') : [];

                [...globalRx.filter(r => r.userEmail && r.userEmail.toLowerCase() === cleanEmail), ...emailKeyRx, ...idKeyRx]
                    .map(mapRx)
                    .forEach(r => { if (r && r.id) rxMap.set(r.id, r); });
            } catch (_) {}

            // 2. SessionStorage
            try {
                const sessionRx = JSON.parse(sessionStorage.getItem('jaya_session_prescriptions') || '[]');
                sessionRx.filter(r => r.userEmail && r.userEmail.toLowerCase() === cleanEmail).forEach(r => {
                    if (r && r.id) {
                        const existing = rxMap.get(r.id);
                        rxMap.set(r.id, { ...existing, ...mapRx(r), photoUrl: r.photoUrl || existing?.photoUrl });
                    }
                });
            } catch (_) {}

            // 3. Backend API
            try {
                const res = await fetch(`${backendUrl}/prescriptions/my-prescriptions?email=${encodeURIComponent(cleanEmail)}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.success && Array.isArray(data.prescriptions)) {
                        data.prescriptions.map(mapRx).forEach(r => {
                            if (r && r.id) {
                                const existing = rxMap.get(r.id);
                                rxMap.set(r.id, { ...existing, ...r, photoUrl: existing?.photoUrl || r.photoUrl });
                            }
                        });
                    }
                }
            } catch (err) {
                console.warn('Backend API fetch for prescriptions failed:', err.message);
            }

            const sortByLatest = (a, b) => {
                const tA = a.timestamp || (a.createdAt ? new Date(a.createdAt).getTime() : 0);
                const tB = b.timestamp || (b.createdAt ? new Date(b.createdAt).getTime() : 0);
                if (tA && tB && tA !== tB) return tB - tA;
                return (b.id || '').localeCompare(a.id || '');
            };

            setUserPrescriptions(Array.from(rxMap.values()).sort(sortByLatest));
            const orderData = JSON.parse(localStorage.getItem(userOrderKey) || '[]');
            setUserOrders(orderData);
        } else if (role === 'agent') {
            const rxMap = new Map();

            // 1. Check all jaya_prescriptions_* keys & jaya_all_prescriptions in localStorage
            try {
                const globalRx = JSON.parse(localStorage.getItem('jaya_all_prescriptions') || '[]');
                if (Array.isArray(globalRx)) {
                    globalRx.map(mapRx).forEach(r => { if (r && r.id) rxMap.set(r.id, r); });
                }

                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && (key.startsWith('jaya_prescriptions_') || key === 'jaya_all_prescriptions')) {
                        const items = JSON.parse(localStorage.getItem(key) || '[]');
                        if (Array.isArray(items)) {
                            items.map(mapRx).forEach(r => {
                                if (r && r.id) {
                                    if (rxMap.has(r.id)) {
                                        const existing = rxMap.get(r.id);
                                        rxMap.set(r.id, { ...existing, ...r, photoUrl: r.photoUrl || existing.photoUrl });
                                    } else {
                                        rxMap.set(r.id, r);
                                    }
                                }
                            });
                        }
                    }
                }
            } catch (_) {}

            // 2. Merge from sessionStorage (for live preview/full photoUrl of current session uploads)
            try {
                const sessionRx = JSON.parse(sessionStorage.getItem('jaya_session_prescriptions') || '[]');
                if (Array.isArray(sessionRx)) {
                    sessionRx.map(mapRx).forEach(r => {
                        if (r && r.id) {
                            if (rxMap.has(r.id)) {
                                const existing = rxMap.get(r.id);
                                rxMap.set(r.id, { ...existing, ...r, photoUrl: r.photoUrl || existing.photoUrl });
                            } else {
                                rxMap.set(r.id, r);
                            }
                        }
                    });
                }
            } catch (_) {}

            // 3. Fetch from MongoDB via Backend API
            try {
                const res = await fetch(`${backendUrl}/prescriptions/all`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.success && Array.isArray(data.prescriptions)) {
                        data.prescriptions.map(mapRx).forEach(r => {
                            if (r && r.id) {
                                if (rxMap.has(r.id)) {
                                    const existing = rxMap.get(r.id);
                                    rxMap.set(r.id, { ...existing, ...r, photoUrl: existing.photoUrl || r.photoUrl });
                                } else {
                                    rxMap.set(r.id, r);
                                }
                            }
                        });
                    }
                }
            } catch (err) {
                console.warn('Backend API fetch all prescriptions failed:', err.message);
            }

            const sortByLatest = (a, b) => {
                const tA = a.timestamp || (a.createdAt ? new Date(a.createdAt).getTime() : 0);
                const tB = b.timestamp || (b.createdAt ? new Date(b.createdAt).getTime() : 0);
                if (tA && tB && tA !== tB) return tB - tA;
                return (b.id || '').localeCompare(a.id || '');
            };

            setAgentQueue(Array.from(rxMap.values()).sort(sortByLatest));
        }
    };

    useEffect(() => {
        loadDashboardData();

        const handleSync = () => loadDashboardData();
        window.addEventListener('jaya_prescription_update', handleSync);
        window.addEventListener('storage', handleSync);

        return () => {
            window.removeEventListener('jaya_prescription_update', handleSync);
            window.removeEventListener('storage', handleSync);
        };
    }, [user, role, userRxKey, userOrderKey]);

    const handleApprovePrescription = async (id) => {
        const updated = agentQueue.map(p => (p.id === id || p.rxId === id || p._id === id) ? { ...p, status: 'APPROVED' } : p);
        setAgentQueue(updated);

        // 1. Update all matching localStorage keys
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && (key.startsWith('jaya_prescriptions_') || key === 'jaya_all_prescriptions')) {
                    const items = JSON.parse(localStorage.getItem(key) || '[]');
                    if (Array.isArray(items)) {
                        const updatedItems = items.map(p => 
                            (p.id === id || p.rxId === id || p._id === id) ? { ...p, status: 'APPROVED' } : p
                        );
                        localStorage.setItem(key, JSON.stringify(updatedItems));
                    }
                }
            }
        } catch (_) {}

        // 2. Update sessionStorage
        try {
            const sessionRx = JSON.parse(sessionStorage.getItem('jaya_session_prescriptions') || '[]');
            const updatedSession = sessionRx.map(p => (p.id === id || p.rxId === id || p._id === id) ? { ...p, status: 'APPROVED' } : p);
            sessionStorage.setItem('jaya_session_prescriptions', JSON.stringify(updatedSession));
        } catch (_) {}

        // 3. Call backend API
        try {
            const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            await fetch(`${backendUrl}/prescriptions/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'APPROVED' })
            });
        } catch (err) {
            console.warn('API approve prescription warning:', err.message);
        }

        window.dispatchEvent(new Event('jaya_prescription_update'));
        window.dispatchEvent(new Event('storage'));

        if (selectedRx && (selectedRx.id === id || selectedRx.rxId === id || selectedRx._id === id)) {
            setSelectedRx(prev => ({ ...prev, status: 'APPROVED' }));
        }

        toast.success(`Prescription ${id} Approved!`);
    };

    const handleRejectPrescription = async (id) => {
        const updated = agentQueue.map(p => (p.id === id || p.rxId === id || p._id === id) ? { ...p, status: 'REJECTED' } : p);
        setAgentQueue(updated);

        // 1. Update all matching localStorage keys
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && (key.startsWith('jaya_prescriptions_') || key === 'jaya_all_prescriptions')) {
                    const items = JSON.parse(localStorage.getItem(key) || '[]');
                    if (Array.isArray(items)) {
                        const updatedItems = items.map(p => 
                            (p.id === id || p.rxId === id || p._id === id) ? { ...p, status: 'REJECTED' } : p
                        );
                        localStorage.setItem(key, JSON.stringify(updatedItems));
                    }
                }
            }
        } catch (_) {}

        // 2. Update sessionStorage
        try {
            const sessionRx = JSON.parse(sessionStorage.getItem('jaya_session_prescriptions') || '[]');
            const updatedSession = sessionRx.map(p => (p.id === id || p.rxId === id || p._id === id) ? { ...p, status: 'REJECTED' } : p);
            sessionStorage.setItem('jaya_session_prescriptions', JSON.stringify(updatedSession));
        } catch (_) {}

        // 3. Call backend API
        try {
            const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            await fetch(`${backendUrl}/prescriptions/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'REJECTED' })
            });
        } catch (err) {
            console.warn('API reject prescription warning:', err.message);
        }

        window.dispatchEvent(new Event('jaya_prescription_update'));
        window.dispatchEvent(new Event('storage'));

        if (selectedRx && (selectedRx.id === id || selectedRx.rxId === id || selectedRx._id === id)) {
            setSelectedRx(prev => ({ ...prev, status: 'REJECTED' }));
        }

        toast.error(`Prescription ${id} Rejected.`);
    };

    const handleSaveSuggestion = (id) => {
        const textToSave = agentSuggestions[id] || '';
        if (!textToSave.trim()) {
            toast.error('Please type clinical advice or dosage instructions before saving.');
            return;
        }

        const updated = agentQueue.map(p => p.id === id ? { ...p, agentSuggestion: textToSave } : p);
        setAgentQueue(updated);
        try {
            localStorage.setItem('jaya_all_prescriptions', JSON.stringify(updated));
        } catch (_) {}

        try {
            const sessionRx = JSON.parse(sessionStorage.getItem('jaya_session_prescriptions') || '[]');
            const updatedSession = sessionRx.map(p => (p.id === id || p.rxId === id) ? { ...p, agentSuggestion: textToSave } : p);
            sessionStorage.setItem('jaya_session_prescriptions', JSON.stringify(updatedSession));
        } catch (_) {}

        const target = agentQueue.find(p => p.id === id);
        if (target) {
            if (target.userEmail) {
                const emailKey = `jaya_prescriptions_${target.userEmail.toLowerCase()}`;
                try {
                    const targetUserRx = JSON.parse(localStorage.getItem(emailKey) || '[]');
                    const updatedUserRx = targetUserRx.map(p => p.id === id ? { ...p, agentSuggestion: textToSave } : p);
                    localStorage.setItem(emailKey, JSON.stringify(updatedUserRx));
                } catch (_) {}
            }
            if (target.userId) {
                const idKey = `jaya_prescriptions_${target.userId}`;
                try {
                    const targetIdRx = JSON.parse(localStorage.getItem(idKey) || '[]');
                    const updatedIdRx = targetIdRx.map(p => p.id === id ? { ...p, agentSuggestion: textToSave } : p);
                    localStorage.setItem(idKey, JSON.stringify(updatedIdRx));
                } catch (_) {}
            }
        }

        window.dispatchEvent(new Event('jaya_prescription_update'));
        window.dispatchEvent(new Event('storage'));

        if (selectedRx && selectedRx.id === id) {
            setSelectedRx(prev => ({ ...prev, agentSuggestion: textToSave }));
        }

        toast.success('Pharmacist clinical advice saved and sent to customer!');
    };

    if (!user) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
                <div className="p-4 rounded-full bg-amber-500/10 text-amber-500 mb-4">
                    <Icon name="Lock" className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold font-serif text-slate-900 dark:text-white">Authentication Required</h2>
                <p className="mt-2 text-text-muted max-w-md">
                    Please log in as a Customer or Medical Agent to view your personal account dashboard.
                </p>
                <Link
                    to="/login"
                    className="mt-6 px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-all shadow-md"
                >
                    Log In / Register Account
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
            <Seo title={`${user.name} | Dashboard - Jaya Medical Store`} description="Manage your pharmacy orders, prescriptions, and account settings." />

            {/* Top User Welcome Banner */}
            <div className="glass-card p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border border-border shadow-xl">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl uppercase shadow-inner">
                        {user.name.charAt(0)}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text">{user.name}</h1>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-extrabold tracking-wider ${role === 'agent' ? 'bg-secondary/15 text-secondary' : 'bg-primary/15 text-primary'}`}>
                                {role === 'agent' ? 'Licensed Agent' : 'Verified Customer'}
                            </span>
                        </div>
                        <p className="text-xs text-text-muted mt-0.5">
                            {user.email} • Phone: <span className="font-mono font-semibold text-text">{user.phone || '10-Digit Registered'}</span>
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        logout();
                        navigate('/login');
                    }}
                    className="px-4 py-2.5 rounded-xl border border-red-500/30 text-red-600 dark:text-red-400 font-bold text-xs hover:bg-red-500/10 transition-all flex items-center gap-2"
                >
                    <Icon name="LogOut" className="w-4 h-4" />
                    Sign Out Account
                </button>
            </div>

            {/* Role-Specific View */}
            {role === 'agent' ? (
                <AgentDashboard
                    user={user}
                    agentQueue={agentQueue}
                    agentFilter={agentFilter}
                    setAgentFilter={setAgentFilter}
                    selectedRx={selectedRx}
                    setSelectedRx={setSelectedRx}
                    agentSuggestions={agentSuggestions}
                    setAgentSuggestions={setAgentSuggestions}
                    handleApprovePrescription={handleApprovePrescription}
                    handleRejectPrescription={handleRejectPrescription}
                    handleSaveSuggestion={handleSaveSuggestion}
                />
            ) : (
                <CustomerDashboard
                    userPrescriptions={userPrescriptions}
                    userOrders={userOrders}
                    cartCount={cartCount}
                    setSelectedRx={setSelectedRx}
                />
            )}

            {/* Modal for detailed prescription view */}
            <PrescriptionDetailModal
                selectedRx={selectedRx}
                onClose={() => setSelectedRx(null)}
                onApprove={handleApprovePrescription}
                onReject={handleRejectPrescription}
                onSaveSuggestion={handleSaveSuggestion}
                agentSuggestions={agentSuggestions}
                setAgentSuggestions={setAgentSuggestions}
                isAgent={role === 'agent'}
            />
        </div>
    );
}
