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
        <div className="overflow-hidden rounded-[36px] border border-brand-100 bg-white p-6 shadow-soft sm:p-8">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-700">Customer notes</p>
                    <h3 className="mt-2 font-display text-3xl text-slate-900">What customers say</h3>
                </div>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => setIndex((currentIndex) => (currentIndex - 1 + testimonials.length) % testimonials.length)}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-100 text-slate-700 transition hover:bg-brand-50"
                        aria-label="Previous testimonial"
                    >
                        <Icon name="ChevronLeft" className="h-5 w-5" />
                    </button>
                    <button
                        type="button"
                        onClick={() => setIndex((currentIndex) => (currentIndex + 1) % testimonials.length)}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-100 text-slate-700 transition hover:bg-brand-50"
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
                    <div className="rounded-[30px] bg-brand-50 p-6">
                        <div className="flex items-center gap-1 text-gold-500">
                            {Array.from({ length: current.rating }).map((_, starIndex) => (
                                <Icon key={starIndex} name="Star" className="h-4 w-4 fill-current" />
                            ))}
                        </div>
                        <p className="mt-4 text-lg leading-8 text-slate-800">“{current.text}”</p>
                    </div>
                    <div className="flex items-end justify-between rounded-[30px] border border-slate-100 bg-slate-950 p-6 text-white">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-200">Reviewer</p>
                            <p className="mt-3 font-display text-3xl">{current.name}</p>
                            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-300">
                                Pharmacy support should feel precise, quick, and easy to trust.
                            </p>
                        </div>
                        <div className="hidden rounded-full border border-white/10 bg-white/5 p-4 text-brand-100 lg:block">
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