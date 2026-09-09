import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './Icons';

export default function TestimonialSlider({ testimonials }) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = window.setInterval(() => {
            setIndex((current) => (current + 1) % testimonials.length);
        }, 4500);

        return () => window.clearInterval(timer);
    }, [testimonials.length]);

    const current = testimonials[index];

    return (
        <div className="overflow-hidden rounded-[36px] border border-border bg-surface p-6 shadow-sm sm:p-8">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-bold uppercase tracking-[0.3em] text-primary">Customer notes</p>
                    <h3 className="mt-2 font-display text-3xl font-bold text-text">What customers say</h3>
                </div>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => setIndex((currentIndex) => (currentIndex - 1 + testimonials.length) % testimonials.length)}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-text transition hover:bg-bg-subtle"
                        aria-label="Previous testimonial"
                    >
                        <Icon name="ChevronLeft" className="h-5 w-5" />
                    </button>
                    <button
                        type="button"
                        onClick={() => setIndex((currentIndex) => (currentIndex + 1) % testimonials.length)}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-text transition hover:bg-bg-subtle"
                        aria-label="Next testimonial"
                    >
                        <Icon name="ChevronRight" className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={current.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.35 }}
                    className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]"
                >
                    <div className="rounded-[30px] bg-bg-subtle border border-border/60 p-6">
                        <div className="flex items-center gap-1 text-gold-500">
                            {Array.from({ length: current.rating }).map((_, starIndex) => (
                                <Icon key={starIndex} name="Star" className="h-4 w-4 fill-current" />
                            ))}
                        </div>
                        <p className="mt-4 text-lg leading-8 text-text font-medium">“{current.text}”</p>
                    </div>
                    <div className="flex items-end justify-between rounded-[30px] border border-border bg-black dark:bg-black p-6 text-white">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.3em] text-primary-light">Reviewer</p>
                            <p className="mt-3 font-display text-3xl font-bold text-white">{current.name}</p>
                            <p className="mt-3 max-w-sm text-sm leading-6 text-white opacity-90">
                                Pharmacy support should feel precise, quick, and easy to trust.
                            </p>
                        </div>
                        <div className="hidden rounded-full border border-white/10 bg-white/5 p-4 text-white lg:block">
                            <Icon name="Quote" className="h-8 w-8" />
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            <div className="mt-6 flex items-center justify-center gap-2">
                {testimonials.map((testimonial, dotIndex) => (
                    <button
                        key={testimonial.name}
                        type="button"
                        onClick={() => setIndex(dotIndex)}
                        className={`h-2.5 rounded-full transition ${dotIndex === index ? 'w-10 bg-brand-500' : 'w-2.5 bg-brand-200'}`}
                        aria-label={`Show testimonial from ${testimonial.name}`}
                    />
                ))}
            </div>
        </div>
    );
}