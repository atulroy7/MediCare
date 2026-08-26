import { motion } from 'framer-motion';

export default function Reveal({ children, className = '', delay = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay, ease: 'easeOut' }}
            className={className}
        >
            {children}
        </motion.div>
    );
}