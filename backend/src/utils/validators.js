import { z } from 'zod';

// ─── Reusable field schemas ───────────────────────────────────────────────────

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid ObjectId format');
const phone = z.string().regex(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits');
const positiveNumber = z.number().positive('Must be a positive number');

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const adminLoginSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
});

export const userLoginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
    role: z.enum(['customer', 'agent']).optional().default('customer'),
});

export const userRegisterSchema = z.object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['customer', 'agent']).optional().default('customer'),
    phone: z.string().optional().default(''),
    address: z.string().optional().default(''),
    agentCode: z.string().optional().default(''),
    licenseNumber: z.string().optional().default('')
});

// ─── Category ─────────────────────────────────────────────────────────────────

export const createCategorySchema = z.object({
    name: z.string().trim().min(1, 'Category name is required').max(100),
});

export const updateCategorySchema = z.object({
    name: z.string().trim().min(1, 'Category name is required').max(100),
});

// ─── Product ──────────────────────────────────────────────────────────────────

export const createProductSchema = z.object({
    name: z.string().trim().min(1, 'Product name is required').max(200),
    brand: z.string().trim().min(1, 'Brand is required').max(100),
    marked_price: positiveNumber,
    selling_price: positiveNumber,
    requires_prescription: z.boolean().optional().default(false),
    category: objectId,
    description: z.string().optional().default(''),
    composition: z.string().optional().default(''),
    stock: z.number().int().min(0).optional().default(0),
}).refine(
    (data) => data.selling_price <= data.marked_price,
    { message: 'Selling price cannot exceed marked price', path: ['selling_price'] },
);

export const updateProductSchema = z.object({
    name: z.string().trim().min(1).max(200).optional(),
    brand: z.string().trim().min(1).max(100).optional(),
    marked_price: positiveNumber.optional(),
    selling_price: positiveNumber.optional(),
    requires_prescription: z.boolean().optional(),
    category: objectId.optional(),
    description: z.string().optional(),
    composition: z.string().optional(),
    stock: z.number().int().min(0).optional(),
    is_active: z.boolean().optional(),
});

// ─── Order ────────────────────────────────────────────────────────────────────

const orderItemSchema = z.object({
    product: objectId,
    quantity: z.number().int().positive('Quantity must be at least 1'),
});

export const createOrderSchema = z.object({
    items: z.array(orderItemSchema).min(1, 'At least one item is required'),
    user_name: z.string().trim().min(1, 'Name is required').max(100),
    user_phone: phone,
    shipping_address: z.string().trim().min(5, 'Shipping address is required').max(500),
    prescription_url: z.string().url('Invalid URL').optional().or(z.literal('')),
});

export const verifyPaymentSchema = z.object({
    razorpay_order_id: z.string().min(1, 'Razorpay order ID is required'),
    razorpay_payment_id: z.string().min(1, 'Razorpay payment ID is required'),
    razorpay_signature: z.string().min(1, 'Razorpay signature is required'),
});

// ─── Admin ────────────────────────────────────────────────────────────────────

const ORDER_STATUSES = ['PROCESSING', 'OUT_FOR_DELIVERY', 'COMPLETED', 'CANCELLED'];

export const updateOrderStatusSchema = z.object({
    status: z.enum(ORDER_STATUSES, {
        errorMap: () => ({ message: `Status must be one of: ${ORDER_STATUSES.join(', ')}` }),
    }),
});

// ─── Query params (for GET requests) ──────────────────────────────────────────

export const productQuerySchema = z.object({
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(20),
    category: z.string().optional(),
    search: z.string().optional(),
});

export const orderQuerySchema = z.object({
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(20),
    status: z.string().optional(),
});
