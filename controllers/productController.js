// productController.js
const fs = require("fs").promises;
const path = require("path");
const Product = require("../models/productSchema");
const slugify = require("slugify");
const sanitizeHtml = require("sanitize-html");
const cloudinary = require("cloudinary").v2;

const VALID_DIMENSION_UNITS = ["feet", "meters", "inches"];

// Helper function to upload image to Cloudinary
const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "products",
      resource_type: "auto",
    });
    // Delete local file after upload
    await fs.unlink(file.path);
    return {
      filename: file.originalname,
      url: result.secure_url,
      public_id: result.public_id,
      mimetype: file.mimetype,
      size: file.size,
    };
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};

// Validation helpers
const validatePrice = (price) => {
  if (!price || !price.base || typeof price.base !== "number") {
    throw new Error("Price base amount is required and must be a number");
  }
  if (price.base <= 0) {
    throw new Error("Price must be greater than 0");
  }
  if (!price.currency || typeof price.currency !== "string") {
    throw new Error("Price currency is required and must be a string");
  }
};

const validateDimensions = (dimensions) => {
  if (!dimensions) {
    throw new Error("Dimensions are required");
  }
  if (
    dimensions.length <= 0 ||
    dimensions.width <= 0 ||
    dimensions.height <= 0
  ) {
    throw new Error("Dimensions must be greater than 0");
  }
  if (!VALID_DIMENSION_UNITS.includes(dimensions.unit)) {
    throw new Error(`Unit must be one of: ${VALID_DIMENSION_UNITS.join(", ")}`);
  }
};

const validateCapacity = (capacity) => {
  if (typeof capacity !== "number" || capacity <= 0) {
    throw new Error("Capacity must be a positive number");
  }
};

const validateAgeRange = (ageRange) => {
  if (
    !ageRange ||
    typeof ageRange.min !== "number" ||
    typeof ageRange.max !== "number"
  ) {
    throw new Error("Age range min and max are required and must be numbers");
  }
  if (ageRange.min < 0 || ageRange.max < 0) {
    throw new Error("Age range values cannot be negative");
  }
  if (ageRange.min > ageRange.max) {
    throw new Error("Minimum age cannot be greater than maximum age");
  }
};

// GET /products - should return all products
const getAllProducts = async (req, res) => {
  try {
    let query = {};
    if (!req.user) {
      query.availability = "available";
    }
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .select("-__v");

    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching products" });
  }
};

// Helper function to extract identifier from Cloudinary URL
const extractPublicIdFromUrl = (url) => {
  try {
    const matches = url.match(/\/v\d+\/products\/([^/]+)\./);
    return matches ? `products/${matches[1]}` : null;
  } catch (err) {
    console.error("Error extracting public_id from URL:", err);
    return null;
  }
};

// GET /products/:slug - should return a single product
const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate(
      "category",
      "name",
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({
      error: "An error occurred while fetching the product",
      details: err.message,
    });
  }
};

// POST /products - should create a new product
const createProduct = async (req, res) => {
  try {
    const productData = req.body;

    // Basic required fields validation
    const requiredFields = [
      "name",
      "description",
      "category",
      "price",
      "dimensions",
      "capacity",
      "ageRange",
      "setupRequirements.space",
      "safetyGuidelines"
    ];
    for (const field of requiredFields) {
      // Handle nested fields like setupRequirements.space
      const value = field.includes('.')
        ? field.split('.').reduce((obj, key) => obj && obj[key], productData)
        : productData[field];
      if (!value) {
        return res.status(400).json({ error: `${field} is required` });
      }
    }

    // Validate price since it's always required
    try {
      validatePrice(productData.price);
    } catch (validationError) {
      return res.status(400).json({ error: validationError.message });
    }

    // Validate all required fields
    try {
      validateDimensions(productData.dimensions);
      validateCapacity(productData.capacity);
      validateAgeRange(productData.ageRange);
    } catch (validationError) {
      return res.status(400).json({ error: validationError.message });
    }

    // Validate enums if provided
    if (productData.rentalDuration) {
      if (!["hourly", "half-day", "full-day", "weekend"].includes(productData.rentalDuration)) {
        return res.status(400).json({ error: "Invalid rental duration" });
      }
    }

    if (productData.availability) {
      if (!["available", "rented", "maintenance", "retired"].includes(productData.availability)) {
        return res.status(400).json({ error: "Invalid availability status" });
      }
    }

    const sanitizeOptions = {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        img: ["src", "alt", "width", "height"],
      },
    };

    // Generate slug
    const slug = slugify(productData.name, { lower: true, strict: true });

    // Check for existing slug
    const slugExists = await Product.findOne({ slug });
    if (slugExists) {
      return res
        .status(400)
        .json({ error: "A product with this name already exists" });
    }

    // Upload images to Cloudinary if present
    let uploadedImages = [];
    if (req.files && req.files.length > 0) {
      uploadedImages = await Promise.all(
        req.files.map((file) => uploadToCloudinary(file)),
      );
    }

    const newProduct = new Product({
      ...productData,
      slug,
      name: sanitizeHtml(productData.name),
      description: sanitizeHtml(productData.description, sanitizeOptions),
      category: sanitizeHtml(productData.category),
      images: uploadedImages,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error("Error creating product:", err);
    console.error("Error details:", {
      name: err.name,
      message: err.message,
      stack: err.stack,
      errors: err.errors
    });

    if (err.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation error",
        details: Object.values(err.errors || {}).map(e => e.message)
      });
    }

    res.status(500).json({
      error: "An error occurred while creating the product",
      details: err.message
    });
  }
};

