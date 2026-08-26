import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Seo from '../components/Seo';
import Icon from '../components/Icons';
import PaymentGatewayModal from '../components/PaymentGatewayModal';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Cart() {
    const { items, setItemQuantity, removeFromCart, clearCart, subtotal } = useCart();
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);

    const deliveryCharge = subtotal > 999 || subtotal === 0 ? 0 : 49;
    const taxes = Math.round(subtotal * 0.05);
    const [promoCode, setPromoCode] = useState('JAYA10');
    const discount = promoCode === 'JAYA10' ? Math.round(subtotal * 0.1) : 0;
    const total = Math.max(0, subtotal + deliveryCharge + taxes - discount);

    const applyPromo = () => {
        if (promoCode.trim().toUpperCase() === 'JAYA10') {
            toast.success('Promo code applied (10% OFF).');
        } else {
            toast.error('Promo code not recognized.');
        }
    };

    const handleCheckout = () => {
        if (!isAuthenticated || !user) {
            toast.error('Please log in or create an account to complete your order.', {
                duration: 4000,
                icon: '🔒'
            });
            navigate('/login', { state: { from: '/cart' } });
            return;
        }

        if (items.length === 0) {
            toast.error('Your cart is empty.');
            return;
        }

        // Universal Strict Requirement: Orders cannot take place before Medical Agent approval!
        const getUserPrescriptions = (userObj) => {
            if (!userObj) return [];
            const cleanEmail = userObj.email.toLowerCase();

            const globalRx = JSON.parse(localStorage.getItem('jaya_all_prescriptions') || '[]');
            const emailKeyRx = JSON.parse(localStorage.getItem(`jaya_prescriptions_${cleanEmail}`) || '[]');
            const idKeyRx = userObj.id ? JSON.parse(localStorage.getItem(`jaya_prescriptions_${userObj.id}`) || '[]') : [];

            const map = new Map();
            [...globalRx.filter(r => r.userEmail && r.userEmail.toLowerCase() === cleanEmail), ...emailKeyRx, ...idKeyRx].forEach(r => {
                if (r && r.id) map.set(r.id, r);
            });

            return Array.from(map.values());
        };

        const userPrescriptions = getUserPrescriptions(user);

        const currentCartSignature = items.length > 0 
            ? items.map(i => `${i.id}:${i.quantity}`).sort().join('|') 
            : 'empty_cart';

        // Prescription approval must match the specific cart items
        const hasApprovedRxForCurrentCart = userPrescriptions.some(rx => 
            rx.status === 'APPROVED' && (rx.cartSignature === currentCartSignature || rx.cartSignature === 'general_prescription')
        );

        const hasPendingRx = userPrescriptions.some(rx => rx.status === 'PENDING_VERIFICATION');
        const hasRejectedRx = userPrescriptions.some(rx => rx.status === 'REJECTED');

        if (!hasApprovedRxForCurrentCart) {
            if (userPrescriptions.length === 0) {
                toast.error('ORDER BLOCKED: Medical Agent approval is mandatory for your cart items! Please upload your doctor prescription first.', { duration: 6000 });
                navigate('/prescription');
                return;
            }

            if (hasRejectedRx && !hasPendingRx) {
                toast.error('ORDER BLOCKED: Your prescription was REJECTED by the Medical Agent. Order cannot take place until you upload a valid prescription.', { duration: 6000 });
                return;
            }

            if (hasPendingRx) {
                toast.error('ORDER BLOCKED: Your prescription is PENDING Medical Agent approval for this cart. Orders CANNOT take place before agent approval.', { duration: 6000 });
                return;
            }

            toast.error('ORDER BLOCKED: Medicines in cart changed! Medical Agent approval is required for this specific combination of medicines.', { duration: 6000 });
            return;
        }

        // Open Payment Gateway Modal
        setIsPaymentOpen(true);
    };

    const handlePaymentSuccess = (paymentDetails) => {
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
            shippingAddress: user.address || 'Standard Delivery Address'
        };

        const userOrderKey = `jaya_orders_${user.id || user.email}`;
        const existingOrders = JSON.parse(localStorage.getItem(userOrderKey) || '[]');
        localStorage.setItem(userOrderKey, JSON.stringify([newOrder, ...existingOrders]));

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
                                    <button type="button" onClick={clearCart} className="text-sm font-medium text-text-muted hover:text-primary transition-colors">
                                        Clear cart
                                    </button>
                                </div>

                                <div className="space-y-4 text-sm">
                                    <SummaryRow label="Subtotal" value={`₹${subtotal}`} />
                                    <SummaryRow label="Delivery charge" value={deliveryCharge ? `₹${deliveryCharge}` : 'Free'} />
                                    <SummaryRow label="GST (5%)" value={`₹${taxes}`} />
                                    
                                    {discount > 0 && (
                                        <SummaryRow label="Promo discount" value={`-₹${discount}`} valueClass="text-green-500 font-medium" />
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
                                    <div className="flex gap-3">
                                        <input
                                            value={promoCode}
                                            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                            placeholder="Enter code (e.g. JAYA10)"
                                            className="w-full rounded-xl border border-border bg-bg px-4 py-3 outline-none focus:border-primary transition-colors text-sm placeholder:text-text-muted/60"
                                        />
                                        <button
                                            type="button"
                                            onClick={applyPromo}
                                            className="glass-button-secondary px-6"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                </div>

                                {/* Universal Agent Approval Status Alert Banner for Cart */}
                                {user && (
                                    (() => {
                                        const getUserPrescriptions = (userObj) => {
                                            if (!userObj) return [];
                                            const cleanEmail = userObj.email.toLowerCase();

                                            const globalRx = JSON.parse(localStorage.getItem('jaya_all_prescriptions') || '[]');
                                            const emailKeyRx = JSON.parse(localStorage.getItem(`jaya_prescriptions_${cleanEmail}`) || '[]');
                                            const idKeyRx = userObj.id ? JSON.parse(localStorage.getItem(`jaya_prescriptions_${userObj.id}`) || '[]') : [];

                                            const map = new Map();
                                            [...globalRx.filter(r => r.userEmail && r.userEmail.toLowerCase() === cleanEmail), ...emailKeyRx, ...idKeyRx].forEach(r => {
                                                if (r && r.id) map.set(r.id, r);
                                            });

                                            return Array.from(map.values());
                                        };

                                        const currentCartSignature = items.length > 0 
                                            ? items.map(i => `${i.id}:${i.quantity}`).sort().join('|') 
                                            : 'empty_cart';

                                        const userPrescriptions = getUserPrescriptions(user);
                                        const hasApprovedForThisCart = userPrescriptions.some(rx => 
                                            rx.status === 'APPROVED' && (rx.cartSignature === currentCartSignature || rx.cartSignature === 'general_prescription')
                                        );
                                        const hasApprovedOther = userPrescriptions.some(rx => rx.status === 'APPROVED');
                                        const hasRejected = userPrescriptions.some(rx => rx.status === 'REJECTED');
                                        const hasPending = userPrescriptions.some(rx => rx.status === 'PENDING_VERIFICATION');

                                        if (hasApprovedForThisCart) {
                                            return (
                                                <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                                                    <Icon name="CheckCircle" className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                                    <span className="font-bold">Medical Agent Clearance Verified & Approved for this Cart ✓</span>
                                                </div>
                                            );
                                        }

                                        if (hasApprovedOther && !hasApprovedForThisCart) {
                                            return (
                                                <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs space-y-1">
                                                    <p className="font-bold flex items-center gap-1.5 text-sm">
                                                        <Icon name="AlertTriangle" className="w-4 h-4 text-amber-500" />
                                                        Cart Medicines Modified!
                                                    </p>
                                                    <p className="leading-relaxed opacity-90">
                                                        You changed the medicines in your cart. A Medical Agent must review and approve a prescription for this updated list of medicines.
                                                    </p>
                                                    <Link to="/prescription" className="inline-block mt-2 font-bold text-amber-700 dark:text-amber-300 underline">
                                                        Upload Prescription for New Cart Items →
                                                    </Link>
                                                </div>
                                            );
                                        }

                                        if (hasRejected && !hasPending) {
                                            return (
                                                <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-700 dark:text-red-300 text-xs space-y-1">
                                                    <p className="font-bold flex items-center gap-1.5 text-sm">
                                                        <Icon name="XCircle" className="w-4 h-4 text-red-500" />
                                                        Prescription REJECTED by Medical Agent
                                                    </p>
                                                    <p className="leading-relaxed opacity-90">
                                                        Your doctor note was rejected by the Medical Agent. Order placement is disabled. Please upload a new valid prescription.
                                                    </p>
                                                    <Link to="/prescription" className="inline-block mt-2 font-bold text-red-600 dark:text-red-400 underline">
                                                        Upload New Valid Prescription →
                                                    </Link>
                                                </div>
                                            );
                                        }

                                        if (hasPending) {
                                            return (
                                                <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs space-y-1">
                                                    <p className="font-bold flex items-center gap-1.5 text-sm">
                                                        <Icon name="Clock" className="w-4 h-4 text-amber-500" />
                                                        Prescription Awaiting Agent Approval
                                                    </p>
                                                    <p className="leading-relaxed opacity-90">
                                                        Your prescription is currently under review by a Medical Agent. Order placement will unlock automatically once the agent approves your doctor note.
                                                    </p>
                                                </div>
                                            );
                                        }

                                        return (
                                            <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 text-primary text-xs space-y-1">
                                                <p className="font-bold flex items-center gap-1.5 text-sm">
                                                    <Icon name="FileText" className="w-4 h-4" />
                                                    Medical Agent Approval Mandatory
                                                </p>
                                                <p className="leading-relaxed text-text-muted">
                                                    Medical Agent approval is mandatory before any order can take place. You must upload a doctor prescription and get agent clearance first.
                                                </p>
                                                <Link to="/prescription" className="inline-block mt-1 font-bold text-primary underline">
                                                    Upload Prescription for Clearance →
                                                </Link>
                                            </div>
                                        );
                                    })()
                                )}

                                {(() => {
                                    const getUserPrescriptions = (userObj) => {
                                        if (!userObj) return [];
                                        const cleanEmail = userObj.email.toLowerCase();

                                        const globalRx = JSON.parse(localStorage.getItem('jaya_all_prescriptions') || '[]');
                                        const emailKeyRx = JSON.parse(localStorage.getItem(`jaya_prescriptions_${cleanEmail}`) || '[]');
                                        const idKeyRx = userObj.id ? JSON.parse(localStorage.getItem(`jaya_prescriptions_${userObj.id}`) || '[]') : [];

                                        const map = new Map();
                                        [...globalRx.filter(r => r.userEmail && r.userEmail.toLowerCase() === cleanEmail), ...emailKeyRx, ...idKeyRx].forEach(r => {
                                            if (r && r.id) map.set(r.id, r);
                                        });

                                        return Array.from(map.values());
                                    };

                                    const currentCartSignature = items.length > 0 
                                        ? items.map(i => `${i.id}:${i.quantity}`).sort().join('|') 
                                        : 'empty_cart';

                                    const userPrescriptions = getUserPrescriptions(user);
                                    const hasApprovedForThisCart = userPrescriptions.some(rx => 
                                        rx.status === 'APPROVED' && (rx.cartSignature === currentCartSignature || rx.cartSignature === 'general_prescription')
                                    );
                                    const isBlocked = isAuthenticated && !hasApprovedForThisCart;

                                    return (
                                        <button
                                            type="button"
                                            onClick={handleCheckout}
                                            disabled={isBlocked}
                                            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                                                isBlocked 
                                                    ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-border cursor-not-allowed opacity-70 shadow-none' 
                                                    : 'glass-button-primary'
                                            }`}
                                        >
                                            {isBlocked ? (
                                                <>
                                                    <Icon name="Lock" className="h-4 w-4 text-amber-500" />
                                                    Order Blocked: Awaiting Agent Approval
                                                </>
                                            ) : (
                                                <>
                                                    {isAuthenticated ? 'Place Order Now' : 'Sign In to Complete Order'}
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
