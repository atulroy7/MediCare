import { Router } from 'express';
import { createOrder, verifyPayment, getUserOrders, getOrderById, cancelOrder, handleWebhook } from '../controllers/orderController.js';
import { verifyUser } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { createOrderSchema, verifyPaymentSchema } from '../utils/validators.js';

const router = Router();

router.post('/create', verifyUser, validate(createOrderSchema), createOrder);
router.post('/verify', verifyUser, validate(verifyPaymentSchema), verifyPayment);
router.get('/my-orders', verifyUser, getUserOrders);
router.get('/:id', verifyUser, getOrderById);
router.patch('/:id/cancel', verifyUser, cancelOrder);

// Webhook handles its own signature verification, no auth middleware needed
router.post('/webhook', handleWebhook);

export default router;