// PUT /products/:slug - should update a single product by slug
const updateProduct = async (req, res) => {
  try {
    const { slug } = req.params;

    // Find the existing product first
    const existingProduct = await Product.findOne({ slug });
    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    const productData = req.body;

    // Validate updated data if provided
    if (productData.price) {
      try {
        validatePrice(productData.price);
      } catch (validationError) {
        return res.status(400).json({ error: validationError.message });
      }
    }

    if (productData.dimensions) {
      try {
        validateDimensions(productData.dimensions);
      } catch (validationError) {
        return res.status(400).json({ error: validationError.message });
      }
    }

    // Handle image deletions
    let imagesToDelete = [];
    if (req.body.imagesToDelete) {
      try {
        imagesToDelete =
          typeof req.body.imagesToDelete === "string"
            ? JSON.parse(req.body.imagesToDelete)
            : req.body.imagesToDelete;
        console.log("Images to delete:", imagesToDelete);
      } catch (parseErr) {
        console.error("Error parsing imagesToDelete:", parseErr);
        return res.status(400).json({ error: "Invalid imagesToDelete format" });
      }
    }

    // Process image deletions
    let updatedImages = [...existingProduct.images];

    for (const identifier of imagesToDelete) {
      // Find the image using multiple methods
      const imageToDelete = existingProduct.images.find((img) => {
        console.log("Checking image:", {
          filename: img.filename,
          public_id: img.public_id,
          url: img.url,
        });

        // Check filename
        if (img.filename === identifier) {
          console.log("Found match by filename");
          return true;
        }

        // Check public_id
        if (img.public_id === identifier) {
          console.log("Found match by public_id");
          return true;
        }

        // Check public_id with products/ prefix
        if (img.public_id === `products/${identifier}`) {
          console.log("Found match by public_id with prefix");
          return true;
        }

        // If no filename or public_id, try to extract from URL
        if (!img.public_id && img.url) {
          const extractedId = extractPublicIdFromUrl(img.url);
          console.log("Extracted public_id from URL:", extractedId);
          if (
            extractedId === identifier ||
            extractedId === `products/${identifier}`
          ) {
            console.log("Found match by extracted public_id");
            return true;
          }
        }

        return false;
      });

      if (imageToDelete) {
        // Get the public_id for Cloudinary deletion
        const publicId =
          imageToDelete.public_id || extractPublicIdFromUrl(imageToDelete.url);

        // Delete from Cloudinary if we have a public_id
        if (publicId) {
          try {
            console.log("Attempting to delete from Cloudinary:", publicId);
            const result = await cloudinary.uploader.destroy(publicId);
            console.log("Cloudinary deletion result:", result);
          } catch (err) {
            console.error("Failed to delete image from Cloudinary:", err);
            // Continue with database update even if Cloudinary delete fails
          }
        }

        updatedImages = updatedImages.filter((img) => img !== imageToDelete);
      } else {
        console.log("No matching image found for identifier:", identifier);
      }
    }

    // Upload new images to Cloudinary
    let newImages = [];
    if (req.files && req.files.length > 0) {
      console.log("Uploading new images:", req.files.length);
      newImages = await Promise.all(
        req.files.map((file) => uploadToCloudinary(file)),
      );
    }

    const sanitizeOptions = {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        img: ["src", "alt", "width", "height"],
      },
    };

    // Prepare update data with only the fields that should be updated
    const updateData = {};

    // Handle text fields with sanitization
    if (productData.name) updateData.name = sanitizeHtml(productData.name);
    if (productData.description) updateData.description = sanitizeHtml(productData.description, sanitizeOptions);
    if (productData.category) updateData.category = sanitizeHtml(productData.category);
    if (productData.safetyGuidelines) updateData.safetyGuidelines = sanitizeHtml(productData.safetyGuidelines);

    // Handle nested objects
    if (productData.price) {
      updateData.price = {
        base: productData.price.base,
        currency: productData.price.currency || 'USD'
      };
    }

    if (productData.dimensions) {
      updateData.dimensions = {
        length: productData.dimensions.length,
        width: productData.dimensions.width,
        height: productData.dimensions.height,
        unit: productData.dimensions.unit || 'feet'
      };
    }

    if (productData.ageRange) {
      updateData.ageRange = {
        min: productData.ageRange.min,
        max: productData.ageRange.max
      };
    }

    // Handle simple fields
    if (productData.rentalDuration) updateData.rentalDuration = productData.rentalDuration;
    if (productData.availability) updateData.availability = productData.availability;
    if (productData.capacity) updateData.capacity = productData.capacity;

    // Handle arrays and objects
    if (productData.setupRequirements) updateData.setupRequirements = productData.setupRequirements;
    if (productData.features) updateData.features = productData.features;
    if (productData.weatherRestrictions) updateData.weatherRestrictions = productData.weatherRestrictions;
    if (productData.specifications) updateData.specifications = productData.specifications;

    // Handle images
    if (updatedImages.length > 0 || newImages.length > 0) {
      updateData.images = [...updatedImages, ...newImages];
    }

    // Update the product with only the changed fields
    const updatedProduct = await Product.findOneAndUpdate(
      { slug },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found after update" });
    }

    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error("Error in updateProduct:", err);
    if (err.name === "ValidationError") {
      return res
        .status(400)
        .json({ error: "Validation error", details: err.message });
    }
    res.status(500).json({
      error: "An error occurred while updating the product",
      details: err.message,
    });
  }
};

