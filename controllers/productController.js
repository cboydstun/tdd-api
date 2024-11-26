// productController.js
const fs = require('fs').promises;
const path = require('path');
const Product = require('../models/productSchema');
const slugify = require('slugify');
const sanitizeHtml = require('sanitize-html');

const VALID_DIMENSION_UNITS = ['feet', 'meters', 'inches'];

// Validation helpers
const validatePrice = (price) => {
    if (!price || !price.base || typeof price.base !== 'number') {
        throw new Error('Price base amount is required and must be a number');
    }
    if (price.base <= 0) {
        throw new Error('Price must be greater than 0');
    }
    if (!price.currency || typeof price.currency !== 'string') {
        throw new Error('Price currency is required and must be a string');
    }
};

const validateDimensions = (dimensions) => {
    if (!dimensions) {
        throw new Error('Dimensions are required');
    }
    if (dimensions.length <= 0 || dimensions.width <= 0 || dimensions.height <= 0) {
        throw new Error('Dimensions must be greater than 0');
    }
    if (!VALID_DIMENSION_UNITS.includes(dimensions.unit)) {
        throw new Error(`Unit must be one of: ${VALID_DIMENSION_UNITS.join(', ')}`);
    }
};

const validateCapacity = (capacity) => {
    if (typeof capacity !== 'number' || capacity <= 0) {
        throw new Error('Capacity must be a positive number');
    }
};

const validateAgeRange = (ageRange) => {
    if (!ageRange || typeof ageRange.min !== 'number' || typeof ageRange.max !== 'number') {
        throw new Error('Age range min and max are required and must be numbers');
    }
    if (ageRange.min < 0 || ageRange.max < 0) {
        throw new Error('Age range values cannot be negative');
    }
    if (ageRange.min > ageRange.max) {
        throw new Error('Minimum age cannot be greater than maximum age');
    }
};

// GET /products - should return all products
const getAllProducts = async (req, res) => {
    try {
        let query = {};
        if (!req.user) {
            query.availability = 'available';
        }
        const products = await Product.find(query)
            .sort({ createdAt: -1 })
            .select('-__v');

        res.status(200).json(products);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ error: 'An error occurred while fetching products' });
    }
};

// GET /products/:slug - should return a single product
const getProductBySlug = async (req, res) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug })
            .populate('category', 'name');

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (err) {
        console.error('Error fetching product:', err);
        res.status(500).json({
            error: 'An error occurred while fetching the product',
            details: err.message
        });
    }
};

// POST /products - should create a new product
const createProduct = async (req, res) => {
    try {
        let productData;

        try {
            productData = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
            if (req.body.productData) {
                productData = typeof req.body.productData === 'string' ?
                    JSON.parse(req.body.productData) : req.body.productData;
            }
        } catch (parseErr) {
            return res.status(400).json({ error: 'Invalid product data format' });
        }

        // Validate required fields
        const requiredFields = ['name', 'description', 'category', 'price'];
        for (const field of requiredFields) {
            if (!productData[field]) {
                return res.status(400).json({ error: `${field} is required` });
            }
        }

        // Validate complex fields
        try {
            validatePrice(productData.price);
            validateDimensions(productData.dimensions);
            validateCapacity(productData.capacity);
            validateAgeRange(productData.ageRange);
        } catch (validationError) {
            return res.status(400).json({ error: validationError.message });
        }

        // Validate enums
        if (productData.rentalDuration &&
            !['hourly', 'half-day', 'full-day', 'weekend'].includes(productData.rentalDuration)) {
            return res.status(400).json({ error: 'Invalid rental duration' });
        }

        if (productData.availability &&
            !['available', 'rented', 'maintenance', 'retired'].includes(productData.availability)) {
            return res.status(400).json({ error: 'Invalid availability status' });
        }

        const sanitizeOptions = {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
            allowedAttributes: {
                ...sanitizeHtml.defaults.allowedAttributes,
                'img': ['src', 'alt', 'width', 'height']
            }
        };

        // Generate slug
        const slug = slugify(productData.name, { lower: true, strict: true });

        // Check for existing slug
        const slugExists = await Product.findOne({ slug });
        if (slugExists) {
            return res.status(400).json({ error: 'A product with this name already exists' });
        }

        const newProduct = new Product({
            ...productData,
            slug,
            name: sanitizeHtml(productData.name),
            description: sanitizeHtml(productData.description, sanitizeOptions),
            category: sanitizeHtml(productData.category),
            images: req.files ? req.files.map(file => ({
                url: file.path,
                alt: sanitizeHtml(file.originalname),
                isPrimary: false
            })) : (productData.images || [])
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        console.error('Error creating product:', err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: 'Validation error', details: err.message });
        }
        res.status(500).json({ error: 'An error occurred while creating the product', details: err.message });
    }
};

