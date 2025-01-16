const mongoose = require("mongoose");

const packageItemSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    }
});

const packageSchema = new mongoose.Schema({
    slug: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    items: {
        type: [packageItemSchema],
        required: true,
        validate: [arr => arr.length > 0, 'Package must have at least one item']
    },
    totalRetailPrice: {
        type: Number,
        required: true
    },
    packagePrice: {
        type: Number,
        required: true
    },
    savings: {
        type: Number,
        required: true
    },
    savingsPercentage: {
        type: Number,
        required: true
    },
    recommendedPartySize: {
        min: {
            type: Number,
            required: true
        },
        max: {
            type: Number,
            required: true
        }
    },
    ageRange: {
        min: {
            type: Number,
            required: true
        },
        max: {
            type: Number,
            required: true
        }
    },
    duration: {
        type: String,
        required: true
    },
    spaceRequired: {
        type: String,
        required: true
    },
    powerRequired: {
        type: Boolean,
        required: true
    },
    seasonalRestrictions: String,
    additionalRequirements: String
});

const Package = mongoose.model("Package", packageSchema);

module.exports = Package;
