import Order from '../models/Order.js';
import { asyncHandler, Errors } from '../utils/errors.js';

/**
 * Get all orders (admin). Supports pagination and status filtering.
 * GET /api/admin/orders?page=1&limit=20&status=PROCESSING
 */
export const getOrders = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, status } = req.query;
    const filter = {};

    if (status) {
        filter.order_status = status;
    }

    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
        Order.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('items.product', 'name image_url'),
        Order.countDocuments(filter),
    ]);

    res.json({
        success: true,
        orders,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / limit),
        },
    });
});

/**
 * Update the status of an order (admin).
 * PUT /api/admin/orders/:id/status
 */
export const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
        throw Errors.notFound('Order not found');
    }

    order.order_status = status;
    await order.save();

    res.json({
        success: true,
        message: `Order status updated to ${status}`,
        order,
    });
});
