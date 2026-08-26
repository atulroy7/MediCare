import { motion } from 'framer-motion';
import Seo from '../components/Seo';
import Icon from '../components/Icons';
import { storeInfo } from '../data/products';

export default function CancelOrder() {
    return (
        <>
            <Seo title="Cancellation & Refund Policy" description="Order cancellation and refund policy for Jaya Medical Store." />

            <main className="bg-surface min-h-[calc(100vh-72px)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-[400px] bg-primary/5 blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-1/3 h-[400px] bg-secondary/5 blur-[120px] pointer-events-none" />

                <div className="mx-auto max-w-[1000px] px-5 py-16 sm:px-6 md:px-16 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                        <span className="kicker">Return Info</span>
                        <h1 className="display-heading !mb-4 tracking-tight">
                            Cancellation Policy
                        </h1>
                        <p className="max-w-2xl text-lg leading-relaxed text-text-muted">
                            We understand that plans change. Review our policy below to understand how and when you can cancel your order.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
                        className="mt-12 space-y-10"
                    >
                        {/* Highlighted Policy Box */}
                        <div className="glass-card p-8 md:p-10 border-tertiary/20 bg-tertiary/5">
                            <div className="flex items-start gap-5">
                                <div className="mt-1 inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-tertiary/10 text-tertiary border border-tertiary/20">
                                    <Icon name="Clock" className="h-6 w-6" />
                                </div>
                                <div>
                                    <h2 className="font-serif text-2xl font-semibold text-text mb-3">
                                        The 2-Hour Cancellation Window
                                    </h2>
                                    <p className="text-base leading-relaxed text-text-muted">
                                        Orders can be cancelled free of charge <strong className="text-text font-bold">within 2 hours</strong> of placement. Since we process and dispatch medical supplies quickly to ensure timely delivery, we cannot accept cancellations once an order has left our pharmacy.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            {/* How to Cancel */}
                            <div className="glass-card p-8">
                                <h3 className="font-serif text-2xl font-semibold text-text mb-4">
                                    How to Cancel
                               </h3>
                                <p className="text-base leading-relaxed text-text-muted mb-6">
                                    To cancel your order, you must provide your order details directly to our support team within the 2-hour window. Please share your Name and Order ID using one of the methods below:
                                </p>
                                
                                <div className="space-y-4">
                                    <a 
                                        href={storeInfo.whatsapp} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="flex w-full items-center gap-4 rounded-xl border border-primary/20 bg-primary/5 p-4 transition-all hover:bg-primary/10 hover:-translate-y-0.5"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                                            <Icon name="MessageCircle" className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-text">WhatsApp Us</p>
                                            <p className="text-xs text-text-muted mt-0.5">Fastest response time</p>
                                        </div>
                                    </a>

                                    <a 
                                        href={`tel:${storeInfo.phone.replace(/\s/g, '')}`}
                                        className="flex w-full items-center gap-4 rounded-xl border border-border bg-bg-subtle p-4 transition-all hover:bg-bg hover:-translate-y-0.5"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bg border border-border text-text">
                                            <Icon name="Phone" className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-text">Call Support</p>
                                            <p className="text-xs text-text-muted mt-0.5">{storeInfo.phone}</p>
                                        </div>
                                    </a>
                                </div>
                            </div>

                            {/* Refunds & Exceptions */}
                            <div className="glass-card p-8">
                                <h3 className="font-serif text-2xl font-semibold text-text mb-6">
                                    Refunds & Exceptions
                                </h3>
                                <ul className="space-y-5 text-base leading-relaxed text-text-muted">
                                    <li className="flex items-start gap-4">
                                        <Icon name="CheckCircle2" className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                                        <span>If you cancel within 2 hours, 95% of your pre-paid amount will be refunded to your original payment method within 3-5 business days (a 5% deduction applies due to payment gateway processing charges).</span>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <Icon name="AlertCircle" className="mt-1 h-5 w-5 flex-shrink-0 text-tertiary" />
                                        <span>Temperature-sensitive medicines (like insulin) cannot be returned or cancelled once dispatched under any circumstances due to strict safety regulations.</span>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <Icon name="Ban" className="mt-1 h-5 w-5 flex-shrink-0 text-red-500" />
                                        <span>Orders cancelled after the 2-hour window, or orders refused at the time of delivery, may be subject to a nominal delivery cancellation fee.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </>
    );
}
