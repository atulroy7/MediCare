import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Seo from '../components/Seo';
import Icon from '../components/Icons';
import PaymentGatewayModal from '../components/PaymentGatewayModal';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getApiBaseUrl } from '../services/api';
import toast from 'react-hot-toast';

// Read all prescriptions for a user from storage sources strictly scoped to the user
export function readPrescriptionsForUser(userObj) {
    if (!userObj) return [];
    const cleanEmail = (userObj.email || '').toLowerCase().trim();
    if (!cleanEmail) return [];
    const map = new Map();

    const addRxItem = (r) => {
        if (!r || typeof r !== 'object') return;
        const rxEmail = (r.userEmail || r.email || '').toLowerCase().trim();
        // Strict isolation: must match current user's email
        if (rxEmail !== cleanEmail) return;

        const keyId = r.id || r.rxId || r._id;
        if (!keyId) return;

        const existing = map.get(keyId);
        const status = r.status || (existing ? existing.status : 'PENDING_VERIFICATION');

        map.set(keyId, {
            ...(existing || {}),
            ...r,
            id: keyId,
            status
        });
    };

    try {
        const emailRx = JSON.parse(localStorage.getItem(`jaya_prescriptions_${cleanEmail}`) || '[]');
        const globalRx = JSON.parse(localStorage.getItem('jaya_all_prescriptions') || '[]');

        if (Array.isArray(emailRx)) emailRx.forEach(addRxItem);
        if (Array.isArray(globalRx)) globalRx.forEach(addRxItem);
    } catch (_) {}

    try {
        const sessionRx = JSON.parse(sessionStorage.getItem('jaya_session_prescriptions') || '[]');
        if (Array.isArray(sessionRx)) sessionRx.forEach(addRxItem);
    } catch (_) {}

    return Array.from(map.values()).sort((a, b) => {
        const tA = a.timestamp || (a.createdAt ? new Date(a.createdAt).getTime() : 0);
        const tB = b.timestamp || (b.createdAt ? new Date(b.createdAt).getTime() : 0);
        if (tA && tB && tA !== tB) return tB - tA;
        return (b.id || '').localeCompare(a.id || '');
    });
}

