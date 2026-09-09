import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from './Icons';

export default function CategoryCard({ category }) {
    return (
        <motion.div whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 220, damping: 20 }}>
            <Link
                to={`/products?category=${encodeURIComponent(category.slug)}`}
                className="group block rounded-[28px] border border-border bg-surface p-5 shadow-sm transition hover:shadow-md hover:border-primary/30"
            >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white">
                    <Icon name={category.iconKey} className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-2xl font-bold text-text">{category.name}</h3>
                <p className="mt-2 text-sm leading-6 text-text opacity-85">{category.description}</p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary">
                    Explore
                    <Icon name="ArrowRight" className="h-4 w-4" />
                </div>
            </Link>
        </motion.div>
    );
}