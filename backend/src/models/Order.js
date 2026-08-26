import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    user_id: { type: String, required: true }, // Firebase UID
    user_name: { type: String, required: true },
    user_phone: { type: String, required: true },
    shipping_address: { type: String, required: true },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: String,
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
    }],
    total_amount: { type: Number, required: true },
    prescription_url: { type: String }, // Optional, needed if items require prescription
    razorpay_order_id: { type: String },
    razorpay_payment_id: { type: String },
    payment_status: { type: String, enum: ['PENDING', 'PAID', 'FAILED'], default: 'PENDING' },
    order_status: { type: String, enum: ['PROCESSING', 'OUT_FOR_DELIVERY', 'COMPLETED', 'CANCELLED'], default: 'PROCESSING' }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