export default function Cart() {
    const { items, setItemQuantity, removeFromCart, clearCart, subtotal } = useCart();
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [promoCode, setPromoCode] = useState('');
    const [appliedPromo, setAppliedPromo] = useState(null);

    // Prescription status as proper React STATE — refreshed on every sync event
    const [rxStatus, setRxStatus] = useState({ hasApproved: false, hasPending: false, hasRejected: false, loaded: false });

    const refreshRxStatus = async () => {
        if (!user) {
            setRxStatus({ hasApproved: false, hasPending: false, hasRejected: false, loaded: true });
            return;
        }

        const cleanEmail = (user.email || '').toLowerCase().trim();
        let prescriptions = readPrescriptionsForUser(user);

        // Fetch real-time prescriptions from backend API as source of truth
        try {
            const backendUrl = getApiBaseUrl();
            const res = await fetch(`${backendUrl}/prescriptions/my-prescriptions?email=${encodeURIComponent(cleanEmail)}`);
            const data = await res.json();
            if (res.ok && data.success && Array.isArray(data.prescriptions) && data.prescriptions.length > 0) {
                const key = `jaya_prescriptions_${cleanEmail}`;
                const apiMapped = data.prescriptions.map(p => ({
                    id: p.rxId || p.id || p._id,
                    rxId: p.rxId || p.id || p._id,
                    status: p.status,
                    patient: p.patientName || p.patient,
                    userEmail: (p.userEmail || cleanEmail).toLowerCase().trim(),
                    filename: p.filename,
                    doctor: p.doctor,
                    address: p.address,
                    phone: p.phone,
                    createdAt: p.createdAt
                }));
                localStorage.setItem(key, JSON.stringify(apiMapped));
                prescriptions = readPrescriptionsForUser(user);
            }
        } catch (err) {
            console.warn('[Cart] API rx status fetch warning:', err.message);
        }

        console.log('[Cart] Prescriptions found for user:', prescriptions.map(p => `${p.id}=${p.status}`));

        // Active unfulfilled prescription dictates current eligibility
        const activeRx = prescriptions.find(rx => rx.status !== 'FULFILLED') || prescriptions[0];
        const hasApproved = Boolean(activeRx && activeRx.status === 'APPROVED');
        const hasPending = Boolean(activeRx && activeRx.status === 'PENDING_VERIFICATION');
        const hasRejected = Boolean(activeRx && activeRx.status === 'REJECTED');

        setRxStatus({
            hasApproved,
            hasPending,
            hasRejected,
            activeRx,
            prescriptionsCount: prescriptions.length,
            loaded: true,
        });
    };

    // DEV UTILITY: Wipe ALL prescription data so you can test the flow from scratch
    const clearAllPrescriptionData = () => {
        const keysToDelete = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('jaya_')) keysToDelete.push(key);
        }
        keysToDelete.forEach(k => localStorage.removeItem(k));
        try { sessionStorage.removeItem('jaya_session_prescriptions'); } catch (_) {}
        window.dispatchEvent(new Event('jaya_prescription_update'));
        toast.success('All prescription data cleared. Upload a new prescription to start fresh.', { duration: 5000, icon: '🗑️' });
    };

    useEffect(() => {
        refreshRxStatus();
        const handleSync = () => refreshRxStatus();
        window.addEventListener('jaya_prescription_update', handleSync);
        window.addEventListener('storage', handleSync);
        return () => {
            window.removeEventListener('jaya_prescription_update', handleSync);
            window.removeEventListener('storage', handleSync);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const isFreeDelivery = subtotal > 999 || subtotal === 0 || appliedPromo === 'FREEDEL';
    const deliveryCharge = isFreeDelivery ? 0 : 49;
    const taxes = Math.round(subtotal * 0.05);
    const discount = appliedPromo === 'JAYA10' ? Math.round(subtotal * 0.1) : 0;
    const total = Math.max(0, subtotal + deliveryCharge + taxes - discount);

    const applyPromo = () => {
        const code = promoCode.trim().toUpperCase();
        if (code === 'JAYA10') {
            setAppliedPromo('JAYA10');
            toast.success('Promo code JAYA10 applied — 10% OFF!');
        } else if (code === 'FREEDEL') {
            setAppliedPromo('FREEDEL');
            toast.success('Promo code FREEDEL applied — Free Delivery!');
        } else if (code === '') {
            toast.error('Please enter a promo code.');
        } else {
            toast.error('Promo code not recognized.');
        }
    };

    const removePromo = () => {
        setAppliedPromo(null);
        setPromoCode('');
        toast('Promo code removed.', { icon: '🗑️' });
    };

    const handleCheckout = async () => {
        if (!isAuthenticated || !user) {
            toast.error('Please log in to complete your order.', { duration: 4000, icon: '🔒' });
            navigate('/login', { state: { from: '/cart' } });
            return;
        }
        if (items.length === 0) {
            toast.error('Your cart is empty.');
            return;
        }

        const cleanEmail = (user.email || '').toLowerCase().trim();
        let freshPrescriptions = readPrescriptionsForUser(user);

        // Fetch fresh real-time status from backend API as source of truth
        try {
            const backendUrl = getApiBaseUrl();
            const res = await fetch(`${backendUrl}/prescriptions/my-prescriptions?email=${encodeURIComponent(cleanEmail)}`);
            const data = await res.json();
            if (res.ok && data.success && Array.isArray(data.prescriptions) && data.prescriptions.length > 0) {
                const key = `jaya_prescriptions_${cleanEmail}`;
                const apiMapped = data.prescriptions.map(p => ({
                    id: p.rxId || p._id || p.id,
                    rxId: p.rxId || p._id || p.id,
                    _id: p._id || p.rxId || p.id,
                    status: p.status,
                    patient: p.patientName || p.patient,
                    userEmail: (p.userEmail || cleanEmail).toLowerCase().trim(),
                    filename: p.filename,
                    doctor: p.doctor,
                    address: p.address,
                    phone: p.phone,
                    createdAt: p.createdAt
                }));
                localStorage.setItem(key, JSON.stringify(apiMapped));
                freshPrescriptions = readPrescriptionsForUser(user);
            }
        } catch (err) {
            console.warn('[Cart] Checkout API rx sync warning:', err.message);
        }

        const activeRx = freshPrescriptions.find(rx => rx.status !== 'FULFILLED') || freshPrescriptions[0];
        const isApproved = Boolean(activeRx && activeRx.status === 'APPROVED');
        console.log('[Cart] Checkout attempt — active rx:', activeRx ? `${activeRx.id}=${activeRx.status}` : 'None');

        if (!isApproved) {
            if (activeRx && activeRx.status === 'PENDING_VERIFICATION') {
                toast.error('🔒 Order Blocked: Prescription is PENDING agent review. Wait for Medical Agent approval.', { duration: 6000 });
                return;
            }
            if (activeRx && activeRx.status === 'REJECTED') {
                toast.error('🔒 Order Blocked: Prescription was REJECTED. Upload a new valid prescription.', { duration: 6000 });
                navigate('/prescription');
                return;
            }
            toast.error('🔒 Order Blocked: Upload a doctor prescription and get Medical Agent approval first!', { duration: 6000 });
            navigate('/prescription');
            return;
        }
        setIsPaymentOpen(true);
    };

    const handlePaymentSuccess = (paymentDetails) => {
        const cleanEmail = (user.email || '').toLowerCase().trim();
        const userPrescriptions = readPrescriptionsForUser(user);
        const approvedRx = userPrescriptions.find(r => r.status === 'APPROVED');
        const shippingAddress = approvedRx?.address || user?.address || '123 Health Park, New Delhi, India';
        const customerName = approvedRx?.patient || approvedRx?.patientName || user?.name || 'Customer';
        const phone = approvedRx?.phone || user?.phone || '';

        // Save completed order to user account
        const newOrder = {
            id: 'ORD-' + Math.floor(10000 + Math.random() * 90000),
            date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            itemsCount: items.reduce((sum, item) => sum + item.quantity, 0),
            subtotal,
            deliveryCharge,
            taxes,
            discount,
            totalAmount: total,
            status: paymentDetails.status === 'PAID' ? 'PROCESSING' : 'PAYMENT_PENDING_COD',
            paymentMethod: paymentDetails.method,
            txnId: paymentDetails.txnId,
            items: items.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })),
            shippingAddress,
            customerName,
            phone,
            userEmail: cleanEmail,
            prescriptionId: approvedRx?.id || null
        };

        const userOrderKey = `jaya_orders_${user.id || cleanEmail}`;
        const existingOrders = JSON.parse(localStorage.getItem(userOrderKey) || '[]');
        localStorage.setItem(userOrderKey, JSON.stringify([newOrder, ...existingOrders]));

        // Fulfill / consume the approved prescription so future orders require a new prescription approval
        if (approvedRx && approvedRx.id) {
            const rxId = approvedRx.id;
            try {
                // 1. Update email storage
                const emailKey = `jaya_prescriptions_${cleanEmail}`;
                const currentEmailRx = JSON.parse(localStorage.getItem(emailKey) || '[]');
                const updatedEmailRx = currentEmailRx.map(p => 
                    (p.id === rxId || p.rxId === rxId || p._id === rxId) ? { ...p, status: 'FULFILLED', usedInOrder: newOrder.id } : p
                );
                localStorage.setItem(emailKey, JSON.stringify(updatedEmailRx));

                // 2. Update global list
                const currentAllRx = JSON.parse(localStorage.getItem('jaya_all_prescriptions') || '[]');
                const updatedAllRx = currentAllRx.map(p => 
                    (p.id === rxId || p.rxId === rxId || p._id === rxId) ? { ...p, status: 'FULFILLED', usedInOrder: newOrder.id } : p
                );
                localStorage.setItem('jaya_all_prescriptions', JSON.stringify(updatedAllRx));

                // 3. Update session storage
                const sessionRx = JSON.parse(sessionStorage.getItem('jaya_session_prescriptions') || '[]');
                const updatedSession = sessionRx.map(p => 
                    (p.id === rxId || p.rxId === rxId || p._id === rxId) ? { ...p, status: 'FULFILLED', usedInOrder: newOrder.id } : p
                );
                sessionStorage.setItem('jaya_session_prescriptions', JSON.stringify(updatedSession));

                // 4. Update backend API
                const backendUrl = getApiBaseUrl();
                fetch(`${backendUrl}/prescriptions/${rxId}/status`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: 'FULFILLED' })
                }).catch(() => {});
            } catch (_) {}

            window.dispatchEvent(new Event('jaya_prescription_update'));
            window.dispatchEvent(new Event('storage'));
        }

        clearCart();
        setIsPaymentOpen(false);
        toast.success(`Payment Approved! Order #${newOrder.id} placed successfully.`, { duration: 2000 });
        navigate(`/receipt/${newOrder.id}`);
    };

    if (!items.length) {
        return (
            <>
                <Seo title="Cart | Jaya Medical Store" description="Review the items in your pharmacy cart." />
                <section className="min-h-[calc(100vh-72px)] bg-lofi relative flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-bg/80 dark:bg-bg/90 backdrop-blur-[50px] z-0" />
                    
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card max-w-md w-full p-12 text-center relative z-10"
                    >
                        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary mb-6">
                            <Icon name="ShoppingCart" className="h-10 w-10" />
                        </div>
                        <h1 className="font-serif text-3xl font-semibold text-text mb-3">Your cart is empty</h1>
                        <p className="text-text-muted mb-8 leading-relaxed">
                            {isAuthenticated 
                                ? `Welcome ${user.name}! Your account cart is currently empty. Browse our medicines to get started.`
                                : 'Log in or browse our collection of medicines and wellness essentials to start your order.'
                            }
                        </p>
                        <div className="space-y-3">
                            <Link to="/products" className="glass-button-primary w-full py-3">
                                Browse Products
                            </Link>
                            {!isAuthenticated && (
                                <Link to="/login" className="block w-full py-3 rounded-xl border border-border text-text font-semibold text-sm hover:bg-bg-subtle transition-all">
                                    Sign In to Your Account
                                </Link>
                            )}
                        </div>
                    </motion.div>
                </section>
            </>
        );
    }

    return (
        <>
            <Seo title="Cart | Jaya Medical Store" description="Review items, apply a promo code, and proceed to checkout." />
            
            <div className="min-h-[calc(100vh-72px)] bg-surface relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-96 bg-primary/10 blur-[100px] pointer-events-none" />
                
                <div className="mx-auto max-w-7xl px-4 py-12 md:py-20 lg:px-8 relative z-10">

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                        <div>
                            <span className="kicker">Checkout</span>
                            <h1 className="display-heading !mb-2">Review your order</h1>
                        </div>

                        {!isAuthenticated && (
                            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-medium flex items-center gap-2">
                                <Icon name="Lock" className="w-4 h-4 flex-shrink-0" />
                                <span>Log in required to complete purchase</span>
                            </div>
                        )}
                    </motion.div>

                    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] xl:grid-cols-[1.2fr_0.8fr]">
                        <div className="space-y-4">
                            <AnimatePresence mode="popLayout">
                                {items.map((item) => (
                                    <motion.div 
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.3 }}
                                        key={item.id} 
                                        className="glass-card flex flex-col gap-6 p-5 sm:flex-row relative group"
                                    >
                                        <div className="relative h-40 w-full sm:h-32 sm:w-32 flex-shrink-0 overflow-hidden rounded-2xl bg-bg">
                                            <img src={item.image} alt={item.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        </div>
                                        
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">{item.category}</p>
                                                    <h2 className="font-serif text-xl font-medium text-text line-clamp-1">{item.name}</h2>
                                                    <p className="text-sm text-text-muted mt-1">{item.brand}</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        removeFromCart(item.id);
                                                        toast.success(`${item.name} removed`);
                                                    }}
                                                    className="p-2 text-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                                                    aria-label="Remove item"
                                                >
                                                    <Icon name="Trash2" className="h-5 w-5" />
                                                </button>
                                            </div>
                                            
                                            <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
                                                <div>
                                                    <p className="text-xl font-bold text-text">₹{item.price}</p>
                                                    <p className="text-xs text-text-muted mt-0.5">MRP ₹{item.mrp}</p>
                                                </div>
                                                
                                                <div className="flex items-center rounded-xl border border-border bg-bg/50 p-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => setItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                        className="p-1.5 hover:bg-surface rounded-lg transition-colors text-text-muted hover:text-text"
                                                        aria-label="Decrease quantity"
                                                    >
                                                        <Icon name="Minus" className="h-4 w-4" />
                                                    </button>
                                                    <span className="w-10 text-center text-sm font-semibold text-text">{item.quantity}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => setItemQuantity(item.id, item.quantity + 1)}
                                                        className="p-1.5 hover:bg-surface rounded-lg transition-colors text-text-muted hover:text-text"
                                                        aria-label="Increase quantity"
                                                    >
                                                        <Icon name="Plus" className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="space-y-6 lg:sticky lg:top-28 h-fit"
                        >
                            <div className="glass-card p-6 md:p-8">
                                <div className="flex items-center justify-between border-b border-border pb-6 mb-6">
                                    <h2 className="font-serif text-2xl font-semibold text-text">Order summary</h2>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (window.confirm('Remove all items from your cart? This cannot be undone.')) {
                                                clearCart();
                                                toast('Cart cleared.', { icon: '🗑️' });
                                            }
                                        }}
                                        className="text-sm font-medium text-text-muted hover:text-red-500 transition-colors"
                                    >
                                        Clear cart
                                    </button>
                                </div>

                                <div className="space-y-4 text-sm">
                                    <SummaryRow label="Subtotal" value={`₹${subtotal}`} />
                                    <SummaryRow
                                        label="Delivery charge"
                                        value={deliveryCharge ? `₹${deliveryCharge}` : 'Free'}
                                        valueClass={isFreeDelivery && subtotal > 0 ? 'text-green-500 font-medium' : 'text-text'}
                                    />
                                    <SummaryRow label="GST (5%)" value={`₹${taxes}`} />

                                    {discount > 0 && (
                                        <SummaryRow label="Promo discount (JAYA10)" value={`-₹${discount}`} valueClass="text-green-500 font-medium" />
                                    )}
                                    {appliedPromo === 'FREEDEL' && (
                                        <SummaryRow label="Free delivery (FREEDEL)" value="-₹49 saved" valueClass="text-green-500 font-medium" />
                                    )}
                                    
                                    <div className="border-t border-border pt-4 mt-6">
                                        <div className="flex items-center justify-between">
                                            <span className="text-base font-semibold text-text">Total</span>
                                            <span className="font-serif text-3xl font-bold text-text">₹{total}</span>
                                        </div>
                                        <p className="text-xs text-text-muted mt-1 text-right">Inclusive of all taxes</p>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card p-6 md:p-8 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-text mb-2">
                                        Promo code
                                    </label>

                                    {appliedPromo ? (
                                        <div className="flex items-center justify-between rounded-xl border border-green-500/40 bg-green-500/10 px-4 py-3">
                                            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                                <Icon name="Tag" className="w-4 h-4" />
                                                <span className="text-sm font-bold tracking-wider">{appliedPromo}</span>
                                                <span className="text-xs text-green-600/70 dark:text-green-400/70">
                                                    {appliedPromo === 'JAYA10' ? '— 10% OFF' : '— Free Delivery'}
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={removePromo}
                                                className="text-xs text-text-muted hover:text-red-500 transition-colors font-medium"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-3">
                                            <input
                                                value={promoCode}
                                                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                                placeholder="Enter code (e.g. JAYA10)"
                                                className="w-full rounded-xl border border-border bg-bg px-4 py-3 outline-none focus:border-primary transition-colors text-sm placeholder:text-text-muted/60"
                                                onKeyDown={(e) => e.key === 'Enter' && applyPromo()}
                                            />
                                            <button
                                                type="button"
                                                onClick={applyPromo}
                                                className="glass-button-secondary px-6"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                    )}

                                    {!appliedPromo && (
                                        <div className="mt-2.5 flex flex-wrap gap-2">
                                            <button
                                                type="button"
                                                onClick={() => { setPromoCode('JAYA10'); }}
                                                className="text-xs px-3 py-1 rounded-full border border-border text-text-muted hover:border-primary hover:text-primary transition-colors"
                                            >
                                                🏷️ JAYA10 — 10% off
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => { setPromoCode('FREEDEL'); }}
                                                className="text-xs px-3 py-1 rounded-full border border-border text-text-muted hover:border-primary hover:text-primary transition-colors"
                                            >
                                                🚚 FREEDEL — Free delivery
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Prescription Approval Status Banner — driven by React state, always fresh */}
                                {isAuthenticated && rxStatus.loaded && (
                                    rxStatus.hasApproved ? (
                                        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs space-y-1.5">
                                            <div className="flex items-center gap-2">
                                                <Icon name="CheckCircle" className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                                <span className="font-bold text-sm">Doctor Prescription Verified &amp; Cleared ✓</span>
                                            </div>
                                            <p className="leading-relaxed opacity-95">
                                                Clearance verified for: <span className="font-semibold text-text font-mono">{items.map(i => `${i.name} (x${i.quantity})`).join(', ')}</span>. You can place your order now!
                                            </p>
                                        </div>
                                    ) : rxStatus.hasPending ? (
                                        <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs space-y-1.5">
                                            <p className="font-bold flex items-center gap-1.5 text-sm">
                                                <Icon name="Clock" className="w-4 h-4 text-amber-500" />
                                                Prescription Awaiting Doctor / Agent Review
                                            </p>
                                            <p className="leading-relaxed opacity-90">
                                                Your uploaded prescription is under review for: <span className="font-semibold text-text font-mono">{items.map(i => `${i.name} (x${i.quantity})`).join(', ')}</span>. Order placement will unlock automatically once verified.
                                            </p>
                                        </div>
                                    ) : rxStatus.hasRejected ? (
                                        <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-700 dark:text-red-300 text-xs space-y-1.5">
                                            <p className="font-bold flex items-center gap-1.5 text-sm">
                                                <Icon name="XCircle" className="w-4 h-4 text-red-500" />
                                                Prescription REJECTED by Medical Agent
                                            </p>
                                            <p className="leading-relaxed opacity-90">
                                                Your prescription was rejected. Please upload a valid doctor prescription authorizing: <span className="font-semibold text-text font-mono">{items.map(i => `${i.name} (x${i.quantity})`).join(', ')}</span>.
                                            </p>
                                            <Link 
                                                to="/prescription" 
                                                state={{ cartMedicines: items.map(i => `${i.name} (x${i.quantity})`).join(', ') }}
                                                className="inline-flex items-center gap-1.5 mt-1 font-bold text-red-600 dark:text-red-400 underline"
                                            >
                                                Upload New Prescription →
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 text-primary text-xs space-y-2">
                                            <p className="font-bold flex items-center gap-1.5 text-sm">
                                                <Icon name="FileText" className="w-4 h-4" />
                                                Doctor Prescription Verification Required
                                            </p>
                                            <p className="leading-relaxed text-text-muted">
                                                Under Indian drug regulations, a doctor prescription is mandatory to order: <span className="font-semibold text-text font-mono">{items.map(i => `${i.name} (x${i.quantity})`).join(', ')}</span>. Upload your prescription for doctor clearance.
                                            </p>
                                            <Link 
                                                to="/prescription" 
                                                state={{ cartMedicines: items.map(i => `${i.name} (x${i.quantity})`).join(', ') }}
                                                className="inline-flex items-center gap-1.5 font-bold text-primary hover:underline bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20 transition-all hover:bg-primary/20"
                                            >
                                                Upload Prescription for these items →
                                            </Link>
                                        </div>
                                    )
                                )}

                                {/* Checkout Button — uses rxStatus state, not inline reads */}
                                {(() => {
                                    const isBlocked = !isAuthenticated || !rxStatus.hasApproved;
                                    return (
                                        <button
                                            type="button"
                                            onClick={handleCheckout}
                                            disabled={isBlocked}
                                            style={{ pointerEvents: isBlocked ? 'none' : 'auto' }}
                                            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                                                isBlocked
                                                    ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-border cursor-not-allowed opacity-70 shadow-none select-none'
                                                    : 'glass-button-primary'
                                            }`}
                                        >
                                            {isBlocked ? (
                                                <>
                                                    <Icon name="Lock" className="h-4 w-4 text-amber-500" />
                                                    {!isAuthenticated ? 'Sign In Required' : 'Awaiting Agent Approval'}
                                                </>
                                            ) : (
                                                <>
                                                    Place Order Now
                                                    <Icon name="ArrowRight" className="h-4 w-4 ml-1" />
                                                </>
                                            )}
                                        </button>
                                    );
                                })()}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <PaymentGatewayModal
                isOpen={isPaymentOpen}
                onClose={() => setIsPaymentOpen(false)}
                totalAmount={total}
                cartItems={items}
                onPaymentSuccess={handlePaymentSuccess}
            />
        </>
    );
}

function SummaryRow({ label, value, valueClass = "text-text" }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-text-muted">{label}</span>
            <span className={`font-medium ${valueClass}`}>{value}</span>
        </div>
    );
}
