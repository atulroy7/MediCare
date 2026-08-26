import { motion } from 'framer-motion';
import Seo from '../components/Seo';

export default function TermsConditions() {
    return (
        <>
            <Seo title="Terms and Conditions" description="Terms and Conditions for Jaya Medical Store." />

            <main className="bg-surface min-h-[calc(100vh-72px)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-[400px] bg-primary/5 blur-[120px] pointer-events-none" />

                <div className="mx-auto max-w-[1000px] px-5 py-16 sm:px-6 md:px-16 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                        <span className="kicker">Legal</span>
                        <h1 className="display-heading !mb-4 tracking-tight">
                            Terms & Conditions
                        </h1>
                        <p className="text-base text-text-muted">
                            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
                        className="mt-12 space-y-10 glass-card p-8 md:p-12"
                    >
                        <section className="space-y-4">
                            <h2 className="font-serif text-2xl font-semibold text-text">1. General</h2>
                            <p className="text-base leading-relaxed text-text-muted">
                                By accessing and placing an order with Jaya Medical Store, you confirm that you are in agreement with and bound by the terms of service contained in the Terms & Conditions outlined below. These terms apply to the entire website and any email or other type of communication between you and Jaya Medical Store.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="font-serif text-2xl font-semibold text-text">2. Prescription Medications</h2>
                            <p className="text-base leading-relaxed text-text-muted">
                                Jaya Medical Store operates in strict compliance with the Drugs and Cosmetics Act. Any order containing prescription medications (Schedule H/H1) will only be processed after a valid prescription from a registered medical practitioner is uploaded and verified by our licensed pharmacists. We reserve the right to cancel any order if the prescription is found to be invalid, expired, or fraudulent.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="font-serif text-2xl font-semibold text-text">3. Pricing and Availability</h2>
                            <p className="text-base leading-relaxed text-text-muted">
                                All prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise. Prices and availability of products are subject to change without notice. We make every effort to ensure accurate pricing, but in the event of a pricing error, we reserve the right to cancel the order and notify you.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="font-serif text-2xl font-semibold text-text">4. Delivery</h2>
                            <p className="text-base leading-relaxed text-text-muted">
                                We aim to deliver all local orders within the specified timeframes. However, delivery times are estimates and may be subject to delays due to unforeseen circumstances (e.g., severe weather, stock unavailability). We will communicate any significant delays to you promptly.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="font-serif text-2xl font-semibold text-text">5. Returns and Cancellations</h2>
                            <p className="text-base leading-relaxed text-text-muted">
                                Please refer to our Cancellation Policy for detailed information regarding order cancellations. Due to health and safety regulations, we do not accept returns on temperature-controlled medicines or opened products.
                            </p>
                        </section>
                    </motion.div>
                </div>
            </main>
        </>
    );
}
