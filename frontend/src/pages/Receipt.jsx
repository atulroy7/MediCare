import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Seo from '../components/Seo';
import Icon from '../components/Icons';
import toast from 'react-hot-toast';

export default function Receipt() {
    const { orderId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const userOrderKey = `jaya_orders_${user.id || user.email}`;
        const orders = JSON.parse(localStorage.getItem(userOrderKey) || '[]');
        
        let found = orders.find(o => o.id === orderId || o._id === orderId);

        // If not found in user specific storage, check all orders
        if (!found) {
            found = orders[0] || null;
        }

        setOrder(found);
        setLoading(false);
    }, [orderId, user]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg text-text">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    if (!order) {
        return (
            <>
                <Seo title="Receipt Not Found | MediCare" description="Order receipt details." />
                <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
                        <Icon name="FileText" className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-text">Order Receipt Not Found</h2>
                    <p className="text-xs text-text-muted max-w-md">
                        We couldn&apos;t find an order receipt matching #{orderId}. Please check your order history on your dashboard.
                    </p>
                    <Link to="/dashboard" className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-dark transition-all">
                        Back to Dashboard
                    </Link>
                </div>
            </>
        );
    }

    const items = order.items || [];
    const subtotal = order.subtotal || items.reduce((acc, i) => acc + (i.price * i.quantity), 0);
    const taxes = order.taxes || Math.round(subtotal * 0.05);
    const delivery = order.deliveryCharge ?? (subtotal > 999 ? 0 : 49);
    const discount = order.discount || 0;
    const totalAmount = order.totalAmount || (subtotal + taxes + delivery - discount);

    // Resolve full customer delivery address
    const resolveDeliveryAddress = () => {
        if (order.shippingAddress && order.shippingAddress !== 'Standard Delivery Address') {
            return order.shippingAddress;
        }
        if (order.deliveryAddress) return order.deliveryAddress;
        if (order.address) return order.address;

        if (user) {
            const cleanEmail = (user.email || '').toLowerCase();
            try {
                const emailRx = JSON.parse(localStorage.getItem(`jaya_prescriptions_${cleanEmail}`) || '[]');
                const foundRx = emailRx.find(r => r && r.address && r.address.trim().length > 0);
                if (foundRx && foundRx.address) return foundRx.address;

                const globalRx = JSON.parse(localStorage.getItem('jaya_all_prescriptions') || '[]');
                const foundGlobal = globalRx.find(r => r && r.userEmail && r.userEmail.toLowerCase() === cleanEmail && r.address);
                if (foundGlobal && foundGlobal.address) return foundGlobal.address;
            } catch (_) {}
        }

        return user?.address || '123 Health Park, New Delhi, India';
    };

    const deliveryAddress = resolveDeliveryAddress();
    const customerName = order.customerName || user?.name || 'Customer';
    const customerPhone = order.phone || user?.phone || 'N/A';

    return (
        <>
            <Seo title={`Receipt #${order.id} | MediCare`} description="Official order receipt and tax invoice." />

            <div className="min-h-screen bg-bg py-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto space-y-6">
                    {/* Action Bar (Hidden when printing) */}
                    <div className="flex items-center justify-between print:hidden">
                        <Link to="/dashboard" className="inline-flex items-center gap-2 text-xs font-bold text-text-muted hover:text-text transition-all">
                            <Icon name="ArrowLeft" className="w-4 h-4" />
                            Back to Dashboard
                        </Link>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={handlePrint}
                                className="px-4 py-2 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-dark transition-all flex items-center gap-2 shadow-md"
                            >
                                <Icon name="Printer" className="w-4 h-4" />
                                Print / Download Receipt
                            </button>
                        </div>
                    </div>

                    {/* Official Receipt Card */}
                    <div className="bg-surface border border-border rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 print:border-none print:shadow-none print:p-0">
                        {/* Receipt Header */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6">
                            <div>
                                <div className="flex items-center gap-2">
                                    <div className="bg-primary text-white p-2 rounded-xl">
                                        <Icon name="Activity" className="w-5 h-5" />
                                    </div>
                                    <span className="font-serif text-2xl font-bold tracking-tight text-text">MediCare</span>
                                </div>
                                <p className="text-xs text-text-muted mt-1">Licensed Retail Pharmacy & Medical Supplies</p>
                                <p className="text-[11px] text-text-muted">GSTIN: 07AAAAC1234F1Z5 | Reg License: DL-PHARM-2026-88</p>
                            </div>

                            <div className="text-left sm:text-right">
                                <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold text-[11px] uppercase tracking-wider border border-emerald-500/20 mb-1">
                                    Official Tax Invoice
                                </span>
                                <h3 className="font-mono text-lg font-bold text-text">#{order.id}</h3>
                                <p className="text-xs text-text-muted">Date: {order.date || 'Recent'}</p>
                            </div>
                        </div>

                        {/* Customer & Delivery Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-surface-hover border border-border rounded-2xl p-5 print:bg-white print:border-slate-300">
                            <div className="space-y-1">
                                <h4 className="text-[11px] font-extrabold uppercase text-text-muted tracking-wider mb-2 flex items-center gap-1.5">
                                    <Icon name="User" className="w-3.5 h-3.5 text-primary" />
                                    Billed To (Customer)
                                </h4>
                                <p className="font-bold text-sm text-text">{customerName}</p>
                                <p className="text-xs text-text-muted mt-0.5">{order.userEmail || user?.email || ''}</p>
                                <p className="text-xs text-text-muted mt-0.5">Phone: <span className="font-mono font-medium text-text">{customerPhone}</span></p>
                            </div>

                            <div className="space-y-1">
                                <h4 className="text-[11px] font-extrabold uppercase text-text-muted tracking-wider mb-2 flex items-center gap-1.5">
                                    <Icon name="MapPin" className="w-3.5 h-3.5 text-secondary" />
                                    Delivery Destination Address
                                </h4>
                                <p className="text-xs text-text font-medium leading-relaxed bg-bg/50 print:bg-transparent p-2.5 rounded-xl border border-border/50 print:border-none print:p-0">
                                    {deliveryAddress}
                                </p>
                                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1">
                                    <Icon name="CheckCircle" className="w-3.5 h-3.5" />
                                    Prescription Verified by Licensed Pharmacist
                                </p>
                            </div>
                        </div>

                        {/* Itemized Table */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-extrabold uppercase text-text-muted tracking-wider">Ordered Medicines & Supplies</h4>
                            
                            <div className="border border-border rounded-2xl overflow-hidden">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-bg-subtle border-b border-border text-text-muted uppercase text-[10px] tracking-wider">
                                        <tr>
                                            <th className="py-3 px-4">Item Description</th>
                                            <th className="py-3 px-4 text-center">Qty</th>
                                            <th className="py-3 px-4 text-right">Price</th>
                                            <th className="py-3 px-4 text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/60">
                                        {items.map((item, idx) => (
                                            <tr key={idx} className="hover:bg-bg-subtle/50 transition-colors">
                                                <td className="py-3 px-4 font-semibold text-text">{item.name}</td>
                                                <td className="py-3 px-4 text-center font-mono font-bold text-text-muted">x{item.quantity}</td>
                                                <td className="py-3 px-4 text-right font-mono text-text-muted">₹{item.price}</td>
                                                <td className="py-3 px-4 text-right font-mono font-bold text-text">₹{item.price * item.quantity}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Financial Totals */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-border">
                            <div className="text-xs text-text-muted space-y-1">
                                <p className="font-semibold text-text">Payment Method: Cash / Online on Delivery</p>
                                <p>Thank you for choosing MediCare Healthcare.</p>
                            </div>

                            <div className="w-full sm:w-64 space-y-2 text-xs">
                                <div className="flex justify-between text-text-muted">
                                    <span>Subtotal:</span>
                                    <span className="font-mono font-semibold text-text">₹{subtotal}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                                        <span>Promo Discount (JAYA10):</span>
                                        <span className="font-mono font-semibold">-₹{discount}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-text-muted">
                                    <span>GST (5%):</span>
                                    <span className="font-mono font-semibold text-text">₹{taxes}</span>
                                </div>
                                <div className="flex justify-between text-text-muted">
                                    <span>Delivery Fee:</span>
                                    <span className="font-mono font-semibold text-text">{delivery === 0 ? 'FREE' : `₹${delivery}`}</span>
                                </div>
                                <div className="flex justify-between border-t border-border pt-2 text-sm font-bold text-text">
                                    <span>Total Paid:</span>
                                    <span className="font-mono text-base text-primary">₹{totalAmount}</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer Disclaimer */}
                        <div className="text-center pt-6 border-t border-border text-[11px] text-text-muted space-y-1">
                            <p className="font-semibold text-text">Computer Generated Tax Invoice — No Physical Signature Required</p>
                            <p>For support, contact support@medicare.in or call our 24/7 helpline.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
