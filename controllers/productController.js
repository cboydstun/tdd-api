// productController.js
const Product = require("../models/productSchema");
const slugify = require("slugify");
const sanitizeHtml = require("sanitize-html");
const cloudinary = require("cloudinary").v2;

const VALID_DIMENSION_UNITS = ["feet", "meters", "inches"];

// Helper function to upload image to Cloudinary
const uploadToCloudinary = async (imageData) => {
  try {
    const result = await cloudinary.uploader.upload(imageData, {
      folder: "products",
      resource_type: "auto",
    });
    return {
      filename: result.original_filename,
      url: result.secure_url,
      public_id: result.public_id,
      size: result.bytes,
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
    let productData;
    try {
      productData =
        typeof req.body.productData === "string"
          ? JSON.parse(req.body.productData)
          : req.body.productData || req.body;
    } catch (parseErr) {
      return res.status(400).json({ error: "Invalid product data format" });
    }

    // Validate required fields
    const requiredFields = ["name", "description", "category", "price"];
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
    if (
      productData.rentalDuration &&
      !["hourly", "half-day", "full-day", "weekend"].includes(
        productData.rentalDuration,
      )
    ) {
      return res.status(400).json({ error: "Invalid rental duration" });
    }

    if (
      productData.availability &&
      !["available", "rented", "maintenance", "retired"].includes(
        productData.availability,
      )
    ) {
      return res.status(400).json({ error: "Invalid availability status" });
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
    if (productData.images && Array.isArray(productData.images)) {
      uploadedImages = await Promise.all(
        productData.images.map((imageData) => uploadToCloudinary(imageData))
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
    if (err.name === "ValidationError") {
      return res
        .status(400)
        .json({ error: "Validation error", details: err.message });
    }
    res.status(500).json({
      error: "An error occurred while creating the product",
      details: err.message,
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

    // Parse product data
    let productData;
    try {
      productData =
        typeof req.body.productData === "string"
          ? JSON.parse(req.body.productData)
          : req.body.productData || req.body;
    } catch (parseErr) {
      console.error("Error parsing product data:", parseErr);
      return res.status(400).json({ error: "Invalid product data format" });
    }

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
    if (productData.images && Array.isArray(productData.images)) {
      console.log("Uploading new images:", productData.images.length);
      newImages = await Promise.all(
        productData.images.map((imageData) => uploadToCloudinary(imageData))
      );
    }

    const sanitizeOptions = {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        img: ["src", "alt", "width", "height"],
      },
    };

    // Prepare update data
    const updateData = {
      ...existingProduct.toObject(),
      ...productData,
      name: productData.name
        ? sanitizeHtml(productData.name)
        : existingProduct.name,
      description: productData.description
        ? sanitizeHtml(productData.description, sanitizeOptions)
        : existingProduct.description,
      category: productData.category
        ? sanitizeHtml(productData.category)
        : existingProduct.category,
      images: [...updatedImages, ...newImages],
    };

    // Update the product
    const updatedProduct = await Product.findOneAndUpdate(
      { slug },
      updateData,
      { new: true, runValidators: true },
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
    product.images = product.images.filter((img) => {
      // Compare by public_id if available
      if (img.public_id && imageToDelete.public_id) {
        return img.public_id !== imageToDelete.public_id;
      }
      // Compare by filename if available
      if (img.filename && imageToDelete.filename) {
        return img.filename !== imageToDelete.filename;
      }
      // Compare by URL as last resort
      return img.url !== imageToDelete.url;
    });
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
