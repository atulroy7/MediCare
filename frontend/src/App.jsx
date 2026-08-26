import { lazy, Suspense, useEffect } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import PageLoader from './components/PageLoader';

const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Prescription = lazy(() => import('./pages/Prescription'));
const Contact = lazy(() => import('./pages/Contact'));
const About = lazy(() => import('./pages/About'));
const FAQ = lazy(() => import('./pages/FAQ'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsConditions = lazy(() => import('./pages/TermsConditions'));
const CancelOrder = lazy(() => import('./pages/CancelOrder'));
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Receipt = lazy(() => import('./pages/Receipt'));
const NotFound = lazy(() => import('./pages/NotFound'));

import { useAuth } from './context/AuthContext';

function CustomerOnlyRoute({ children }) {
    const { role } = useAuth();
    if (role === 'agent') {
        return <Navigate to="/dashboard" replace />;
    }
    return children;
}

function ScrollToTop() {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [location.pathname]);

    return null;
}

function Layout() {
    return (
        <div className="min-h-screen bg-[rgb(var(--color-bg))] text-[rgb(var(--color-text))] transition-colors duration-300 flex flex-col">
            <ScrollToTop />
            <Navbar />
            <BackToTop />
            <main className="flex-grow">
                <Suspense fallback={<PageLoader />}>
                    <Outlet />
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}

export default function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="products" element={<CustomerOnlyRoute><Products /></CustomerOnlyRoute>} />
                <Route path="products/:id" element={<CustomerOnlyRoute><ProductDetail /></CustomerOnlyRoute>} />
                <Route path="cart" element={<CustomerOnlyRoute><Cart /></CustomerOnlyRoute>} />
                <Route path="prescription" element={<CustomerOnlyRoute><Prescription /></CustomerOnlyRoute>} />
                <Route path="contact" element={<Contact />} />
                <Route path="about" element={<About />} />
                <Route path="faq" element={<FAQ />} />
                <Route path="privacy-policy" element={<PrivacyPolicy />} />
                <Route path="terms-conditions" element={<TermsConditions />} />
                <Route path="cancel-order" element={<CustomerOnlyRoute><CancelOrder /></CustomerOnlyRoute>} />
                <Route path="login" element={<Login />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="receipt/:orderId" element={<Receipt />} />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}