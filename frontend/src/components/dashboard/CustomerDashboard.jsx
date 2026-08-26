import { Link } from 'react-router-dom';
import Icon from '../Icons';

export default function CustomerDashboard({
    userPrescriptions,
    userOrders,
    cartCount,
    setSelectedRx,
}) {
    return (
        <div className="space-y-8">
            {/* Quick Action / Stats Overview Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm space-y-1">
                    <div className="flex items-center justify-between text-xs text-text-muted">
                        <span>Cart Active Items</span>
                        <Icon name="ShoppingCart" className="w-4 h-4 text-primary" />
                    </div>
                    <p className="font-serif font-bold text-2xl text-text">{cartCount}</p>
                    <Link to="/cart" className="text-[11px] text-primary hover:underline font-medium inline-block mt-1">
                        View Cart & Checkout →
                    </Link>
                </div>

                <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm space-y-1">
                    <div className="flex items-center justify-between text-xs text-text-muted">
                        <span>Uploaded Prescriptions</span>
                        <Icon name="FileText" className="w-4 h-4 text-secondary" />
                    </div>
                    <p className="font-serif font-bold text-2xl text-text">{userPrescriptions.length}</p>
                    <Link to="/prescription" className="text-[11px] text-secondary hover:underline font-medium inline-block mt-1">
                        Upload New Prescription →
                    </Link>
                </div>

                <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm space-y-1">
                    <div className="flex items-center justify-between text-xs text-text-muted">
                        <span>Orders Placed</span>
                        <Icon name="Package" className="w-4 h-4 text-emerald-500" />
                    </div>
                    <p className="font-serif font-bold text-2xl text-text">{userOrders.length}</p>
                    <p className="text-[11px] text-text-muted">Pharmacy Orders History</p>
                </div>

                <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm space-y-1">
                    <div className="flex items-center justify-between text-xs text-text-muted">
                        <span>Account Security</span>
                        <Icon name="ShieldCheck" className="w-4 h-4 text-emerald-500" />
                    </div>
                    <p className="font-serif font-bold text-sm text-emerald-600 mt-1">Verified Customer</p>
                    <p className="text-[11px] text-text-muted">HIPAA Compliant Data Protection</p>
                </div>
            </div>

            {/* Prescriptions Status & Advisory Cards */}
            <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6">
                    <div>
                        <h2 className="text-xl font-bold font-serif text-slate-900 dark:text-white flex items-center gap-2">
                            <Icon name="FileText" className="w-6 h-6 text-primary" />
                            Your Prescription Audit & Pharmacist Notes
                        </h2>
                        <p className="text-xs text-text-muted mt-1">
                            Track verification progress of your medical uploads and view dosage advice from licensed pharmacists.
                        </p>
                    </div>

                    <Link
                        to="/prescription"
                        className="px-4 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary/90 transition-all flex items-center gap-2 shadow-md"
                    >
                        <Icon name="Upload" className="w-4 h-4" />
                        Upload Prescription
                    </Link>
                </div>

                {userPrescriptions.length === 0 ? (
                    <div className="text-center py-10 border-2 border-dashed border-border rounded-2xl space-y-3">
                        <Icon name="FileText" className="w-12 h-12 text-primary/30 mx-auto" />
                        <h4 className="text-sm font-bold text-text">No Prescriptions Uploaded Yet</h4>
                        <p className="text-xs text-text-muted max-w-sm mx-auto">
                            Need prescription medicines? Upload your doctor&apos;s prescription for verification and doorstep delivery.
                        </p>
                        <Link
                            to="/prescription"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary font-bold text-xs hover:bg-primary/20 transition-all"
                        >
                            <Icon name="Upload" className="w-4 h-4" />
                            Upload Now
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {userPrescriptions.map((rx) => (
                            <div
                                key={rx.id}
                                className="bg-surface-hover border border-border rounded-2xl p-5 space-y-3 shadow-sm hover:border-primary/40 transition-all"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-xs font-bold text-primary">{rx.id}</span>
                                    <span
                                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                                            rx.status === 'APPROVED'
                                                ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                                                : rx.status === 'REJECTED'
                                                ? 'bg-red-500/10 text-red-600 border border-red-500/20'
                                                : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                                        }`}
                                    >
                                        {rx.status ? rx.status.replace('_', ' ') : 'PENDING'}
                                    </span>
                                </div>

                                <div>
                                    <h4 className="font-bold text-text text-sm truncate">{rx.filename || 'Medical Document'}</h4>
                                    <p className="text-[11px] text-text-muted mt-0.5">Uploaded: {rx.date || 'Recent'}</p>
                                </div>

                                {rx.agentSuggestion && (
                                    <div className="bg-surface p-3 rounded-xl border border-secondary/30 space-y-1">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-secondary">
                                            <Icon name="Stethoscope" className="w-3.5 h-3.5" />
                                            Pharmacist Dosage Advice:
                                        </div>
                                        <p className="text-xs text-text italic leading-relaxed">{rx.agentSuggestion}</p>
                                    </div>
                                )}

                                <div className="pt-2 flex items-center justify-between border-t border-border/50">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedRx(rx)}
                                        className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                                    >
                                        <Icon name="Eye" className="w-3.5 h-3.5" />
                                        View Details
                                    </button>
                                    {rx.status === 'REJECTED' && (
                                        <Link
                                            to="/prescription"
                                            className="text-xs font-bold text-red-500 hover:underline flex items-center gap-1"
                                        >
                                            <Icon name="Upload" className="w-3.5 h-3.5" />
                                            Re-upload Document
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Orders History Section */}
            <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-border pb-6">
                    <div>
                        <h2 className="text-xl font-bold font-serif text-slate-900 dark:text-white flex items-center gap-2">
                            <Icon name="Package" className="w-6 h-6 text-emerald-500" />
                            Recent Orders History
                        </h2>
                        <p className="text-xs text-text-muted mt-1">Review your recent order purchases and delivery status.</p>
                    </div>
                    <Link
                        to="/products"
                        className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                    >
                        Browse Medicines →
                    </Link>
                </div>

                {userOrders.length === 0 ? (
                    <div className="text-center py-8 text-xs text-text-muted">
                        No recent order records found on this device.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {userOrders.map((order, idx) => (
                            <div
                                key={order.id || idx}
                                className="bg-surface-hover border border-border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                            >
                                <div>
                                    <span className="font-mono text-xs font-bold text-text">{order.id || `ORD-${idx + 101}`}</span>
                                    <p className="text-xs text-text-muted mt-0.5">Date: {order.date || 'Recent'}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-right">
                                        <span className="font-bold text-sm text-primary">₹{order.totalAmount || order.total || 0}</span>
                                        <span className="ml-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                                            {order.status || 'PROCESSING'}
                                        </span>
                                    </div>
                                    <Link
                                        to={`/receipt/${order.id}`}
                                        className="px-3 py-1.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 font-bold text-xs transition-all flex items-center gap-1"
                                    >
                                        <Icon name="FileText" className="w-3.5 h-3.5" />
                                        Receipt
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
