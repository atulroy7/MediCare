/**
 * Centralized API Service for Jaya Medical Store.
 * Handles API communication with Express backend with automatic base URL, header configuration, and error parsing.
 */

export const getApiBaseUrl = () => {
    if (import.meta.env.VITE_API_URL) {
        let url = import.meta.env.VITE_API_URL.trim().replace(/\/+$/, '');
        if (!url.endsWith('/api')) {
            url += '/api';
        }
        return url;
    }
    
    // In production browser, if no VITE_API_URL is provided, dynamically use the current domain
    if (typeof window !== 'undefined' && window.location && window.location.hostname && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        return `${window.location.origin}/api`;
    }

    return 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();

async function request(endpoint, options = {}) {
    const token = localStorage.getItem('jaya_auth_token');

    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const config = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const error = new Error(errorData.message || `Request failed with status ${response.status}`);
            error.status = response.status;
            error.data = errorData;
            throw error;
        }

        return await response.json();
    } catch (err) {
        console.error(`[API Error] ${endpoint}:`, err.message);
        throw err;
    }
}

export const api = {
    // Auth
    login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
    getProfile: () => request('/auth/me'),

    // Products
    getProducts: (params = '') => request(`/products${params}`),
    getProductById: (id) => request(`/products/${id}`),

    // Categories
    getCategories: () => request('/categories'),

    // Orders
    createOrder: (orderData) => request('/orders', { method: 'POST', body: JSON.stringify(orderData) }),
    getUserOrders: () => request('/orders/my-orders'),
    getOrderById: (id) => request(`/orders/${id}`),

    // Prescriptions / Agent
    uploadPrescription: (formData) => request('/prescriptions/upload', {
        method: 'POST',
        headers: {}, // Let browser set Content-Type header with boundary for FormData
        body: formData,
    }),
    getAgentQueue: () => request('/admin/prescriptions'),
    updatePrescriptionStatus: (id, status) => request(`/admin/prescriptions/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
    }),
};

export default api;
