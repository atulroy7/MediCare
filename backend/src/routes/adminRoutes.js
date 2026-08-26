import { Router } from 'express';
import { getOrders, updateOrderStatus } from '../controllers/adminController.js';
import { verifyAdmin } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { updateOrderStatusSchema, orderQuerySchema } from '../utils/validators.js';

const router = Router();

router.get('/orders', verifyAdmin, validate(orderQuerySchema, 'query'), getOrders);
router.put('/orders/:id/status', verifyAdmin, validate(updateOrderStatusSchema), updateOrderStatus);

export default router;
