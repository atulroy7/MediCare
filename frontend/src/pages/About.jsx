import { motion } from 'framer-motion';
import Seo from '../components/Seo';
import Reveal from '../components/Reveal';
import Icon from '../components/Icons';
import { milestones, valueCards, ownerProfile } from '../data/products';

export default function About() {
    return (
        <>
            <Seo title="About Us" description="Learn the story, values, and owner profile behind Jaya Medical Store." />

            <main className="bg-surface min-h-[calc(100vh-72px)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-[500px] bg-primary/10 blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-1/3 h-[500px] bg-secondary/10 blur-[120px] pointer-events-none" />

                <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 relative z-10">
                    {/* ─── Hero Section ─── */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="mb-16 max-w-3xl"
                    >
                        <span className="kicker">Our Story</span>
                        <h1 className="display-heading !mb-4 text-balance">
                            A pharmacy shaped around <span className="text-primary italic font-normal">trust</span> and attention.
                        </h1>
                        <p className="mt-6 text-lg leading-relaxed text-text-muted text-balance">
                            Jaya Medical Store is built to feel like a clean, welcoming pharmacy counter online. The goal is simple:- genuine products, careful verification, and a service experience that helps people feel informed rather than rushed.
                        </p>
                    </motion.div>

                    <div className="space-y-16 sm:space-y-24">
                        {/* ─── Owner Section ─── */}
                        <Reveal>
                            <div className="glass-card overflow-hidden">
                                <div className="grid md:grid-cols-[0.8fr_1.2fr]">
                                    <div className="relative h-[300px] w-full bg-bg md:h-auto overflow-hidden">
                                        <img
                                            src="/images/owner.jpg"
                                            alt="Madan Mohan Mishra"
                                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent md:hidden" />
                                        <div className="absolute bottom-6 left-6 md:hidden">
                                            <h3 className="font-serif text-2xl font-medium text-white">{ownerProfile.name}</h3>
                                            <p className="text-xs font-bold tracking-widest text-white/80 uppercase">{ownerProfile.title}</p>
                                        </div>
                                    </div>
                                    <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                                        <div className="hidden md:block">
                                            <h2 className="font-serif text-3xl font-bold text-text lg:text-4xl">
                                                Madan Mohan Mishra
                                            </h2>
                                            <p className="mt-2 text-xs font-bold uppercase tracking-widest text-primary">
                                                {ownerProfile.title}
                                            </p>
                                        </div>
                                        <p className="mt-6 text-base leading-relaxed text-text-muted md:mt-8">
                                            With over {new Date().getFullYear() - 2010} years of retail pharmacy experience, Madan Mohan Mishra has shaped the store around careful counseling, accurate product handling, and consistent follow-up.
                                        </p>
                                        <blockquote className="mt-8 border-l-2 border-primary pl-6 font-serif text-xl italic leading-relaxed text-text">
                                            "{ownerProfile.quote}"
                                        </blockquote>

                                        <div className="mt-10 flex flex-wrap gap-3">
                                            {['Retail Experience', 'Prescription Review', 'Patient Support'].map((badge) => (
                                                <span key={badge} className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-bold tracking-wide text-primary">
                                                    <Icon name="CheckCircle2" className="h-4 w-4" />
                                                    {badge}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Reveal>

                        {/* ─── Values Section ─── */}
                        <Reveal>
                            <div className="mb-10 md:mb-14">
                                <span className="kicker">Our Core Values</span>
                                <h2 className="display-heading text-3xl sm:text-4xl">
                                    What we're built to protect
                                </h2>
                            </div>
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {valueCards.map((card) => (
                                    <motion.div
                                        key={card.title}
                                        whileHover={{ y: -6 }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                        className="glass-card p-8 group transition-colors hover:border-primary/30"
                                    >
                                        <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 transition-colors group-hover:bg-primary/20">
                                            <Icon name={card.iconKey} className="h-6 w-6" />
                                        </div>
                                        <h3 className="font-serif text-xl font-semibold text-text mb-3">
                                            {card.title}
                                        </h3>
                                        <p className="text-sm leading-relaxed text-text-muted">
                                            {card.text}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </Reveal>

                        {/* ─── Milestones Section ─── */}
                        <Reveal>
                            <div className="glass-card p-8 md:p-12 lg:p-16 bg-primary/5 border-primary/20 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px]" />
                                
                                <div className="mb-12 text-center relative z-10">
                                    <span className="kicker justify-center">Timeline</span>
                                    <h2 className="display-heading text-3xl sm:text-4xl">
                                        Our journey so far
                                    </h2>
                                </div>
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 relative z-10">
                                    {milestones.map((milestone) => (
                                        <div key={milestone.year} className="glass-card p-6 border-border hover:border-primary/30 transition-colors">
                                            <div className="mb-4 inline-flex rounded-lg bg-bg px-3 py-1 text-[11px] font-bold tracking-widest text-primary border border-primary/20 shadow-sm">
                                                {milestone.year}
                                            </div>
                                            <h3 className="font-serif text-xl font-semibold text-text mb-2">
                                                {milestone.title}
                                            </h3>
                                            <p className="text-sm leading-relaxed text-text-muted">
                                                {milestone.text}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Reveal>

                        {/* ─── Certifications & Mission ─── */}
                        <Reveal className="grid gap-6 lg:grid-cols-2">
                            <div className="glass-card p-8 md:p-10">
                                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-secondary/10 text-secondary border border-secondary/20">
                                    <Icon name="FileBadge" className="h-6 w-6" />
                                </div>
                                <h3 className="font-serif text-2xl font-semibold text-text mb-4">
                                    Current Documentation
                                </h3>
                                <p className="text-base leading-relaxed text-text-muted">
                                    Pharmacy compliance records, supplier paperwork, and proprietorship documentation are rigorously maintained. We believe transparency is the foundation of trust in healthcare.
                                </p>
                            </div>
                            <div className="glass-card p-8 md:p-10">
                                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                                    <Icon name="Target" className="h-6 w-6" />
                                </div>
                                <h3 className="font-serif text-2xl font-semibold text-text mb-4">
                                    Our Mission
                                </h3>
                                <p className="text-base leading-relaxed text-text-muted">
                                    To make pharmacy ordering feel accurate, human, and reassuring. Every screen, form, and checkout path is designed to reduce friction for customers who want dependable care without clutter.
                                </p>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </main>
        </>
    );
}