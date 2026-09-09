import { useState } from 'react';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';
import { contactSubjects } from '../data/products';
import Icon from './Icons';

const initialForm = {
    name: '',
    email: '',
    phone: '',
    subject: contactSubjects[0],
    message: '',
};

const emailConfigured =
    import.meta.env.VITE_EMAILJS_SERVICE_ID &&
    import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE &&
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export default function ContactForm() {
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
            event.currentTarget.reset();
        } catch (error) {
            console.error(error);
            toast.error('Message could not be sent. Please try again.');
        } finally {
            setSending(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5 rounded-[32px] border border-border bg-surface p-6 shadow-sm">
            <div>
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-primary">Contact form</p>
                <h2 className="mt-2 font-display text-3xl font-bold text-text">Send a message to the store</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm font-bold text-text">
                    Name
                    <input
                        name="name"
                        value={form.name}
                        onChange={onChange}
                        required
                        className="w-full rounded-2xl border border-border bg-bg text-text px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                </label>
                <label className="space-y-2 text-sm font-bold text-text">
                    Email
                    <input
                        name="email"
                        value={form.email}
                        onChange={onChange}
                        type="email"
                        required
                        className="w-full rounded-2xl border border-border bg-bg text-text px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm font-bold text-text">
                    Phone
                    <input
                        name="phone"
                        value={form.phone}
                        onChange={onChange}
                        type="tel"
                        required
                        className="w-full rounded-2xl border border-border bg-bg text-text px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                </label>
                <label className="space-y-2 text-sm font-bold text-text">
                    Subject
                    <select
                        name="subject"
                        value={form.subject}
                        onChange={onChange}
                        className="w-full rounded-2xl border border-border bg-bg text-text px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                        {contactSubjects.map((subject) => (
                            <option key={subject} value={subject} className="bg-surface text-text">
                                {subject}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <label className="space-y-2 text-sm font-bold text-text">
                Message
                <textarea
                    name="message"
                    value={form.message}
                    onChange={onChange}
                    rows="5"
                    required
                    className="w-full rounded-2xl border border-border bg-bg text-text px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
            </label>

            <button
                type="submit"
                disabled={sending}
                className="glass-button-primary disabled:cursor-not-allowed disabled:opacity-70"
            >
                {sending ? 'Sending...' : 'Submit message'}
                <Icon name="Send" className="h-4 w-4" />
            </button>
        </form>
    );
}