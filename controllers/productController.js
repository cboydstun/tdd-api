// productController.js
const fs = require('fs').promises;
const path = require('path');
const Product = require('../models/productSchema');
const slugify = require('slugify');
const sanitizeHtml = require('sanitize-html');
const cloudinary = require('cloudinary').v2;

const VALID_DIMENSION_UNITS = ['feet', 'meters', 'inches'];

// Helper function to upload image to Cloudinary
const uploadToCloudinary = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file.path, {
            folder: 'products',
            resource_type: 'auto'
        });
        // Delete local file after upload
        await fs.unlink(file.path);
        return {
            filename: file.originalname,
            url: result.secure_url,
            public_id: result.public_id,
            mimetype: file.mimetype,
            size: file.size
        };
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw error;
    }
};

// ... (keep all validation helpers unchanged)
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

        // Upload images to Cloudinary if present
        let uploadedImages = [];
        if (req.files && req.files.length > 0) {
            uploadedImages = await Promise.all(req.files.map(file => uploadToCloudinary(file)));
        }

        const newProduct = new Product({
            ...productData,
            slug,
            name: sanitizeHtml(productData.name),
            description: sanitizeHtml(productData.description, sanitizeOptions),
            category: sanitizeHtml(productData.category),
            images: uploadedImages
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
        console.log('Update request received for slug:', slug);
        console.log('Request body:', req.body);

        // Find the existing product first
        const existingProduct = await Product.findOne({ slug });
        if (!existingProduct) {
            console.log('Product not found for slug:', slug);
            return res.status(404).json({ error: 'Product not found' });
        }
        console.log('Found existing product:', existingProduct.name);

        // Handle image deletions first, before parsing product data
        let imagesToDelete = [];
        try {
            if (req.body.imagesToDelete) {
                console.log('Raw imagesToDelete from request:', req.body.imagesToDelete);
                imagesToDelete = JSON.parse(req.body.imagesToDelete);
                console.log('Parsed imagesToDelete:', imagesToDelete);
            }
        } catch (parseErr) {
            console.error('Error parsing imagesToDelete:', parseErr);
            return res.status(400).json({ error: 'Invalid imagesToDelete format' });
        }

        console.log('Current images:', existingProduct.images);

        // Process image deletions
        let updatedImages = [...existingProduct.images];
        for (const identifier of imagesToDelete) {
            console.log('Processing image deletion for identifier:', identifier);

            // Find the image by matching either the URL-extracted ID or the alt text
            const imageToDelete = existingProduct.images.find(img => {
                const urlId = img.url.split('/').pop()?.split('.')[0];
                return urlId === identifier || img.alt === identifier;
            });

            console.log('Found image to delete:', imageToDelete);

            if (imageToDelete) {
                // Extract public_id from the URL
                const urlParts = imageToDelete.url.split('/');
                const publicId = `products/${urlParts[urlParts.length - 1].split('.')[0]}`;

                try {
                    console.log('Attempting to delete from Cloudinary:', publicId);
                    await cloudinary.uploader.destroy(publicId);
                    console.log('Successfully deleted from Cloudinary');
                } catch (err) {
                    console.error(`Failed to delete image from Cloudinary: ${publicId}`, err);
                }

                // Remove the image from updatedImages array
                updatedImages = updatedImages.filter(img => img !== imageToDelete);
            }
        }

        console.log('Images after deletion:', updatedImages);

        // Now parse the product data
        let productData;
        try {
            console.log('Raw productData from request:', req.body.productData);
            productData = typeof req.body.productData === 'string' ?
                JSON.parse(req.body.productData) : req.body.productData;
            console.log('Parsed productData:', productData);
        } catch (parseErr) {
            console.error('Error parsing productData:', parseErr);
            return res.status(400).json({ error: 'Invalid product data format' });
        }

        // Upload new images to Cloudinary
        let newImages = [];
        if (req.files && req.files.length > 0) {
            console.log('Processing new images:', req.files.length);
            newImages = await Promise.all(req.files.map(file => uploadToCloudinary(file)));
            console.log('Uploaded new images:', newImages);
        }

        // Prepare update data
        const updateData = {
            ...productData,
            slug,
            name: productData.name ? sanitizeHtml(productData.name) : existingProduct.name,
            description: productData.description ?
                sanitizeHtml(productData.description) : existingProduct.description,
            category: productData.category ? sanitizeHtml(productData.category) : existingProduct.category,
            images: [...updatedImages, ...newImages]
        };

        console.log('Final update data:', updateData);

        // Update the product
        const updatedProduct = await Product.findOneAndUpdate(
            { slug },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            console.log('Product not found after update attempt');
            return res.status(404).json({ error: 'Product not found after update' });
        }

        console.log('Successfully updated product:', updatedProduct.name);
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
        const product = await Product.findOne({ slug: req.params.slug });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Delete images from Cloudinary
        if (product.images && product.images.length > 0) {
            for (const image of product.images) {
                if (image.public_id) {
                    try {
                        await cloudinary.uploader.destroy(image.public_id);
                    } catch (err) {
                        console.error(`Failed to delete image from Cloudinary: ${image.public_id}`, err);
                    }
                }
            }
        }

        await Product.deleteOne({ _id: product._id });

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

        const imageToDelete = product.images.find(img =>
            img.filename === imageName || img.public_id === imageName
        );

        if (!imageToDelete) {
            return res.status(404).json({ error: 'Image not found in product' });
        }

        // Delete from Cloudinary if public_id exists
        if (imageToDelete.public_id) {
            try {
                await cloudinary.uploader.destroy(imageToDelete.public_id);
            } catch (err) {
                console.error(`Failed to delete image from Cloudinary: ${imageToDelete.public_id}`, err);
            }
        }

        // Remove image from product document
        product.images = product.images.filter(img =>
            img.filename !== imageName && img.public_id !== imageName
        );
        await product.save();

        res.status(200).json({ message: 'Image removed successfully' });
    } catch (err) {
        console.error('Error removing image:', err);
        res.status(500).json({ error: 'An error occurred while removing the image' });
    }
};

module.exports = { getAllProducts, getProductBySlug, createProduct, updateProduct, deleteProduct, removeImage };
