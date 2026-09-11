import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { footerLinks, ownerProfile, socialLinks, storeInfo } from '../data/products';
import Icon from './Icons';
import Logo from './Logo';

import { useAuth } from '../context/AuthContext';

export default function Footer() {
    const { role } = useAuth();
    const year = new Date().getFullYear();

    const handleSubscribe = (event) => {
        event.preventDefault();
        toast.success('Thanks for subscribing.');
        event.currentTarget.reset();
    };

    const filteredFooterLinks = role === 'agent' 
        ? footerLinks.filter(l => l.to === '/' || l.to === '/about' || l.to === '/contact' || l.to === '/faq' || l.to === '/dashboard')
        : footerLinks;

    return (
        <footer className="border-t border-border bg-surface text-text relative overflow-hidden">
            <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.4fr_0.6fr_0.6fr_1fr] lg:gap-16 lg:px-8 relative z-10">
                {/* Brand column */}
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-2.5 mb-2">
                            <Logo className="h-8 w-8" />
                            <p className="font-serif text-3xl font-bold tracking-tight">
                                MediCare
                            </p>
                        </div>
                        <p className="mt-3 max-w-md text-base leading-relaxed text-text-muted">
                            A neighborhood pharmacy experience shaped for clarity, care, and dependable service.
                        </p>
                    </div>

                    {/* Owner badge */}
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/15">
                            <Icon name="UserRound" className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-text">{ownerProfile.name}</p>
                            <p className="text-xs text-text-muted mt-0.5">{ownerProfile.title}</p>
                        </div>
                    </div>

                    {/* Address */}
                    <p className="max-w-sm text-sm leading-relaxed text-text-muted">
                        {storeInfo.address}
                    </p>

                    {/* Social links */}
                    <div className="flex items-center gap-3 pt-2">
                        {socialLinks.map((social) => (
                            <a
                                key={social.name}
                                href={social.href}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-bg border border-border text-text-muted transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white shadow-sm"
                                aria-label={social.name}
                            >
                                <Icon name={social.name === 'WhatsApp' ? 'MessageCircle' : social.name} className="h-4 w-4" />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <p className="mb-6 text-xs font-bold uppercase tracking-widest text-primary">
                        Quick Links
                    </p>
                    <div className="grid gap-4">
                        {filteredFooterLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="group flex items-center gap-3 text-sm text-text-muted transition-colors duration-200 hover:text-primary"
                            >
                                <span className="inline-block h-px w-4 bg-border transition-all duration-300 group-hover:w-8 group-hover:bg-primary" />
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Legal links */}
                <div>
                    <p className="mb-6 text-xs font-bold uppercase tracking-widest text-primary">
                        Legal
                    </p>
                    <div className="grid gap-4">
                        {[
                            { label: 'Privacy Policy', to: '/privacy-policy' },
                            { label: 'Terms & Conditions', to: '/terms-conditions' },
                            { label: 'Cancellation Policy', to: '/cancel-order' },
                        ].map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="group flex items-center gap-3 text-sm text-text-muted transition-colors duration-200 hover:text-primary"
                            >
                                <span className="inline-block h-px w-4 bg-border transition-all duration-300 group-hover:w-8 group-hover:bg-primary" />
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Newsletter + Contact column */}
                <div className="space-y-8">
                    <div>
                        <p className="mb-6 text-xs font-bold uppercase tracking-widest text-primary">
                            Stay Updated
                        </p>
                        <p className="max-w-sm text-sm leading-relaxed text-text-muted mb-4">
                            Get store updates, wellness notes, and product highlights without clutter.
                        </p>
                        <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
                            <input
                                id="footer-email"
                                type="email"
                                required
                                placeholder="Enter your email address"
                                className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-text placeholder:text-text-muted transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                            />
                            <button
                                type="submit"
                                className="glass-button-primary w-full py-3"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>

                    {/* Contact details */}
                    <div className="glass-card p-4 space-y-3 bg-bg/50">
                        <p className="text-xs font-bold uppercase tracking-widest text-text-muted mb-3">
                            Contact Support
                        </p>
                        <div className="flex items-center gap-3 text-sm text-text-muted">
                            <Icon name="Phone" className="h-4 w-4 text-primary" />
                            <span>{storeInfo.phone}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-text-muted">
                            <Icon name="Mail" className="h-4 w-4 text-primary" />
                            <span>{storeInfo.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-text-muted">
                            <Icon name="Clock" className="h-4 w-4 text-primary" />
                            <span>{storeInfo.hours}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-border bg-bg">
                <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                    <p>© {year} MediCare. All rights reserved.</p>
                    <p className="flex items-center gap-1">
                        Built for reliable pharmacy care <Icon name="Heart" className="w-3 h-3 text-red-500 fill-current" />
                    </p>
                </div>
            </div>
        </footer>
    );
}