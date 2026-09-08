import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import Icon from './Icons';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    const discount = Math.max(0, Math.round(((product.mrp - product.price) / product.mrp) * 100));

    const handleAddToCart = (e) => {
        e.preventDefault(); // Prevent navigating to product detail
        addToCart(product);
    };

    const handleImgError = (e) => {
        // Fallback to SVG data URI if image fails
        e.target.onerror = null;
        e.target.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="#f0ece6"/><text x="200" y="190" font-family="sans-serif" font-size="20" font-weight="bold" fill="#6B8F71" text-anchor="middle">${product.name}</text><text x="200" y="220" font-family="sans-serif" font-size="14" fill="#6B645C" text-anchor="middle">${product.brand}</text></svg>`
        )}`;
    };

    return (
        <motion.article
            whileHover={{ y: -6 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="h-full"
        >
            <div className="glass-card group flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/20 dark:hover:border-primary/30">
                <Link to={`/products/${product.id}`} className="flex flex-col flex-grow">
                    {/* Image Section */}
                    <div className="relative overflow-hidden bg-bg-subtle aspect-square sm:aspect-[4/3] flex-shrink-0">
                        <img
                            src={product.image}
                            alt={product.name}
                            loading="lazy"
                            onError={handleImgError}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Badges */}
                        <div className="absolute left-3 top-3 flex flex-col gap-2 z-10">
                            {discount > 0 && (
                                <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-white shadow-md">
                                    {discount}% OFF
                                </span>
                            )}
                            {product.requiresPrescription && (
                                <span className="rounded-full bg-secondary px-3 py-1 text-[11px] font-bold text-white shadow-md flex items-center gap-1">
                                    <Icon name="FileText" className="w-3 h-3" />
                                    Doctor Prescription Required
                                </span>
                            )}
                        </div>

                        {/* Quick View Button (Desktop Hover) */}
                        <div className="absolute inset-x-0 bottom-4 flex justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
                            <span className="glass-button bg-white/90 dark:bg-zinc-800/90 text-text px-4 py-2 rounded-full shadow-lg text-xs font-medium backdrop-blur-md border border-border">
                                <Icon name="Eye" className="w-4 h-4 mr-1" /> Quick View
                            </span>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col flex-grow p-5">
                        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
                            {product.category}
                        </p>
                        <h3 className="font-serif text-xl font-semibold leading-tight text-text mb-2 line-clamp-2">
                            {product.name}
                        </h3>
                        <p className="text-sm text-text-muted line-clamp-2 mb-4 flex-grow">
                            {product.description}
                        </p>

                        {/* Price */}
                        <div className="flex items-end justify-between gap-3 mt-auto">
                            <div>
                                <p className="text-2xl font-bold text-text">₹{product.price}</p>
                                {discount > 0 && (
                                    <p className="text-xs text-text-muted mt-1">
                                        MRP <span className="line-through">₹{product.mrp}</span>
                                    </p>
                                )}
                            </div>
                            <span className="rounded-xl bg-bg-subtle border border-border px-3 py-1 text-xs font-medium text-text-muted">
                                {product.brand}
                            </span>
                        </div>
                    </div>
                </Link>

                {/* Add to cart Action */}
                <div className="p-4 pt-0">
                    <button
                        type="button"
                        onClick={handleAddToCart}
                        className="w-full glass-button-primary rounded-xl py-3 justify-center group/btn relative overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            <Icon name="ShoppingCart" className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
                            Add to Cart
                        </span>
                        <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover/btn:translate-y-0 transition-transform duration-300 ease-out" />
                    </button>
                </div>
            </div>
        </motion.article>
    );
}