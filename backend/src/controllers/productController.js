import Product from '../models/Product.js';
import cloudinary from '../config/cloudinary.js';
import { asyncHandler, Errors } from '../utils/errors.js';
import { cacheGet, cacheSet, cacheInvalidatePattern } from '../config/redis.js';

/**
 * Create a new product (admin)
 * POST /api/products
 */
export const createProduct = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw Errors.badRequest('Product image is required');
    }

    // Upload image to Cloudinary
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    let dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;
    const uploadRes = await cloudinary.uploader.upload(dataURI, {
        folder: 'jaya_medical/products'
    });

    const productData = {
        ...req.body,
        image_url: uploadRes.secure_url,
    };

    const product = await Product.create(productData);

    // Invalidate product listing caches
    await cacheInvalidatePattern('products_*');

    res.status(201).json({
        success: true,
        product
    });
});

/**
 * Get paginated products with optional filters
 * GET /api/products
 */
export const getProducts = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, category, search } = req.query;
    
    // Construct cache key
    const cacheKey = `products_page_${page}_limit_${limit}_cat_${category || 'all'}_search_${search || 'none'}`;
    const cachedData = await cacheGet(cacheKey);
    
    if (cachedData) {
        return res.json(cachedData);
    }

    const filter = {};

    // Filter by active products by default (if we were for public, but let's assume this returns all for now or modify based on user)
    // We can just keep it simple: return active products for public, all for admin.
    // Assuming this endpoint is public, we should only return active products.
    // But since it's the only get list endpoint, let's keep it general, or check if admin.
    // If not admin, add { is_active: true }
    // Since req.user isn't available easily here without changing middleware, let's just use filter.
    // Let's assume frontend wants only active products if not admin, but for now we'll just return based on query or all.
    // Actually, let's just return what's in DB.

    if (category) {
        filter.category = category;
    }

    if (search) {
        // Escape regex special characters to prevent ReDoS
        const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        filter.name = { $regex: safeSearch, $options: 'i' };
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
        Product.find(filter)
            .populate('category', 'name slug')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit)),
        Product.countDocuments(filter)
    ]);

    const responseData = {
        success: true,
        products,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / limit)
        }
    };

    await cacheSet(cacheKey, responseData);

    res.json(responseData);
});

/**
 * Get a single product by ID
 * GET /api/products/:id
 */
export const getProductById = asyncHandler(async (req, res) => {
    const cacheKey = `product_${req.params.id}`;
    const cachedProduct = await cacheGet(cacheKey);

    if (cachedProduct) {
        return res.json({ success: true, product: cachedProduct });
    }

    const product = await Product.findById(req.params.id).populate('category', 'name slug');

    if (!product) {
        throw Errors.notFound('Product not found');
    }

    await cacheSet(cacheKey, product);

    res.json({
        success: true,
        product
    });
});

/**
 * Update a product
 * PUT /api/products/:id
 */
export const updateProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        throw Errors.notFound('Product not found');
    }

    const updateData = { ...req.body };

    // Handle image update
    if (req.file) {
        // Delete old image from Cloudinary if it exists and is not a default placeholder
        if (product.image_url && product.image_url.includes('cloudinary')) {
            try {
                // Extract public ID from URL
                const urlParts = product.image_url.split('/');
                const filename = urlParts[urlParts.length - 1];
                const publicId = `jaya_medical/products/${filename.split('.')[0]}`;
                await cloudinary.uploader.destroy(publicId);
            } catch (err) {
                console.error('Failed to delete old image from Cloudinary:', err);
            }
        }

        // Upload new image
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        let dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;
        const uploadRes = await cloudinary.uploader.upload(dataURI, {
            folder: 'jaya_medical/products'
        });

        updateData.image_url = uploadRes.secure_url;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
    ).populate('category', 'name slug');

    // Invalidate caches
    await cacheInvalidatePattern('products_*');
    await cacheInvalidatePattern(`product_${req.params.id}`);

    res.json({
        success: true,
        product: updatedProduct
    });
});

/**
 * Delete a product
 * DELETE /api/products/:id
 */
export const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        throw Errors.notFound('Product not found');
    }

    // Delete image from Cloudinary
    if (product.image_url && product.image_url.includes('cloudinary')) {
        try {
            const urlParts = product.image_url.split('/');
            const filename = urlParts[urlParts.length - 1];
            const publicId = `jaya_medical/products/${filename.split('.')[0]}`;
            await cloudinary.uploader.destroy(publicId);
        } catch (err) {
            console.error('Failed to delete image from Cloudinary:', err);
        }
    }

    await product.deleteOne();

    // Invalidate caches
    await cacheInvalidatePattern('products_*');
    await cacheInvalidatePattern(`product_${req.params.id}`);

    res.json({
        success: true,
        message: 'Product deleted successfully'
    });
});

/**
 * Toggle product active status
 * PATCH /api/products/:id/toggle
 */
export const toggleProductActive = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        throw Errors.notFound('Product not found');
    }

    product.is_active = !product.is_active;
    await product.save();

    // Invalidate caches
    await cacheInvalidatePattern('products_*');
    await cacheInvalidatePattern(`product_${req.params.id}`);

    res.json({
        success: true,
        product
    });
});
