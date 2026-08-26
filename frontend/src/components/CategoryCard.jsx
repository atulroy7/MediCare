import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from './Icons';

export default function CategoryCard({ category }) {
    return (
        <motion.div whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 220, damping: 20 }}>
            <Link
                to={`/products?category=${encodeURIComponent(category.slug)}`}
                className="group block rounded-[28px] border border-brand-100 bg-white p-5 shadow-soft transition hover:shadow-lift"
            >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 transition group-hover:bg-brand-500 group-hover:text-white">
                    <Icon name={category.iconKey} className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-2xl text-slate-900">{category.name}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{category.description}</p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-700">
                    Explore
                    <Icon name="ArrowRight" className="h-4 w-4" />
                </div>
            </Link>
        </motion.div>
    );
}