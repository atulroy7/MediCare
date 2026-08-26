import { Router } from 'express';
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct, toggleProductActive } from '../controllers/productController.js';
import { verifyAdmin } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';
import { validate } from '../middlewares/validate.js';
import { productQuerySchema } from '../utils/validators.js';

const router = Router();

router.get('/', validate(productQuerySchema, 'query'), getProducts);
router.get('/:id', getProductById);

router.post('/', verifyAdmin, upload.single('image'), createProduct);
router.put('/:id', verifyAdmin, upload.single('image'), updateProduct);
router.delete('/:id', verifyAdmin, deleteProduct);
router.patch('/:id/toggle', verifyAdmin, toggleProductActive);

export default router;
