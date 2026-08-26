import { motion } from 'framer-motion';
import Seo from '../components/Seo';

export default function PrivacyPolicy() {
    return (
        <>
            <Seo title="Privacy Policy" description="Privacy Policy for Jaya Medical Store." />

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
                            Privacy Policy
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
                            <h2 className="font-serif text-2xl font-semibold text-text">1. Information We Collect</h2>
                            <p className="text-base leading-relaxed text-text-muted">
                                At Jaya Medical Store, we collect information that you provide directly to us when you create an account, place an order, or contact us for support. This includes your name, email address, phone number, shipping address, and medical prescriptions (when required for ordering specific medicines).
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="font-serif text-2xl font-semibold text-text">2. How We Use Your Information</h2>
                            <p className="text-base leading-relaxed text-text-muted">
                                We use the information we collect to fulfill your orders, provide customer support, communicate with you about your order status via SMS or WhatsApp, and ensure compliance with pharmacy laws regarding prescription medications. We do not sell or rent your personal information to third parties.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="font-serif text-2xl font-semibold text-text">3. Data Security and Confidentiality</h2>
                            <p className="text-base leading-relaxed text-text-muted">
                                We take the security of your medical and personal data seriously. Prescriptions uploaded to our platform are stored securely and are only accessed by our licensed pharmacists for the purpose of order verification and fulfillment. We implement standard security measures to protect against unauthorized access or data breaches.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="font-serif text-2xl font-semibold text-text">4. Third-Party Services</h2>
                            <p className="text-base leading-relaxed text-text-muted">
                                We may share your delivery address and phone number with our trusted delivery partners strictly for the purpose of delivering your orders. We ensure our partners adhere to strict confidentiality agreements.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="font-serif text-2xl font-semibold text-text">5. Contact Us</h2>
                            <p className="text-base leading-relaxed text-text-muted">
                                If you have any questions about this Privacy Policy, please contact us at support@jayamedicalstore.in or call our support line.
                            </p>
                        </section>
                    </motion.div>
                </div>
            </main>
        </>
    );
}
