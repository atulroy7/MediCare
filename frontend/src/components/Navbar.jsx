import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { featuredCategories } from '../data/products';
import Logo from './Logo';
import Icon from './Icons';
import ThemeToggle from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const { cartCount } = useCart();
    const { user, role, isAuthenticated } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [catDropdownOpen, setCatDropdownOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setMenuOpen(false);
        setCatDropdownOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-[var(--glass-bg)] backdrop-blur-xl border-b border-[var(--glass-border)] shadow-sm' : 'bg-transparent'}`}>
            <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
                <nav aria-label="Primary navigation" className="flex items-center justify-between h-16">

                    {/* Brand Logo */}
                    <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
                        <Logo className="h-7 w-7 transition-transform duration-200 group-hover:scale-105" />
                        <span className="font-serif text-lg font-bold tracking-tight text-[rgb(var(--color-text))]">MediCare</span>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <div className="hidden lg:flex items-center gap-6">
                        <NavLink to="/" className={({ isActive }) => navLinkClass(isActive)}>
                            Home
                        </NavLink>

                        {role === 'agent' ? (
                            <>
                                <NavLink to="/dashboard" className={({ isActive }) => navLinkClass(isActive)}>
                                    Agent Workstation
                                </NavLink>
                                <NavLink to="/about" className={({ isActive }) => navLinkClass(isActive)}>
                                    About
                                </NavLink>
                                <NavLink to="/contact" className={({ isActive }) => navLinkClass(isActive)}>
                                    Contact
                                </NavLink>
                            </>
                        ) : (
                            <>
                                <NavLink to="/products" className={({ isActive }) => navLinkClass(isActive)} end>
                                    Products
                                </NavLink>

                                {/* Categories Dropdown */}
                                <div
                                    className="relative"
                                    onMouseEnter={() => setCatDropdownOpen(true)}
                                    onMouseLeave={() => setCatDropdownOpen(false)}
                                >
                                    <button
                                        type="button"
                                        onClick={() => setCatDropdownOpen(prev => !prev)}
                                        className="flex items-center gap-1 text-sm font-medium text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))] transition-colors"
                                    >
                                        <span>Categories</span>
                                        <Icon name="ChevronDown" className={`w-3.5 h-3.5 transition-transform duration-200 ${catDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                        {catDropdownOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 6 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute left-1/2 -translate-x-1/2 top-full pt-4 w-60 z-50"
                                            >
                                                <div className="bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-xl rounded-2xl shadow-xl p-2 space-y-0.5">
                                                    {featuredCategories.map((cat) => (
                                                        <Link
                                                            key={cat.name}
                                                            to={`/products?category=${encodeURIComponent(cat.name)}`}
                                                            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[rgb(var(--color-bg-subtle))] transition-colors text-sm font-medium text-[rgb(var(--color-text))]"
                                                        >
                                                            <div className="p-1.5 rounded-lg bg-[rgb(var(--color-bg-subtle))] text-[rgb(var(--color-primary))]">
                                                                <Icon name={cat.iconKey || 'Pill'} className="w-3.5 h-3.5" />
                                                            </div>
                                                            <span>{cat.name}</span>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <NavLink to="/prescription" className={({ isActive }) => navLinkClass(isActive)}>
                                    Prescription
                                </NavLink>
                                <NavLink to="/about" className={({ isActive }) => navLinkClass(isActive)}>
                                    About
                                </NavLink>
                                <NavLink to="/contact" className={({ isActive }) => navLinkClass(isActive)}>
                                    Contact
                                </NavLink>
                            </>
                        )}
                    </div>

                    {/* Actions Right */}
                    <div className="hidden lg:flex items-center gap-3">
                        <ThemeToggle />

                        {role !== 'agent' && (
                            <Link
                                to="/cart"
                                className="relative flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))] transition-colors"
                            >
                                <Icon name="ShoppingCart" className="h-4 w-4" />
                                <span>Cart</span>
                                <AnimatePresence>
                                    {cartCount > 0 && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            className="flex h-4 w-4 items-center justify-center rounded-full bg-[rgb(var(--color-primary))] text-[9px] font-bold text-white"
                                        >
                                            {cartCount}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </Link>
                        )}

                        {isAuthenticated ? (
                            <Link
                                to="/dashboard"
                                className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-[rgb(var(--color-bg-subtle))] border border-[rgb(var(--color-border))] hover:bg-[rgb(var(--color-surface))] transition-colors text-sm font-medium text-[rgb(var(--color-text))]"
                            >
                                <span className="max-w-[100px] truncate">{user?.name || 'Account'}</span>
                                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))]">
                                    {role === 'agent' ? 'Agent' : 'User'}
                                </span>
                            </Link>
                        ) : (
                            <Link
                                to="/login"
                                className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-[rgb(var(--color-primary))] text-white hover:opacity-90 transition-opacity text-sm font-medium"
                            >
                                <Icon name="User" className="h-3.5 w-3.5" />
                                <span>Login</span>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <div className="flex items-center gap-2 lg:hidden">
                        <ThemeToggle />
                        <button
                            type="button"
                            className="p-2 rounded-lg text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-bg-subtle))] transition-colors"
                            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={menuOpen}
                            onClick={() => setMenuOpen((value) => !value)}
                        >
                            <Icon name={menuOpen ? 'X' : 'Menu'} className="h-5 w-5" />
                        </button>
                    </div>
                </nav>
            </div>

            {/* Mobile Dropdown */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="lg:hidden border-t border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-xl overflow-hidden"
                    >
                        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-4 flex flex-col gap-1">
                            <NavLink to="/" className={({ isActive }) => mobileNavClass(isActive)}>
                                Home
                            </NavLink>

                            {role === 'agent' ? (
                                <>
                                    <NavLink to="/dashboard" className={({ isActive }) => mobileNavClass(isActive)}>
                                        Agent Workstation
                                    </NavLink>
                                    <NavLink to="/about" className={({ isActive }) => mobileNavClass(isActive)}>
                                        About Pharmacy
                                    </NavLink>
                                    <NavLink to="/contact" className={({ isActive }) => mobileNavClass(isActive)}>
                                        Contact Support
                                    </NavLink>
                                </>
                            ) : (
                                <>
                                    <div className="pt-3 pb-1">
                                        <span className="text-[10px] uppercase font-semibold text-[rgb(var(--color-text-muted))] tracking-wider px-3 block mb-2">
                                            Categories
                                        </span>
                                        <div className="grid grid-cols-2 gap-1">
                                            {featuredCategories.map((cat) => (
                                                <Link
                                                    key={cat.name}
                                                    to={`/products?category=${encodeURIComponent(cat.name)}`}
                                                    className="px-3 py-2 rounded-lg text-sm font-medium text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-bg-subtle))] transition-colors truncate"
                                                >
                                                    {cat.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="h-px bg-[rgb(var(--color-border))] my-1" />

                                    <NavLink to="/products" className={({ isActive }) => mobileNavClass(isActive)}>
                                        All Products
                                    </NavLink>
                                    <NavLink to="/prescription" className={({ isActive }) => mobileNavClass(isActive)}>
                                        Prescription Upload
                                    </NavLink>
                                    <NavLink to="/cart" className={({ isActive }) => mobileNavClass(isActive)}>
                                        <span className="flex items-center justify-between w-full">
                                            Cart
                                            {cartCount > 0 && (
                                                <span className="rounded bg-[rgb(var(--color-primary))] px-2 py-0.5 text-[10px] font-bold text-white">{cartCount}</span>
                                            )}
                                        </span>
                                    </NavLink>
                                </>
                            )}

                            <div className="h-px bg-[rgb(var(--color-border))] my-1" />

                            {isAuthenticated ? (
                                <NavLink to="/dashboard" className={({ isActive }) => mobileNavClass(isActive)}>
                                    <span className="flex items-center justify-between w-full">
                                        <span>Dashboard ({user?.name})</span>
                                        <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))]">
                                            {role === 'agent' ? 'Agent' : 'Customer'}
                                        </span>
                                    </span>
                                </NavLink>
                            ) : (
                                <NavLink to="/login" className={({ isActive }) => mobileNavClass(isActive)}>
                                    Login / Register
                                </NavLink>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}

const navLinkClass = (isActive) =>
    [
        'text-sm font-medium transition-colors duration-150',
        isActive
            ? 'text-[rgb(var(--color-primary))]'
            : 'text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))]',
    ].join(' ');

const mobileNavClass = (isActive) =>
    [
        'flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
        isActive
            ? 'text-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))]/8'
            : 'text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-bg-subtle))]',
    ].join(' ');