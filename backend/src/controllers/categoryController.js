import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { asyncHandler, Errors } from '../utils/errors.js';
import { cacheGet, cacheSet, cacheDel, cacheInvalidatePattern } from '../config/redis.js';

/**
 * Create a category
 * POST /api/categories
 */
export const createCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const slug = name.toLowerCase().replace(/\s+/g, '-');

    try {
        const category = await Category.create({ name, slug });
        await cacheDel('categories_all');
        res.status(201).json({ success: true, category });
    } catch (error) {
        if (error.code === 11000) {
            throw Errors.conflict('Category already exists');
        }
        throw error;
    }
});

/**
 * Get all categories
 * GET /api/categories
 */
export const getCategories = asyncHandler(async (req, res) => {
    const cachedCategories = await cacheGet('categories_all');

    if (cachedCategories) {
        return res.json({ success: true, categories: cachedCategories });
    }

    const categories = await Category.find().sort({ name: 1 });
    await cacheSet('categories_all', categories, 600); // 10 mins cache

    res.json({ success: true, categories });
});

/**
 * Get category by slug
 * GET /api/categories/slug/:slug
 */
export const getCategoryBySlug = asyncHandler(async (req, res) => {
    const category = await Category.findOne({ slug: req.params.slug });

    if (!category) {
        throw Errors.notFound('Category not found');
    }

    res.json({ success: true, category });
});

/**
 * Update a category
 * PUT /api/categories/:id
 */
export const updateCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const slug = name.toLowerCase().replace(/\s+/g, '-');

    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { name, slug },
            { new: true, runValidators: true }
        );

        if (!category) {
            throw Errors.notFound('Category not found');
        }

        await cacheDel('categories_all');
        
        // Also invalidate products cache as category names might change
        await cacheInvalidatePattern('products_*');

        res.json({ success: true, category });
    } catch (error) {
        if (error.code === 11000) {
            throw Errors.conflict('Category name already exists');
        }
        throw error;
    }
});

/**
 * Delete a category
 * DELETE /api/categories/:id
 */
export const deleteCategory = asyncHandler(async (req, res) => {
    const categoryId = req.params.id;

    // Check if category is used by any products
    const productsCount = await Product.countDocuments({ category: categoryId });
    if (productsCount > 0) {
        throw Errors.conflict(`Cannot delete category. It is used by ${productsCount} products.`);
    }

    const category = await Category.findByIdAndDelete(categoryId);

    if (!category) {
        throw Errors.notFound('Category not found');
    }

    await cacheDel('categories_all');

    res.json({ success: true, message: 'Category deleted successfully' });
});
