// productController.js
const fs = require('fs').promises;
const path = require('path');
const Product = require('../models/productSchema');
const slugify = require('slugify');
const sanitizeHtml = require('sanitize-html');

// GET /products - should return all products
const getAllProducts = async (req, res) => {
    try {
        let query = {};
        if (!req.user) {
            query.availability = 'available';
        }
        const products = await Product.find(query)
            .sort({ createdAt: -1 })
            .select('-__v'); // This will select all fields except __v

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
        console.log('Received product data:', req.body);

        const productData = JSON.parse(req.body.productData);

        const sanitizeOptions = {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
            allowedAttributes: {
                ...sanitizeHtml.defaults.allowedAttributes,
                'img': ['src', 'alt', 'width', 'height']
            }
        };

        // Generate slug
        let slug = slugify(productData.name, { lower: true, strict: true });
        let slugExists = await Product.findOne({ slug });
        let counter = 1;
        while (slugExists) {
            slug = slugify(`${productData.name}-${counter}`, { lower: true, strict: true });
            slugExists = await Product.findOne({ slug });
            counter++;
        }

        const newProduct = new Product({
            name: sanitizeHtml(productData.name),
            slug, // Include the generated slug
            description: sanitizeHtml(productData.description, sanitizeOptions),
            category: sanitizeHtml(productData.category),
            price: {
                base: parseFloat(productData.price.base),
                currency: productData.price.currency
            },
            rentalDuration: productData.rentalDuration,
            availability: productData.availability,
            dimensions: {
                length: parseFloat(productData.dimensions.length),
                width: parseFloat(productData.dimensions.width),
                height: parseFloat(productData.dimensions.height),
                unit: productData.dimensions.unit
            },
            capacity: parseInt(productData.capacity),
            ageRange: {
                min: parseInt(productData.ageRange.min),
                max: parseInt(productData.ageRange.max)
            },
            setupRequirements: {
                space: sanitizeHtml(productData.setupRequirements.space),
                powerSource: productData.setupRequirements.powerSource,
                surfaceType: productData.setupRequirements.surfaceType.map(type => sanitizeHtml(type))
            },
            features: productData.features.map(feature => sanitizeHtml(feature)),
            safetyGuidelines: sanitizeHtml(productData.safetyGuidelines),
            weatherRestrictions: productData.weatherRestrictions.map(restriction => sanitizeHtml(restriction)),
            images: req.files ? req.files.map(file => ({
                url: file.path,
                alt: sanitizeHtml(file.originalname),
                isPrimary: false
            })) : []
        });

        const savedProduct = await newProduct.save();
        console.log('Saved product:', savedProduct);
        res.status(201).json(savedProduct);
    } catch (err) {
        console.error('Error creating product:', err);
        res.status(500).json({ error: 'An error occurred while creating the product', details: err.message });
    }
};

// PUT /products/:slug - should update a single product by slug
const updateProduct = async (req, res) => {
    try {
        const { slug } = req.params;
        console.log('Attempting to update product:', slug);
        console.log('Received update data:', req.body);

        const productData = JSON.parse(req.body.productData);
        console.log('Parsed product data:', productData);

        // Find the existing product
        const existingProduct = await Product.findOne({ slug });
        if (!existingProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Handle image removal
        if (productData.removedImages && productData.removedImages.length > 0) {
            for (const imageId of productData.removedImages) {
                const imageToRemove = existingProduct.images.find(img => img._id.toString() === imageId);
                if (imageToRemove) {
                    // Remove the file from the file system
                    const filePath = path.join(__dirname, '..', imageToRemove.url);
                    try {
                        await fs.unlink(filePath);
                    } catch (err) {
                        console.error(`Failed to delete file: ${filePath}`, err);
                    }
                }
            }
            // Update the images array
            existingProduct.images = existingProduct.images.filter(img => !productData.removedImages.includes(img._id.toString()));
        }

        // Generate new slug if name has changed
        let newSlug = slug;
        if (productData.name && productData.name !== existingProduct.name) {
            newSlug = slugify(productData.name, { lower: true, strict: true });
            let slugExists = await Product.findOne({ slug: newSlug, _id: { $ne: existingProduct._id } });
            let counter = 1;
            while (slugExists) {
                newSlug = slugify(`${productData.name}-${counter}`, { lower: true, strict: true });
                slugExists = await Product.findOne({ slug: newSlug, _id: { $ne: existingProduct._id } });
                counter++;
            }
        }

        // Prepare update data
        const updateData = {
            name: sanitizeHtml(productData.name),
            slug: newSlug,
            description: sanitizeHtml(productData.description),
            category: sanitizeHtml(productData.category),
            price: productData.price,
            rentalDuration: productData.rentalDuration,
            availability: productData.availability,
            dimensions: productData.dimensions,
            capacity: productData.capacity,
            ageRange: productData.ageRange,
            setupRequirements: {
                space: sanitizeHtml(productData.setupRequirements.space),
                powerSource: productData.setupRequirements.powerSource,
                surfaceType: productData.setupRequirements.surfaceType.map(type => sanitizeHtml(type))
            },
            features: productData.features.map(feature => sanitizeHtml(feature)),
            safetyGuidelines: sanitizeHtml(productData.safetyGuidelines),
            weatherRestrictions: productData.weatherRestrictions.map(restriction => sanitizeHtml(restriction)),
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

        console.log('Update data:', updateData);

        // Update the product
        const updatedProduct = await Product.findOneAndUpdate(
            { slug },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found after update' });
        }

        console.log('Updated product:', updatedProduct);
        res.status(200).json(updatedProduct);
    } catch (err) {
        console.error('Error in updateProduct:', err);
        res.status(500).json({ error: 'An error occurred while updating the product', details: err.message });
    }
};

// DELETE /products/:slug - should delete a single product
const deleteProduct = async (req, res) => {
    try {
        console.log('Attempting to delete product with slug:', req.params.slug);

        const product = await Product.findOneAndDelete({ slug: req.params.slug });

        if (!product) {
            console.log('Product not found for deletion');
            return res.status(404).json({ error: 'Product not found' });
        }

        // Remove associated images from filesystem
        product.images.forEach(image => {
            const imagePath = path.join(__dirname, '..', image.url);
            fs.unlinkSync(imagePath);
        });

        console.log('Product successfully deleted:', product);
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

        const imageIndex = product.images.findIndex(img => path.basename(img.url) === imageName);
        if (imageIndex === -1) {
            return res.status(404).json({ error: 'Image not found' });
        }

        // Remove image from filesystem
        const imagePath = path.join(__dirname, '..', product.images[imageIndex].url);
        fs.unlinkSync(imagePath);

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