// PUT /products/:slug - should update a single product by slug
const updateProduct = async (req, res) => {
    try {
        const { slug } = req.params;

        let productData;
        try {
            productData = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
            if (req.body.productData) {
                productData = typeof req.body.productData === 'string' ?
                    JSON.parse(req.body.productData) : req.body.productData;
            }
        } catch (parseErr) {
            return res.status(400).json({ error: 'Invalid product data format' });
        }

        // Find the existing product
        const existingProduct = await Product.findOne({ slug });
        if (!existingProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Validate updated fields
        try {
            if (productData.price) validatePrice(productData.price);
            if (productData.dimensions) validateDimensions(productData.dimensions);
            if (productData.capacity !== undefined) validateCapacity(productData.capacity);
            if (productData.ageRange) validateAgeRange(productData.ageRange);
        } catch (validationError) {
            return res.status(400).json({ error: validationError.message });
        }

        // Handle image removal
        if (productData.removedImages && productData.removedImages.length > 0) {
            for (const imageId of productData.removedImages) {
                const imageToRemove = existingProduct.images.find(img => img._id.toString() === imageId);
                if (imageToRemove) {
                    try {
                        await fs.unlink(path.join(__dirname, '..', imageToRemove.url));
                    } catch (err) {
                        console.error(`Failed to delete file: ${imageToRemove.url}`, err);
                    }
                }
            }
            existingProduct.images = existingProduct.images.filter(img =>
                !productData.removedImages.includes(img._id.toString())
            );
        }

        // Generate new slug if name has changed
        let newSlug = slug;
        if (productData.name && productData.name !== existingProduct.name) {
            newSlug = slugify(productData.name, { lower: true, strict: true });
            const slugExists = await Product.findOne({ slug: newSlug, _id: { $ne: existingProduct._id } });
            if (slugExists) {
                return res.status(400).json({ error: 'A product with this name already exists' });
            }
        }

        // Validate enums if provided
        if (productData.rentalDuration &&
            !['hourly', 'half-day', 'full-day', 'weekend'].includes(productData.rentalDuration)) {
            return res.status(400).json({ error: 'Invalid rental duration' });
        }

        if (productData.availability &&
            !['available', 'rented', 'maintenance', 'retired'].includes(productData.availability)) {
            return res.status(400).json({ error: 'Invalid availability status' });
        }

        const sanitizeOptions = {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
            allowedAttributes: {
                ...sanitizeHtml.defaults.allowedAttributes,
                'img': ['src', 'alt', 'width', 'height']
            }
        };

        // Prepare update data
        const updateData = {
            ...productData,
            slug: newSlug,
            name: productData.name ? sanitizeHtml(productData.name) : existingProduct.name,
            description: productData.description ?
                sanitizeHtml(productData.description, sanitizeOptions) : existingProduct.description,
            category: productData.category ? sanitizeHtml(productData.category) : existingProduct.category,
            images: existingProduct.images
        };

        // Handle new image uploads
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => ({
                url: file.path,
                alt: sanitizeHtml(file.originalname),
                isPrimary: false
            }));
            updateData.images = [...updateData.images, ...newImages];
        }

        // Update the product
        const updatedProduct = await Product.findOneAndUpdate(
            { slug },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found after update' });
        }

        res.status(200).json(updatedProduct);
    } catch (err) {
        console.error('Error in updateProduct:', err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: 'Validation error', details: err.message });
        }
        res.status(500).json({ error: 'An error occurred while updating the product', details: err.message });
    }
};

// DELETE /products/:slug - should delete a single product
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({ slug: req.params.slug });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Remove associated images from filesystem
        if (product.images && product.images.length > 0) {
            for (const image of product.images) {
                try {
                    await fs.unlink(path.join(__dirname, '..', image.url));
                } catch (err) {
                    console.error(`Failed to delete file: ${image.url}`, err);
                }
            }
        }

        res.status(200).json({ message: 'Product successfully deleted', deletedProduct: product });
    } catch (err) {
        console.error('Error in deleteProduct:', err);
        res.status(500).json({ error: 'An error occurred while deleting the product', details: err.message });
    }
};

// DELETE - /:slug/images/:imageName - should delete a single image from a product
const removeImage = async (req, res) => {
    try {
        const { slug, imageName } = req.params;

        const product = await Product.findOne({ slug });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Find the image by filename
        const imageIndex = product.images.findIndex(img => path.basename(img.url) === imageName);
        if (imageIndex === -1) {
            return res.status(404).json({ error: 'Image not found' });
        }

        // Remove image from filesystem
        try {
            await fs.unlink(path.join(__dirname, '..', product.images[imageIndex].url));
        } catch (err) {
            console.error(`Failed to delete file: ${product.images[imageIndex].url}`, err);
        }

        // Remove image from product document
        product.images.splice(imageIndex, 1);
        await product.save();

        res.status(200).json({ message: 'Image removed successfully' });
    } catch (err) {
        console.error('Error removing image:', err);
        res.status(500).json({ error: 'An error occurred while removing the image' });
    }
};

module.exports = { getAllProducts, getProductBySlug, createProduct, updateProduct, deleteProduct, removeImage };
