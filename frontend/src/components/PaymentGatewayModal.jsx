import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Icon from './Icons';
import toast from 'react-hot-toast';

export default function PaymentGatewayModal({ isOpen, onClose, totalAmount, cartItems, onPaymentSuccess }) {
    const { user } = useAuth();
    const [selectedMethod, setSelectedMethod] = useState('upi'); // 'upi', 'card', 'netbanking', 'wallet', 'cod'
    
    // Form States
    const [upiId, setUpiId] = useState('');
    const [upiApp, setUpiApp] = useState('gpay');
    
    const [cardData, setCardData] = useState({
        number: '',
        name: '',
        expiry: '',
        cvv: ''
    });

    const [selectedBank, setSelectedBank] = useState('HDFC');
    const [selectedWallet, setSelectedWallet] = useState('Paytm');
    
    const [processing, setProcessing] = useState(false);
    const [showOtpStep, setShowOtpStep] = useState(false);
    const [otp, setOtp] = useState('');

    if (!isOpen) return null;

    // Card formatting helpers
    const handleCardNumberChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 16);
        const formatted = value.replace(/(.{4})/g, '$1 ').trim();
        setCardData({ ...cardData, number: formatted });
    };

    const handleExpiryChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 4);
        let formatted = value;
        if (value.length >= 2) {
            formatted = `${value.slice(0, 2)}/${value.slice(2)}`;
        }
        setCardData({ ...cardData, expiry: formatted });
    };

    const handleInitiatePayment = (e) => {
        e.preventDefault();

        // ── FINAL GUARD: Re-verify prescription approval right before payment ──
        if (user) {
            const cleanEmail = (user.email || '').toLowerCase();
            let hasApproved = false;
            try {
                const globalRx = JSON.parse(localStorage.getItem('jaya_all_prescriptions') || '[]');
                const emailRx = JSON.parse(localStorage.getItem(`jaya_prescriptions_${cleanEmail}`) || '[]');
                const sessionRx = JSON.parse(sessionStorage.getItem('jaya_session_prescriptions') || '[]');
                const all = [
                    ...globalRx.filter(r => r.userEmail && r.userEmail.toLowerCase() === cleanEmail),
                    ...emailRx,
                    ...sessionRx.filter(r => r.userEmail && r.userEmail.toLowerCase() === cleanEmail)
                ];
                hasApproved = all.some(r => r.status === 'APPROVED');
            } catch (_) {}
            if (!hasApproved) {
                toast.error('🔒 Payment BLOCKED: No approved prescription found. Please get Medical Agent approval first.', { duration: 6000 });
                onClose();
                return;
            }
        }

        if (selectedMethod === 'upi' && !upiId.trim() && upiApp === 'custom') {
            toast.error('Please enter a valid UPI ID (e.g. name@okaxis)');
            return;
        }

        if (selectedMethod === 'card') {
            const cleanNum = cardData.number.replace(/\s/g, '');
            if (cleanNum.length < 16) {
                toast.error('Please enter a valid 16-digit card number');
                return;
            }
            if (!cardData.expiry || cardData.expiry.length < 5) {
                toast.error('Please enter card expiry date (MM/YY)');
                return;
            }
            if (!cardData.cvv || cardData.cvv.length < 3) {
                toast.error('Please enter valid 3-digit CVV');
                return;
            }
        }

        if (selectedMethod === 'cod') {
            // Direct success for COD
            setProcessing(true);
            setTimeout(() => {
                setProcessing(false);
                onPaymentSuccess({
                    method: 'Cash on Delivery',
                    txnId: 'COD-' + Math.floor(100000 + Math.random() * 900000),
                    status: 'PAYMENT_PENDING_COD'
                });
            }, 1200);
            return;
        }

        // Show 3D Secure OTP step for online payments
        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
            setShowOtpStep(true);
        }, 1500);
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        if (otp.length < 4) {
            toast.error('Please enter the 6-digit OTP code');
            return;
        }

        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
            const txnId = 'TXN-' + Math.floor(10000000 + Math.random() * 90000000);
            onPaymentSuccess({
                method: selectedMethod.toUpperCase(),
                txnId,
                status: 'PAID'
            });
        }, 1800);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="bg-surface border border-border rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 relative">
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-border pb-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold font-mono tracking-wider text-primary uppercase bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
                                256-Bit SSL Encrypted Payment
                            </span>
                        </div>
                        <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-white mt-1 flex items-center gap-2">
                            <Icon name="ShieldCheck" className="w-5 h-5 text-emerald-500" />
                            MediCare Express Payment Gateway
                        </h3>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-xl text-text-muted hover:bg-surface-hover hover:text-text transition-all"
                    >
                        <Icon name="X" className="w-5 h-5" />
                    </button>
                </div>

                {/* Amount Banner */}
                <div className="bg-gradient-to-r from-primary/15 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-text-muted font-medium">Total Amount Payable</p>
                        <p className="text-2xl font-bold font-mono text-primary mt-0.5">₹{totalAmount}</p>
                    </div>
                    <div className="text-right text-xs text-text-muted">
                        <p className="font-semibold text-text">{cartItems?.length || 0} Medicine Items</p>
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-end gap-1 mt-0.5">
                            <Icon name="CheckCircle" className="w-3 h-3" /> Rx Approved
                        </p>
                    </div>
                </div>

                {/* Processing Overlay */}
                {processing ? (
                    <div className="py-16 text-center space-y-4">
                        <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto" />
                        <h4 className="text-lg font-bold font-serif text-text">Processing Secure Payment...</h4>
                        <p className="text-xs text-text-muted max-w-sm mx-auto">
                            Connecting with your bank servers. Please do not refresh or close this window.
                        </p>
                    </div>
                ) : showOtpStep ? (
                    /* 3D Secure OTP Step */
                    <form onSubmit={handleVerifyOtp} className="space-y-6 py-4">
                        <div className="bg-surface-hover border border-border rounded-2xl p-5 text-center space-y-3">
                            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                                <Icon name="Lock" className="w-6 h-6" />
                            </div>
                            <h4 className="font-bold text-base text-text">3D Secure Bank Verification</h4>
                            <p className="text-xs text-text-muted max-w-sm mx-auto">
                                Enter the 6-digit One Time Password (OTP) sent to your registered mobile number (+91 ******3210).
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-text uppercase tracking-wider text-center">
                                Enter 6-Digit OTP Code
                            </label>
                            <input
                                type="text"
                                maxLength="6"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                placeholder="1 2 3 4 5 6"
                                className="w-full text-center text-2xl font-mono tracking-[0.5em] p-3 rounded-xl border border-border bg-bg text-text focus:ring-2 focus:ring-primary outline-none"
                            />
                            <div className="flex justify-between items-center text-xs pt-1">
                                <button
                                    type="button"
                                    onClick={() => setOtp('123456')}
                                    className="text-primary font-bold hover:underline"
                                >
                                    ⚡ Fill Demo OTP (123456)
                                </button>
                                <span className="text-text-muted">Resend OTP in 30s</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowOtpStep(false)}
                                className="w-1/3 py-3 rounded-xl border border-border text-text font-bold text-xs hover:bg-surface-hover transition-all"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                className="w-2/3 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                <Icon name="CheckCircle" className="w-4 h-4" />
                                Authorize ₹{totalAmount} Payment
                            </button>
                        </div>
                    </form>
                ) : (
                    /* Main Payment Selection Form */
                    <form onSubmit={handleInitiatePayment} className="space-y-6">
                        {/* Payment Method Selector Tabs */}
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                            <button
                                type="button"
                                onClick={() => setSelectedMethod('upi')}
                                className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                                    selectedMethod === 'upi'
                                        ? 'border-primary bg-primary/10 text-primary shadow-sm'
                                        : 'border-border bg-surface text-text-muted hover:border-text-muted'
                                }`}
                            >
                                <Icon name="Smartphone" className="w-5 h-5" />
                                UPI / QR
                            </button>

                            <button
                                type="button"
                                onClick={() => setSelectedMethod('card')}
                                className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                                    selectedMethod === 'card'
                                        ? 'border-primary bg-primary/10 text-primary shadow-sm'
                                        : 'border-border bg-surface text-text-muted hover:border-text-muted'
                                }`}
                            >
                                <Icon name="CreditCard" className="w-5 h-5" />
                                Cards
                            </button>

                            <button
                                type="button"
                                onClick={() => setSelectedMethod('netbanking')}
                                className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                                    selectedMethod === 'netbanking'
                                        ? 'border-primary bg-primary/10 text-primary shadow-sm'
                                        : 'border-border bg-surface text-text-muted hover:border-text-muted'
                                }`}
                            >
                                <Icon name="Building2" className="w-5 h-5" />
                                Net Banking
                            </button>

                            <button
                                type="button"
                                onClick={() => setSelectedMethod('wallet')}
                                className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                                    selectedMethod === 'wallet'
                                        ? 'border-primary bg-primary/10 text-primary shadow-sm'
                                        : 'border-border bg-surface text-text-muted hover:border-text-muted'
                                }`}
                            >
                                <Icon name="Wallet" className="w-5 h-5" />
                                Wallets
                            </button>

                            <button
                                type="button"
                                onClick={() => setSelectedMethod('cod')}
                                className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                                    selectedMethod === 'cod'
                                        ? 'border-primary bg-primary/10 text-primary shadow-sm'
                                        : 'border-border bg-surface text-text-muted hover:border-text-muted'
                                }`}
                            >
                                <Icon name="Banknote" className="w-5 h-5" />
                                Cash (COD)
                            </button>
                        </div>

                        {/* UPI Method Section */}
                        {selectedMethod === 'upi' && (
                            <div className="bg-surface-hover border border-border rounded-2xl p-5 space-y-4">
                                <div className="flex items-center gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setUpiApp('gpay')}
                                        className={`flex-1 p-3 rounded-xl border text-xs font-bold transition-all ${upiApp === 'gpay' ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-surface text-text'}`}
                                    >
                                        Google Pay
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setUpiApp('phonepe')}
                                        className={`flex-1 p-3 rounded-xl border text-xs font-bold transition-all ${upiApp === 'phonepe' ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-surface text-text'}`}
                                    >
                                        PhonePe
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setUpiApp('paytm')}
                                        className={`flex-1 p-3 rounded-xl border text-xs font-bold transition-all ${upiApp === 'paytm' ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-surface text-text'}`}
                                    >
                                        Paytm UPI
                                    </button>
                                </div>

                                <div className="text-center py-3 border-t border-border/60 space-y-3">
                                    <p className="text-xs text-text-muted font-medium">Scan QR Code using any UPI App (GPay, PhonePe, Paytm, BHIM)</p>
                                    <div className="w-44 h-44 mx-auto bg-white p-2.5 rounded-2xl border border-border flex items-center justify-center shadow-lg group relative">
                                        <img
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`upi://pay?pa=6205799567@kotakbank&pn=MediCare&am=${totalAmount}&cu=INR`)}`}
                                            alt="UPI QR Code 6205799567@kotakbank"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <div className="inline-flex items-center gap-2 bg-surface p-2 px-3 rounded-xl border border-border shadow-sm">
                                        <span className="text-xs font-mono font-bold text-primary">6205799567@kotakbank</span>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                navigator.clipboard.writeText('6205799567@kotakbank');
                                                toast.success('UPI ID 6205799567@kotakbank copied!');
                                            }}
                                            className="text-[10px] font-bold text-secondary hover:underline bg-secondary/10 px-2 py-0.5 rounded-md"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Card Method Section */}
                        {selectedMethod === 'card' && (
                            <div className="bg-surface-hover border border-border rounded-2xl p-5 space-y-4">
                                <div className="space-y-1">
                                    <label className="block text-xs font-bold text-text uppercase tracking-wider">Card Number</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={cardData.number}
                                            onChange={handleCardNumberChange}
                                            placeholder="4532 •••• •••• 8892"
                                            className="w-full text-sm font-mono p-3 rounded-xl border border-border bg-bg text-text focus:ring-2 focus:ring-primary outline-none"
                                        />
                                        <Icon name="CreditCard" className="w-5 h-5 text-text-muted absolute right-3 top-3" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="block text-xs font-bold text-text uppercase tracking-wider">Expiry (MM/YY)</label>
                                        <input
                                            type="text"
                                            value={cardData.expiry}
                                            onChange={handleExpiryChange}
                                            placeholder="08/28"
                                            className="w-full text-sm font-mono p-3 rounded-xl border border-border bg-bg text-text focus:ring-2 focus:ring-primary outline-none"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-xs font-bold text-text uppercase tracking-wider">CVV Code</label>
                                        <input
                                            type="password"
                                            maxLength="4"
                                            value={cardData.cvv}
                                            onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '') })}
                                            placeholder="•••"
                                            className="w-full text-sm font-mono p-3 rounded-xl border border-border bg-bg text-text focus:ring-2 focus:ring-primary outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Net Banking Section */}
                        {selectedMethod === 'netbanking' && (
                            <div className="bg-surface-hover border border-border rounded-2xl p-5 space-y-3">
                                <label className="block text-xs font-bold text-text uppercase tracking-wider">Select Popular Bank</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra'].map((bank) => (
                                        <button
                                            key={bank}
                                            type="button"
                                            onClick={() => setSelectedBank(bank)}
                                            className={`p-3 rounded-xl border text-xs font-bold transition-all text-left ${selectedBank === bank ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-surface text-text'}`}
                                        >
                                            {bank}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Wallet Section */}
                        {selectedMethod === 'wallet' && (
                            <div className="bg-surface-hover border border-border rounded-2xl p-5 space-y-3">
                                <label className="block text-xs font-bold text-text uppercase tracking-wider">Select E-Wallet</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['Paytm Wallet', 'Amazon Pay', 'PhonePe Wallet', 'Mobikwik'].map((wallet) => (
                                        <button
                                            key={wallet}
                                            type="button"
                                            onClick={() => setSelectedWallet(wallet)}
                                            className={`p-3 rounded-xl border text-xs font-bold transition-all text-left ${selectedWallet === wallet ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-surface text-text'}`}
                                        >
                                            {wallet}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* COD Section */}
                        {selectedMethod === 'cod' && (
                            <div className="bg-surface-hover border border-border rounded-2xl p-5 space-y-2">
                                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                                    <Icon name="CheckCircle" className="w-4 h-4" />
                                    Cash on Delivery Available
                                </div>
                                <p className="text-xs text-text-muted">
                                    Pay cash or scan delivery agent QR code when your medicines are delivered to your doorstep.
                                </p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full py-4 rounded-2xl bg-primary hover:bg-primary-dark text-white font-bold text-sm transition-all shadow-xl shadow-primary/25 flex items-center justify-center gap-2"
                        >
                            <Icon name="Lock" className="w-4 h-4" />
                            {selectedMethod === 'cod' ? `Confirm Cash on Delivery Order (₹${totalAmount})` : `Proceed to Pay ₹${totalAmount}`}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
