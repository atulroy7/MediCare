import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { products } from '../data/products';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const userCartKey = useMemo(() => {
        if (!user) return 'medicare-cart-guest';
        return `medicare-cart-${user.id || user.email}`;
    }, [user]);

    const legacyUserCartKey = useMemo(() => {
        if (!user) return 'jaya-medical-cart-guest';
        return `jaya-medical-cart-${user.id || user.email}`;
    }, [user]);

    const [items, setItems] = useState([]);

    // Sync items when user or cart key changes
    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            const raw = window.localStorage.getItem(userCartKey) || window.localStorage.getItem(legacyUserCartKey);
            if (raw) {
                const parsed = JSON.parse(raw);
                setItems(Array.isArray(parsed) ? parsed : []);
            } else {
                setItems([]);
            }
        } catch {
            setItems([]);
        }
    }, [userCartKey, legacyUserCartKey]);

    // Save items to user-specific localStorage key on change
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (userCartKey) {
            window.localStorage.setItem(userCartKey, JSON.stringify(items));
        }
    }, [items, userCartKey]);

    const addToCart = (product, quantity = 1) => {
        if (!isAuthenticated || !user) {
            toast.error('Please log in or create an account to add items to your cart.', {
                duration: 4000,
                icon: '🔒'
            });
            navigate('/login', { state: { from: window.location.pathname } });
            return false;
        }

        setItems((currentItems) => {
            const existing = currentItems.find((item) => item.id === product.id);
            if (existing) {
                return currentItems.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
                );
            }
            return [...currentItems, { ...product, quantity }];
        });

        toast.success(`Added ${product.name} to cart!`, { duration: 1000 });
        return true;
    };

    const setItemQuantity = (productId, quantity) => {
        if (quantity < 1) return;

        setItems((currentItems) =>
            currentItems.map((item) => (item.id === productId ? { ...item, quantity } : item)),
        );
    };

    const removeFromCart = (productId) => {
        setItems((currentItems) => currentItems.filter((item) => item.id !== productId));
    };

    const clearCart = () => setItems([]);

    const cartCount = useMemo(
        () => items.reduce((total, item) => total + item.quantity, 0),
        [items],
    );

    const subtotal = useMemo(
        () => items.reduce((total, item) => total + item.price * item.quantity, 0),
        [items],
    );

    const cartProducts = useMemo(
        () => items.map((item) => products.find((product) => product.id === item.id) || item),
        [items],
    );

    const value = {
        items,
        cartProducts,
        cartCount,
        subtotal,
        addToCart,
        setItemQuantity,
        removeFromCart,
        clearCart,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used inside CartProvider');
    }
    return context;
};