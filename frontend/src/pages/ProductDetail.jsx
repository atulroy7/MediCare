import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Seo from '../components/Seo';
import Reveal from '../components/Reveal';
import Icon from '../components/Icons';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const tabs = [
    { key: 'details', label: 'Details', icon: 'FileText' },
    { key: 'uses', label: 'Uses', icon: 'CheckCircle2' },
    { key: 'sideEffects', label: 'Side Effects', icon: 'ShieldCheck' },
    { key: 'directions', label: 'Directions', icon: 'ClipboardList' },
];

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('details');

    const product = products.find((item) => item.id === Number(id));
    const relatedProducts = useMemo(
        () => products.filter((item) => item.category === product?.category && item.id !== product?.id).slice(0, 4),
        [product],
    );

    if (!product) {
        return (
            <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 min-h-[60vh] flex flex-col justify-center">
                <Seo title="Product not found" description="The requested product could not be found." />
                <div className="mx-auto w-full max-w-2xl glass-card p-12 text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
                        <Icon name="PackageSearch" className="h-10 w-10" />
                    </div>
                    <h1 className="mt-6 font-serif text-3xl font-semibold text-text">Product not found</h1>
                    <p className="mt-3 text-base text-text-muted">This product is not in our catalog.</p>
                    <button
                        type="button"
                        onClick={() => navigate('/products')}
                        className="glass-button-primary mt-8 inline-flex items-center"
                    >
                        <Icon name="ArrowRight" className="mr-2 h-4 w-4 rotate-180" />
                        Back to Products
                    </button>
                </div>
            </section>
        );
    }

    const discount = Math.max(0, Math.round(((product.mrp - product.price) / product.mrp) * 100));

    const handleAddToCart = () => {
        addToCart(product, quantity);
        toast.success(`${quantity} × ${product.name} added to cart.`);
    };

    return (
        <>
            <Seo
                title={product.name}
                description={`${product.name} by ${product.brand} — composition, pricing, uses, and directions.`}
            />

            {/* Breadcrumb */}
            <div className="border-b border-border bg-bg/50 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 text-sm text-text-muted sm:px-6 lg:px-8">
                    <Link to="/products" className="transition-colors hover:text-primary">Products</Link>
                    <Icon name="ChevronRight" className="h-3.5 w-3.5" />
                    <span className="text-text font-semibold">{product.name}</span>
                </div>
            </div>

            {/* Main product section */}
            <section className="bg-surface relative overflow-hidden min-h-[calc(100vh-72px)]">
                <div className="absolute top-0 right-0 w-1/2 h-[600px] bg-primary/5 blur-[120px] pointer-events-none" />
                
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 relative z-10">
                    <Reveal className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-16">
                        {/* Image */}
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            className="glass-card overflow-hidden group"
                        >
                            <div className="relative bg-bg-subtle aspect-[4/3] w-full">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    loading="lazy"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
                                            `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450"><rect width="600" height="450" fill="#f1f5f9"/><text x="300" y="210" font-family="sans-serif" font-size="24" font-weight="bold" fill="#0d9488" text-anchor="middle">${product.name}</text><text x="300" y="245" font-family="sans-serif" font-size="16" fill="#64748b" text-anchor="middle">${product.brand}</text></svg>`
                                        )}`;
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                
                                {/* Badges */}
                                <div className="absolute left-5 top-5 flex flex-col gap-2">
                                    {discount > 0 && (
                                        <span className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-bold tracking-widest text-white shadow-lg backdrop-blur-md">
                                            {discount}% OFF
                                        </span>
                                    )}
                                    {product.requiresPrescription && (
                                        <span className="rounded-lg bg-tertiary px-3 py-1.5 text-xs font-bold tracking-widest text-white shadow-lg backdrop-blur-md flex items-center gap-1.5">
                                            <Icon name="ShieldCheck" className="w-3.5 h-3.5" />
                                            Prescription Required
                                        </span>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        {/* Details */}
                        <div className="space-y-8">
                            {/* Header */}
                            <div>
                                <span className="kicker !mb-3">
                                    {product.category}
                                </span>
                                <h1 className="display-heading text-4xl sm:text-5xl !mb-2 text-balance">
                                    {product.name}
                                </h1>
                                <p className="text-base text-text-muted mt-3">
                                    by <span className="font-semibold text-text">{product.manufacturer}</span>
                                </p>
                            </div>

                            {/* Meta badges */}
                            <div className="flex flex-wrap gap-2.5">
                                <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-bg-subtle px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-text-muted">
                                    <Icon name="Pill" className="h-3.5 w-3.5 text-primary" />
                                    {product.composition}
                                </span>
                                <span className="inline-flex items-center rounded-lg border border-border bg-bg-subtle px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-text-muted">
                                    {product.brand}
                                </span>
                                {product.requiresPrescription && (
                                    <span className="inline-flex items-center gap-1 rounded-lg border border-secondary/30 bg-secondary/15 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-secondary">
                                        <Icon name="FileText" className="h-3.5 w-3.5" />
                                        Doctor Prescription Mandatory
                                    </span>
                                )}
                            </div>

                            {/* Doctor Prescription Alert Banner */}
                            {product.requiresPrescription && (
                                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-300 flex items-start gap-3 shadow-sm">
                                    <Icon name="FileText" className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-bold">📄 Doctor Prescription Mandatory</p>
                                        <p className="text-xs opacity-90 mt-0.5 leading-relaxed">
                                            This medicine requires a valid Doctor Prescription under Indian Pharmaceutical Laws. Please upload your prescription during checkout or via the Prescription portal.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Price card */}
                            <div className="glass-card p-8">
                                <div className="flex flex-wrap items-end justify-between gap-6">
                                    <div>
                                        <div className="flex items-baseline gap-3">
                                            <p className="font-serif text-4xl font-bold text-text">₹{product.price}</p>
                                            {discount > 0 && (
                                                <p className="text-lg font-medium text-text-muted line-through">₹{product.mrp}</p>
                                            )}
                                        </div>
                                        <p className="mt-1 text-sm text-text-muted">
                                            Inclusive of all taxes
                                        </p>
                                    </div>

                                    {/* Quantity */}
                                    <div className="flex items-center rounded-xl border border-border bg-bg p-1 shadow-sm">
                                        <button
                                            type="button"
                                            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                                            className="flex h-10 w-10 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-bg-subtle hover:text-text"
                                            aria-label="Decrease quantity"
                                        >
                                            <Icon name="Minus" className="h-4 w-4" />
                                        </button>
                                        <span className="w-12 text-center text-base font-bold text-text">{quantity}</span>
                                        <button
                                            type="button"
                                            onClick={() => setQuantity((current) => current + 1)}
                                            className="flex h-10 w-10 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-bg-subtle hover:text-text"
                                            aria-label="Increase quantity"
                                        >
                                            <Icon name="Plus" className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Action buttons */}
                                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                                    <button
                                        type="button"
                                        onClick={handleAddToCart}
                                        className="glass-button-primary flex-1 justify-center py-4 text-base"
                                    >
                                        <Icon name="ShoppingCart" className="h-5 w-5 mr-2" />
                                        Add to Cart
                                    </button>
                                    {product.requiresPrescription && (
                                        <Link
                                            to="/prescription"
                                            className="glass-button flex-1 justify-center py-4 text-base"
                                        >
                                            <Icon name="Upload" className="h-5 w-5 mr-2" />
                                            Upload Prescription
                                        </Link>
                                    )}
                                </div>
                            </div>

                            {/* Prescription notice */}
                            {product.requiresPrescription && (
                                <div className="flex items-start gap-4 rounded-2xl border border-tertiary/20 bg-tertiary/5 p-5">
                                    <Icon name="ShieldCheck" className="mt-0.5 h-6 w-6 shrink-0 text-tertiary" />
                                    <p className="text-sm leading-relaxed text-text-muted">
                                        <strong className="text-text">Prescription Required.</strong> This medicine requires a valid prescription before dispatch. Upload your prescription and our pharmacy will review it carefully.
                                    </p>
                                </div>
                            )}

                            {/* Tabs */}
                            <div className="glass-card p-7">
                                <div className="flex flex-wrap gap-2 border-b border-border pb-4 mb-5">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.key}
                                            type="button"
                                            onClick={() => setActiveTab(tab.key)}
                                            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-200 ${
                                                activeTab === tab.key
                                                    ? 'bg-primary text-white shadow-md'
                                                    : 'text-text-muted hover:bg-bg hover:text-text'
                                            }`}
                                        >
                                            <Icon name={tab.icon} className="h-4 w-4" />
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                                <div className="relative min-h-[120px]">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={activeTab}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className="text-base leading-relaxed text-text-muted absolute inset-0"
                                        >
                                            {activeTab === 'details' && <p>{product.details}</p>}
                                            {activeTab === 'uses' && <ListBlock items={product.uses} />}
                                            {activeTab === 'sideEffects' && <ListBlock items={product.sideEffects} />}
                                            {activeTab === 'directions' && <ListBlock items={product.directions} />}
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* Related products */}
            {relatedProducts.length > 0 && (
                <section className="bg-bg py-16 sm:py-24 border-t border-border">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <Reveal className="space-y-10">
                            <div className="flex items-end justify-between gap-6">
                                <div>
                                    <span className="kicker">Related</span>
                                    <h2 className="display-heading text-3xl sm:text-4xl !mb-0">
                                        More from {product.category}
                                    </h2>
                                </div>
                                <Link
                                    to={`/products?category=${encodeURIComponent(product.category)}`}
                                    className="hidden items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary transition-opacity hover:opacity-70 md:inline-flex"
                                >
                                    View All
                                    <Icon name="ArrowRight" className="h-4 w-4" />
                                </Link>
                            </div>
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {relatedProducts.map((item) => (
                                    <ProductCard key={item.id} product={item} />
                                ))}
                            </div>
                        </Reveal>
                    </div>
                </section>
            )}
        </>
    );
}

function ListBlock({ items }) {
    return (
        <ul className="space-y-4">
            {items.map((item) => (
                <li key={item} className="flex items-start gap-4">
                    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
                        <Icon name="CheckCircle2" className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-text-muted">{item}</span>
                </li>
            ))}
        </ul>
    );
}