// controllers/packageController.js
const Package = require("../models/packageSchema");
const slugify = require("slugify");

// Helper function to validate age range
const validateAgeRange = (ageRange) => {
    if (ageRange.min < 0 || ageRange.max < 0) {
        throw new Error("Age range values cannot be negative");
    }
    if (ageRange.min > ageRange.max) {
        throw new Error("Minimum age cannot be greater than maximum age");
    }
};

// Helper function to validate party size
const validatePartySize = (partySize) => {
    if (partySize.min < 1 || partySize.max < 1) {
        throw new Error("Party size values must be positive");
    }
    if (partySize.min > partySize.max) {
        throw new Error("Minimum party size cannot be greater than maximum");
    }
};

// Helper function to validate prices and savings
const validatePrices = (totalRetailPrice, packagePrice, savings, savingsPercentage) => {
    if (totalRetailPrice <= 0 || packagePrice <= 0) {
        throw new Error("Prices must be positive numbers");
    }
    if (packagePrice >= totalRetailPrice) {
        throw new Error("Package price must be less than total retail price");
    }
    if (savings !== (totalRetailPrice - packagePrice)) {
        throw new Error("Savings amount is incorrect");
    }
    const calculatedPercentage = ((totalRetailPrice - packagePrice) / totalRetailPrice) * 100;
    if (Math.abs(savingsPercentage - calculatedPercentage) > 0.01) { // Allow for small floating point differences
        throw new Error("Savings percentage is incorrect");
    }
};

// GET /packages - Get all packages
const getAllPackages = async (req, res) => {
    try {
        const packages = await Package.find({}).sort({ name: 1 });
        res.status(200).json(packages);
    } catch (err) {
        console.error("Error fetching packages:", err);
        res.status(500).json({
            error: "An error occurred while fetching packages",
            details: err.message
        });
    }
};

// GET /packages/:slug - Get package by slug
const getPackageBySlug = async (req, res) => {
    try {
        const packageItem = await Package.findOne({ slug: req.params.slug });
        if (!packageItem) {
            return res.status(404).json({ error: "Package not found" });
        }
        res.status(200).json(packageItem);
    } catch (err) {
        console.error("Error fetching package:", err);
        res.status(500).json({
            error: "An error occurred while fetching the package",
            details: err.message
        });
    }
};

// POST /packages - Create a new package
const createPackage = async (req, res) => {
    try {
        const packageData = req.body;

        // Validate required fields
        if (!packageData.name || !packageData.description || !packageData.items) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Generate slug from name
        let slug = slugify(packageData.name, { lower: true, strict: true });
        let slugExists = await Package.findOne({ slug });
        let counter = 1;
        while (slugExists) {
            slug = slugify(`${packageData.name}-${counter}`, { lower: true, strict: true });
            slugExists = await Package.findOne({ slug });
            counter++;
        }

        // Validate items array
        if (!Array.isArray(packageData.items) || packageData.items.length === 0) {
            return res.status(400).json({ error: "Package must have at least one item" });
        }

        // Validate age range and party size
        try {
            validateAgeRange(packageData.ageRange);
            validatePartySize(packageData.recommendedPartySize);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }

        // Validate prices and savings
        try {
            validatePrices(
                packageData.totalRetailPrice,
                packageData.packagePrice,
                packageData.savings,
                packageData.savingsPercentage
            );
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }

        const newPackage = new Package({
            ...packageData,
            slug
        });
        const savedPackage = await newPackage.save();
        res.status(201).json(savedPackage);
    } catch (err) {
        console.error("Error creating package:", err);
        if (err.name === "ValidationError") {
            return res.status(400).json({
                error: "Validation error",
                details: Object.values(err.errors).map(error => error.message)
            });
        }
        res.status(500).json({
            error: "An error occurred while creating the package",
            details: err.message
        });
    }
};

// PUT /packages/:slug - Update a package
const updatePackage = async (req, res) => {
    try {
        const packageData = req.body;
        const packageItem = await Package.findOne({ slug: req.params.slug });

        if (!packageItem) {
            return res.status(404).json({ error: "Package not found" });
        }

        // If name is being changed, update the slug
        if (packageData.name) {
            let newSlug = slugify(packageData.name, { lower: true, strict: true });
            let slugExists = await Package.findOne({
                slug: newSlug,
                _id: { $ne: packageItem._id }
            });
            let counter = 1;
            while (slugExists) {
                newSlug = slugify(`${packageData.name}-${counter}`, { lower: true, strict: true });
                slugExists = await Package.findOne({
                    slug: newSlug,
                    _id: { $ne: packageItem._id }
                });
                counter++;
            }
            packageData.slug = newSlug;
        }

        // Validate items array if provided
        if (packageData.items) {
            if (!Array.isArray(packageData.items) || packageData.items.length === 0) {
                return res.status(400).json({ error: "Package must have at least one item" });
            }
        }

        // Validate age range and party size if provided
        if (packageData.ageRange || packageData.recommendedPartySize) {
            try {
                if (packageData.ageRange) {
                    validateAgeRange(packageData.ageRange);
                }
                if (packageData.recommendedPartySize) {
                    validatePartySize(packageData.recommendedPartySize);
                }
            } catch (error) {
                return res.status(400).json({ error: error.message });
            }
        }

        // Validate prices and savings if any price-related field is updated
        if (packageData.totalRetailPrice || packageData.packagePrice ||
            packageData.savings || packageData.savingsPercentage) {
            try {
                validatePrices(
                    packageData.totalRetailPrice || packageItem.totalRetailPrice,
                    packageData.packagePrice || packageItem.packagePrice,
                    packageData.savings || packageItem.savings,
                    packageData.savingsPercentage || packageItem.savingsPercentage
                );
            } catch (error) {
                return res.status(400).json({ error: error.message });
            }
        }

        const updatedPackage = await Package.findOneAndUpdate(
            { slug: req.params.slug },
            packageData,
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedPackage);
    } catch (err) {
        console.error("Error updating package:", err);
        if (err.name === "ValidationError") {
            return res.status(400).json({
                error: "Validation error",
                details: Object.values(err.errors).map(error => error.message)
            });
        }
        res.status(500).json({
            error: "An error occurred while updating the package",
            details: err.message
        });
    }
};

// DELETE /packages/:slug - Delete a package
const deletePackage = async (req, res) => {
    try {
        const packageItem = await Package.findOne({ slug: req.params.slug });

        if (!packageItem) {
            return res.status(404).json({ error: "Package not found" });
        }

        await Package.deleteOne({ slug: req.params.slug });
        res.status(200).json({
            message: "Package successfully deleted",
            deletedPackage: packageItem
        });
    } catch (err) {
        console.error("Error deleting package:", err);
        res.status(500).json({
            error: "An error occurred while deleting the package",
            details: err.message
        });
    }
};

module.exports = {
    getAllPackages,
    getPackageBySlug,
    createPackage,
    updatePackage,
    deletePackage
};
