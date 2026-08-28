import { createContext, useContext, useState, useEffect } from 'react';
import { getApiBaseUrl } from '../services/api';

const AuthContext = createContext();

// Default registered user accounts database in local storage
const DEFAULT_USERS = [
    {
        id: 'usr_demo_customer',
        name: 'Rahul Sharma',
        email: 'customer@demo.com',
        password: 'password123',
        role: 'customer',
        phone: '9876543210',
        address: '123 Health Park, New Delhi, India'
    },
    {
        id: 'usr_demo_agent',
        name: 'Dr. Ananya Verma',
        email: 'agent@demo.com',
        password: 'password123',
        role: 'agent',
        phone: '9123456789',
        address: 'Jaya Medical Store, Store #42, Mumbai',
        agentCode: 'AG-8849',
        licenseNumber: 'MH-PHARM-2024-9918'
    }
];

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem('jaya_user');
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    const [token, setToken] = useState(() => {
        return localStorage.getItem('jaya_token') || null;
    });

    const [loading, setLoading] = useState(false);

    // Initialize registered users database in localStorage if not set
    useEffect(() => {
        const storedUsers = localStorage.getItem('jaya_registered_users');
        if (!storedUsers) {
            localStorage.setItem('jaya_registered_users', JSON.stringify(DEFAULT_USERS));
        }
    }, []);

    useEffect(() => {
        if (user && token) {
            localStorage.setItem('jaya_user', JSON.stringify(user));
            localStorage.setItem('jaya_token', token);
        } else {
            localStorage.removeItem('jaya_user');
            localStorage.removeItem('jaya_token');
        }
    }, [user, token]);

    const login = async (email, password, role = 'customer') => {
        if (user && user.email.toLowerCase() === email.toLowerCase()) {
            throw new Error(`Account (${user.email}) is already active and logged in! Simultaneous logins for the same user account are prohibited.`);
        }
        setLoading(true);

        try {
            const cleanEmail = email.trim().toLowerCase();
            const backendUrl = getApiBaseUrl();

            // Try backend API first
            try {
                const response = await fetch(`${backendUrl}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: cleanEmail, password, role })
                });

                const data = await response.json();
                if (response.ok && data.success) {
                    setUser(data.user);
                    setToken(data.token);
                    return { success: true, user: data.user };
                } else if (data.message) {
                    throw new Error(data.message);
                }
            } catch (err) {
                if (err.message && !err.message.includes('Failed to fetch') && !err.message.includes('NetworkError')) {
                    throw err;
                }
                console.warn('Backend server unreachable during login, attempting local fallback:', err.message);
            }

            // Client-side registered accounts verification (fallback if server is offline)
            const registeredUsers = JSON.parse(localStorage.getItem('jaya_registered_users') || JSON.stringify(DEFAULT_USERS));
            const existingUser = registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);

            if (!existingUser) {
                throw new Error(`No account found with email "${email}". Please create an account first.`);
            }

            if (existingUser.password !== password) {
                throw new Error('Invalid password entered. Please check your credentials.');
            }

            if (existingUser.role !== role) {
                throw new Error(`This account is registered as a ${existingUser.role.toUpperCase()}. Please switch to the ${existingUser.role === 'agent' ? 'Medical Agent' : 'Customer'} login tab.`);
            }

            const mockToken = 'mock_jwt_token_' + Date.now();
            setUser(existingUser);
            setToken(mockToken);
            return { success: true, user: existingUser };
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        setLoading(true);
        try {
            const cleanEmail = userData.email.trim().toLowerCase();
            const backendUrl = getApiBaseUrl();

            // Send registration request to backend
            try {
                const response = await fetch(`${backendUrl}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...userData, email: cleanEmail })
                });

                const data = await response.json();
                if (response.ok && data.success) {
                    const registeredUsers = JSON.parse(localStorage.getItem('jaya_registered_users') || JSON.stringify(DEFAULT_USERS));
                    registeredUsers.push(data.user);
                    localStorage.setItem('jaya_registered_users', JSON.stringify(registeredUsers));

                    setUser(data.user);
                    setToken(data.token);
                    return { success: true, user: data.user };
                } else if (data.message) {
                    throw new Error(data.message);
                }
            } catch (err) {
                if (err.message && !err.message.includes('Failed to fetch') && !err.message.includes('NetworkError')) {
                    throw err;
                }
                console.warn('Backend server unreachable during registration, attempting local fallback:', err.message);
            }

            // Client-side fallback if backend server is not running
            const registeredUsers = JSON.parse(localStorage.getItem('jaya_registered_users') || JSON.stringify(DEFAULT_USERS));
            const cleanPhone = userData.phone ? userData.phone.replace(/\D/g, '') : '';
            const emailExists = registeredUsers.some(u => u.email.toLowerCase() === cleanEmail);
            const phoneExists = cleanPhone && registeredUsers.some(u => u.phone && u.phone.replace(/\D/g, '') === cleanPhone);

            if (emailExists) {
                throw new Error(`An account with email "${userData.email}" already exists. Please sign in instead.`);
            }
            if (phoneExists) {
                throw new Error(`An account with phone number "${userData.phone}" already exists. Please use a different phone number.`);
            }

            const newUser = {
                id: 'usr_' + Date.now(),
                name: userData.name,
                email: cleanEmail,
                password: userData.password,
                role: userData.role || 'customer',
                phone: userData.phone || '',
                address: userData.address || '',
                agentCode: userData.agentCode || (userData.role === 'agent' ? `AG-${Math.floor(1000 + Math.random() * 9000)}` : ''),
                licenseNumber: userData.licenseNumber || ''
            };

            registeredUsers.push(newUser);
            localStorage.setItem('jaya_registered_users', JSON.stringify(registeredUsers));

            const mockToken = 'mock_jwt_token_' + Date.now();
            setUser(newUser);
            setToken(mockToken);
            return { success: true, user: newUser };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('jaya_user');
        localStorage.removeItem('jaya_token');
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, isAuthenticated: !!user, role: user?.role || null, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
