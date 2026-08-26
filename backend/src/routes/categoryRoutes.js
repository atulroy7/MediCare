import { Router } from 'express';
import { createCategory, getCategories, getCategoryBySlug, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import { verifyAdmin } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { createCategorySchema, updateCategorySchema } from '../utils/validators.js';

const router = Router();

router.get('/', getCategories);
router.get('/slug/:slug', getCategoryBySlug);

router.post('/', verifyAdmin, validate(createCategorySchema), createCategory);
router.put('/:id', verifyAdmin, validate(updateCategorySchema), updateCategory);
router.delete('/:id', verifyAdmin, deleteCategory);

export default router;
