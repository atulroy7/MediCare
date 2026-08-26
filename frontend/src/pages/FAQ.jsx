import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Seo from '../components/Seo';
import Icon from '../components/Icons';
import { faqItems } from '../data/products';

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <>
            <Seo title="FAQ" description="Frequently asked questions about delivery, prescriptions, returns, payment methods, and WhatsApp ordering." />
            
            <div className="min-h-[calc(100vh-72px)] bg-surface relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1/2 h-[500px] bg-primary/5 blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-1/2 h-[500px] bg-secondary/5 blur-[120px] pointer-events-none" />

                <div className="mx-auto max-w-3xl px-4 py-16 md:py-24 relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <span className="kicker justify-center">FAQ</span>
                        <h1 className="display-heading text-4xl sm:text-5xl !mb-4">Common questions</h1>
                        <p className="text-lg text-text-muted">
                            Find quick answers to questions about delivery, prescriptions, returns, and payment methods.
                        </p>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-4"
                    >
                        {faqItems.map((item, index) => {
                            const isOpen = index === openIndex;
                            return (
                                <div key={item.question} className={`glass-card overflow-hidden transition-all duration-300 ${isOpen ? 'border-primary/30 shadow-lg' : 'hover:border-border/80'}`}>
                                    <button
                                        type="button"
                                        onClick={() => setOpenIndex(isOpen ? -1 : index)}
                                        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left focus:outline-none"
                                        aria-expanded={isOpen}
                                    >
                                        <span className="font-serif text-xl font-medium text-text">{item.question}</span>
                                        <div className={`p-2 rounded-full transition-colors ${isOpen ? 'bg-primary/10 text-primary' : 'text-text-muted group-hover:bg-bg-subtle'}`}>
                                            <Icon name="ChevronDown" className={`h-5 w-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                                        </div>
                                    </button>
                                    
                                    <AnimatePresence>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                            >
                                                <div className="px-6 pb-6 pt-2 text-base leading-relaxed text-text-muted border-t border-border/50 mx-6">
                                                    {item.answer}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-16 text-center glass-card p-8 bg-primary/5 border-primary/20"
                    >
                        <h3 className="font-serif text-2xl mb-3 text-text">Still have questions?</h3>
                        <p className="text-text-muted mb-6">Can't find the answer you're looking for? Please contact our friendly team. </p>
                        <a href="/contact" className="glass-button-primary inline-flex">
                            Get in Touch
                        </a>
                    </motion.div>
                </div>
            </div>
        </>
    );
}