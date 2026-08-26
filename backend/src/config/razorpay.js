import Razorpay from 'razorpay';

/**
 * Singleton Razorpay instance.
 * Created once on first access and reused for all subsequent calls.
 */
let instance = null;

export const getRazorpayInstance = () => {
    if (instance) return instance;

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
        console.warn('⚠️  RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET missing — payment features disabled.');
        return null;
    }

    instance = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
    });

    console.log('✅ Razorpay initialized');
    return instance;
};
