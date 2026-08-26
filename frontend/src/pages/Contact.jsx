import { useState } from 'react';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import Seo from '../components/Seo';
import Icon from '../components/Icons';
import { ownerProfile, storeInfo } from '../data/products';

const initialForm = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
};

const emailConfigured =
    import.meta.env.VITE_EMAILJS_SERVICE_ID &&
    import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE &&
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export default function Contact() {
    const [form, setForm] = useState(initialForm);
    const [sending, setSending] = useState(false);

    const onChange = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSending(true);
        try {
            if (emailConfigured) {
                await emailjs.send(
                    import.meta.env.VITE_EMAILJS_SERVICE_ID,
                    import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE,
                    form,
                    { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY },
                );
            }
            toast.success('Message sent successfully.');
            setForm(initialForm);
        } catch (error) {
            console.error(error);
            toast.error('Message could not be sent. Please try again.');
        } finally {
            setSending(false);
        }
    };

    const inputClass =
        'w-full bg-bg border border-border rounded-xl px-4 py-3 text-text placeholder:text-text-muted/60 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-colors duration-300 text-sm';

    return (
        <>
            <Seo
                title="Contact"
                description="Contact Jaya Medical Store for orders, prescription support, and store information."
            />

            <main className="min-h-[calc(100vh-72px)] bg-surface relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-[500px] bg-primary/10 blur-[120px] pointer-events-none" />
                
                <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 relative z-10">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="mb-14"
                    >
                        <span className="kicker">Get in touch</span>
                        <h1 className="display-heading !mb-4">Contact Us</h1>
                        <p className="max-w-2xl text-lg leading-relaxed text-text-muted">
                            Experience clinical excellence and personalized care. Reach out to us for prescription inquiries, wellness advice, or general information.
                        </p>
                    </motion.div>

                    {/* Layout Grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
                        className="grid grid-cols-1 gap-8 md:grid-cols-12"
                    >
                        {/* ─── Left Column: Contact Form ─── */}
                        <div className="md:col-span-7">
                            <div className="glass-card h-full p-8 md:p-12">
                                <h2 className="font-serif text-3xl font-semibold text-text mb-8">
                                    Send a Message
                                </h2>

                                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                    {/* Name + Email */}
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div>
                                            <label htmlFor="contact-name" className="mb-2 block text-xs font-bold uppercase tracking-widest text-text-muted">
                                                Name
                                            </label>
                                            <input
                                                id="contact-name"
                                                name="name"
                                                value={form.name}
                                                onChange={onChange}
                                                required
                                                placeholder="Jane Doe"
                                                className={inputClass}
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="contact-email" className="mb-2 block text-xs font-bold uppercase tracking-widest text-text-muted">
                                                Email
                                            </label>
                                            <input
                                                id="contact-email"
                                                name="email"
                                                type="email"
                                                value={form.email}
                                                onChange={onChange}
                                                required
                                                placeholder="jane@example.com"
                                                className={inputClass}
                                            />
                                        </div>
                                    </div>

                                    {/* Phone + Subject */}
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div>
                                            <label htmlFor="contact-phone" className="mb-2 block text-xs font-bold uppercase tracking-widest text-text-muted">
                                                Phone
                                            </label>
                                            <input
                                                id="contact-phone"
                                                name="phone"
                                                type="tel"
                                                value={form.phone}
                                                onChange={onChange}
                                                required
                                                placeholder="+91 00000 00000"
                                                className={inputClass}
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="contact-subject" className="mb-2 block text-xs font-bold uppercase tracking-widest text-text-muted">
                                                Subject
                                            </label>
                                            <input
                                                id="contact-subject"
                                                name="subject"
                                                value={form.subject}
                                                onChange={onChange}
                                                required
                                                placeholder="Prescription Inquiry"
                                                className={inputClass}
                                            />
                                        </div>
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label htmlFor="contact-message" className="mb-2 block text-xs font-bold uppercase tracking-widest text-text-muted">
                                            Message
                                        </label>
                                        <textarea
                                            id="contact-message"
                                            name="message"
                                            value={form.message}
                                            onChange={onChange}
                                            required
                                            rows="5"
                                            placeholder="How can we assist you today?"
                                            className={inputClass + ' resize-none'}
                                        />
                                    </div>

                                    {/* Submit */}
                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={sending}
                                            className="glass-button-primary w-full md:w-auto px-10 py-4 justify-center"
                                        >
                                            {sending ? 'Sending...' : 'Send Message'}
                                            <Icon name="ArrowRight" className="ml-2 h-4 w-4" />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* ─── Right Column: Info + Owner ─── */}
                        <div className="flex flex-col gap-8 md:col-span-5">
                            {/* Store Details Card */}
                            <div className="glass-card p-8">
                                <h3 className="font-serif text-2xl font-semibold text-primary mb-6">
                                    Store Details
                                </h3>

                                <div className="space-y-6">
                                    <InfoRow icon="MapPin" label="Address" value={storeInfo.address} />
                                    <InfoRow icon="Clock3" label="Hours" value={storeInfo.hours} />
                                    <InfoRow icon="Phone" label="Phone" value={storeInfo.phone} href={`tel:${storeInfo.phone.replace(/\s/g, '')}`} />
                                    <InfoRow icon="Mail" label="Email" value={storeInfo.email} href={`mailto:${storeInfo.email}`} />
                                </div>

                                {/* WhatsApp Button */}
                                <div className="mt-8 pt-8 border-t border-border">
                                    <a
                                        href={storeInfo.whatsapp}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/10 px-6 py-4 text-sm font-medium text-primary transition-all duration-300 hover:bg-primary/20"
                                    >
                                        <Icon name="MessageCircle" className="h-5 w-5" />
                                        Chat on WhatsApp
                                    </a>
                                </div>
                            </div>

                            {/* Owner Card */}
                            <div className="glass-card p-6 bg-primary/5">
                                <div className="flex items-center gap-6">
                                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-full border-2 border-border shadow-sm">
                                        <img
                                            src="/images/owner.jpg"
                                            alt={ownerProfile.name}
                                            className="h-full w-full object-cover"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="font-serif text-xl font-medium text-text">
                                            {ownerProfile.name}
                                        </h4>
                                        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-primary">
                                            Proprietor
                                        </p>
                                        <p className="text-sm italic text-text-muted">
                                            &quot;{ownerProfile.quote}&quot;
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Google Maps */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="glass-card overflow-hidden mt-16 h-[400px] w-full relative"
                    >
                        <iframe
                            title="Jaya Medical Store location"
                            src={storeInfo.mapEmbedUrl}
                            className="h-full w-full border-0 absolute inset-0 z-10 opacity-90 mix-blend-luminosity hover:mix-blend-normal hover:opacity-100 transition-all duration-700"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                        <div className="absolute inset-0 bg-primary/10 z-20 pointer-events-none" />
                    </motion.div>
                </div>
            </main>
        </>
    );
}

function InfoRow({ icon, label, value, href }) {
    const content = href ? (
        <a href={href} className="text-sm text-text hover:text-primary transition-colors">
            {value}
        </a>
    ) : (
        <p className="text-sm text-text">{value}</p>
    );

    return (
        <div className="flex items-start gap-4">
            <span className="mt-0.5 text-primary">
                <Icon name={icon} className="h-5 w-5" />
            </span>
            <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-text-muted">
                    {label}
                </p>
                {content}
            </div>
        </div>
    );
}