import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { featuredCategories } from '../data/products';
import Icon from './Icons';
import ThemeToggle from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const { cartCount } = useCart();
    const { user, role, isAuthenticated } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [catDropdownOpen, setCatDropdownOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setMenuOpen(false);
        setCatDropdownOpen(false);
    }, [location.pathname]);

    return (
        <header className="sticky top-4 z-50 px-4 sm:px-6 lg:px-8 mb-6 pointer-events-none">
            <div className="mx-auto max-w-7xl pointer-events-auto">
                <nav aria-label="Primary navigation" className="bg-[var(--glass-bg)] border border-[var(--glass-border)] shadow-xl shadow-primary/5 backdrop-blur-2xl rounded-full px-5 py-3 transition-all duration-300 flex items-center justify-between">
                    
                    {/* Brand Logo */}
                    <Link to="/" className="flex items-center gap-2.5 group pl-1">
                        <div className="bg-primary text-white p-2 rounded-full group-hover:scale-105 transition-transform shadow-md shadow-primary/30">
                            <Icon name="Activity" className="h-4 w-4" />
                        </div>
                        <p className="font-serif text-lg font-bold tracking-tight text-text">MediCare</p>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <div className="hidden lg:flex items-center gap-1 bg-bg-subtle/80 p-1 rounded-full border border-border/50">
                        <NavLink to="/" className={({ isActive }) => navCapsuleClass(isActive)}>
                            Home
                        </NavLink>

                        {role === 'agent' ? (
                            <>
                                <NavLink to="/dashboard" className={({ isActive }) => navCapsuleClass(isActive)}>
                                    Agent Workstation
                                </NavLink>
                                <NavLink to="/about" className={({ isActive }) => navCapsuleClass(isActive)}>
                                    About
                                </NavLink>
                                <NavLink to="/contact" className={({ isActive }) => navCapsuleClass(isActive)}>
                                    Contact
                                </NavLink>
                            </>
                        ) : (
                            <>
                                <NavLink to="/products" className={({ isActive }) => navCapsuleClass(isActive)} end>
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
                                        className="px-4 py-1.5 rounded-full text-xs font-semibold text-text-muted hover:text-text hover:bg-surface/80 transition-all flex items-center gap-1"
                                    >
                                        <span>Categories</span>
                                        <Icon name="ChevronDown" className={`w-3 h-3 transition-transform duration-200 ${catDropdownOpen ? 'rotate-180 text-primary' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                        {catDropdownOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                                transition={{ duration: 0.18 }}
                                                className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-64 z-50"
                                            >
                                                <div className="bg-surface/95 border border-border backdrop-blur-2xl rounded-3xl shadow-2xl p-2.5 space-y-1">
                                                    {featuredCategories.map((cat) => (
                                                        <Link
                                                            key={cat.name}
                                                            to={`/products?category=${encodeURIComponent(cat.name)}`}
                                                            className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-bg-subtle transition-colors text-xs font-semibold text-text group"
                                                        >
                                                            <div className="p-1.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
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

                                <NavLink to="/prescription" className={({ isActive }) => navCapsuleClass(isActive)}>
                                    Prescription
                                </NavLink>
                                <NavLink to="/about" className={({ isActive }) => navCapsuleClass(isActive)}>
                                    About
                                </NavLink>
                                <NavLink to="/contact" className={({ isActive }) => navCapsuleClass(isActive)}>
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
                                className="bg-bg-subtle/80 hover:bg-surface text-text relative flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border border-border/80 transition-all hover:scale-105"
                            >
                                <Icon name="ShoppingCart" className="h-4 w-4 text-primary" />
                                <span>Cart</span>
                                <AnimatePresence>
                                    {cartCount > 0 && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            className="flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[9px] font-bold text-white shadow-sm"
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
                                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all text-xs font-bold text-primary"
                            >
                                <span className={`w-2 h-2 rounded-full ${role === 'agent' ? 'bg-secondary' : 'bg-primary'}`} />
                                <span className="max-w-[100px] truncate">{user?.name || 'Account'}</span>
                                <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded-full bg-primary text-white">
                                    {role === 'agent' ? 'Agent' : 'User'}
                                </span>
                            </Link>
                        ) : (
                            <Link
                                to="/login"
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white hover:bg-primary-dark transition-all text-xs font-bold shadow-md shadow-primary/25 hover:scale-105"
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
                            className="p-2 rounded-full bg-bg-subtle text-text hover:bg-surface transition-colors border border-border/80"
                            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={menuOpen}
                            onClick={() => setMenuOpen((value) => !value)}
                        >
                            <Icon name={menuOpen ? 'X' : 'Menu'} className="h-4 w-4" />
                        </button>
                    </div>
                </nav>

                {/* Mobile Dropdown Container */}
                <AnimatePresence>
                    {menuOpen && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 8, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.98 }}
                            className="mt-2 bg-surface/95 border border-border backdrop-blur-2xl rounded-3xl shadow-2xl lg:hidden overflow-hidden p-4"
                        >
                            <div className="flex flex-col gap-2">
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
                                        <div className="py-2 border-y border-border my-1 space-y-1">
                                            <span className="text-[10px] uppercase font-extrabold text-text-muted tracking-wider px-3 block">
                                                Explore Categories
                                            </span>
                                            <div className="grid grid-cols-2 gap-1.5 pt-1">
                                                {featuredCategories.map((cat) => (
                                                    <Link
                                                        key={cat.name}
                                                        to={`/products?category=${encodeURIComponent(cat.name)}`}
                                                        className="p-2 rounded-xl text-xs font-semibold text-text bg-bg-subtle/50 hover:bg-bg-subtle flex items-center gap-2"
                                                    >
                                                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                        <span className="truncate">{cat.name}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>

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
                                                    <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-white">{cartCount}</span>
                                                )}
                                            </span>
                                        </NavLink>
                                    </>
                                )}

                                {isAuthenticated ? (
                                    <NavLink to="/dashboard" className={({ isActive }) => mobileNavClass(isActive)}>
                                        <span className="flex items-center justify-between w-full">
                                            <span>Dashboard ({user?.name})</span>
                                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                                {role === 'agent' ? 'Agent' : 'Customer'}
                                            </span>
                                        </span>
                                    </NavLink>
                                ) : (
                                    <NavLink to="/login" className={({ isActive }) => mobileNavClass(isActive)}>
                                        Login / Register Account
                                    </NavLink>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
}

const navCapsuleClass = (isActive) =>
    [
        'px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200',
        isActive ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105' : 'text-text-muted hover:text-text hover:bg-surface/80',
    ].join(' ');

const mobileNavClass = (isActive) =>
    [
        'flex items-center p-3 rounded-2xl text-xs font-bold transition-colors',
        isActive ? 'bg-primary/10 text-primary' : 'text-text hover:bg-bg-subtle',
    ].join(' ');