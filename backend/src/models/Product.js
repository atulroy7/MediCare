import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    image_url: { type: String, required: true },
    marked_price: { type: Number, required: true },
    selling_price: { type: Number, required: true },
    discount_percentage: { type: Number },
    requires_prescription: { type: Boolean, default: false },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    description: { type: String },
    composition: { type: String },
    stock: { type: Number, default: 0 },
    is_active: { type: Boolean, default: true }
}, { timestamps: true });

// Automatically calculate discount percentage before saving
productSchema.pre('save', function(next) {
    if (this.marked_price && this.selling_price) {
        this.discount_percentage = Math.max(0, Math.round(((this.marked_price - this.selling_price) / this.marked_price) * 100));
    }
    next();
});

export default mongoose.model('Product', productSchema);