// DELETE /products/:slug - should delete a single product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
      for (const image of product.images) {
        if (image.public_id) {
          try {
            await cloudinary.uploader.destroy(image.public_id);
          } catch (err) {
            console.error(
              `Failed to delete image from Cloudinary: ${image.public_id}`,
              err,
            );
          }
        }
      }
    }

    await Product.deleteOne({ _id: product._id });

    res.status(200).json({
      message: "Product successfully deleted",
      deletedProduct: product,
    });
  } catch (err) {
    console.error("Error in deleteProduct:", err);
    res.status(500).json({
      error: "An error occurred while deleting the product",
      details: err.message,
    });
  }
};

// DELETE - /:slug/images/:imageName - should delete a single image from a product
const removeImage = async (req, res) => {
  try {
    const { slug, imageName } = req.params;
    console.log("Attempting to remove image:", { slug, imageName });

    const product = await Product.findOne({ slug });
    if (!product) {
      console.log("Product not found:", slug);
      return res.status(404).json({ error: "Product not found" });
    }

    // Decode the URL-encoded imageName parameter
    const decodedImageName = decodeURIComponent(imageName);
    console.log("Decoded image name:", decodedImageName);

    // Find the image to delete using multiple methods
    let imageToDelete = product.images.find((img) => {
      // Log the current image being checked
      console.log("Checking image:", {
        filename: img.filename,
        public_id: img.public_id,
        url: img.url,
      });

      // Check filename
      if (img.filename === decodedImageName) {
        console.log("Found match by filename");
        return true;
      }

      // Check public_id
      if (img.public_id === decodedImageName) {
        console.log("Found match by public_id");
        return true;
      }

      // Check public_id with products/ prefix
      if (img.public_id === `products/${decodedImageName}`) {
        console.log("Found match by public_id with prefix");
        return true;
      }

      // If no filename or public_id, try to extract from URL
      if (!img.public_id && img.url) {
        const extractedId = extractPublicIdFromUrl(img.url);
        console.log("Extracted public_id from URL:", extractedId);
        if (
          extractedId === decodedImageName ||
          extractedId === `products/${decodedImageName}`
        ) {
          console.log("Found match by extracted public_id");
          return true;
        }
      }

      return false;
    });

    if (!imageToDelete) {
      console.log("Image not found in product");
      return res.status(404).json({ error: "Image not found in product" });
    }

    // Get the public_id for Cloudinary deletion
    const publicId =
      imageToDelete.public_id || extractPublicIdFromUrl(imageToDelete.url);
    console.log("Public ID for deletion:", publicId);

    // Delete from Cloudinary if we have a public_id
    if (publicId) {
      try {
        console.log("Attempting to delete from Cloudinary:", publicId);
        const result = await cloudinary.uploader.destroy(publicId);
        console.log("Cloudinary deletion result:", result);
      } catch (err) {
        console.error("Failed to delete image from Cloudinary:", err);
        // Continue with database update even if Cloudinary delete fails
      }
    }

    // Remove image from product document
    const originalLength = product.images.length;
    product.images = product.images.filter((img) => img !== imageToDelete);
    console.log(
      `Removed ${originalLength - product.images.length} images from product`,
    );

    await product.save();
    console.log("Product saved successfully");

    res.status(200).json({
      message: "Image removed successfully",
      removedImage: {
        filename: imageToDelete.filename,
        public_id: imageToDelete.public_id,
        url: imageToDelete.url,
      },
    });
  } catch (err) {
    console.error("Error removing image:", err);
    res.status(500).json({
      error: "An error occurred while removing the image",
      details: err.message,
    });
  }
};

module.exports = {
  getAllProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  removeImage,
};
