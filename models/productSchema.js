// models/productSchema.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true, trim: true },
    price: {
        base: { type: Number, required: true },
        currency: { type: String, default: 'USD' }
    },
    rentalDuration: {
        type: String,
        enum: ['hourly', 'half-day', 'full-day', 'weekend'],
        default: 'full-day'
    },
    availability: {
        type: String,
        enum: ['available', 'rented', 'maintenance', 'retired'],
        default: 'available'
    },
    images: [{
        url: { type: String, required: true },
        alt: { type: String },
        isPrimary: { type: Boolean, default: false }
    }],
    specifications: [{
        name: { type: String, required: true },
        value: { type: Schema.Types.Mixed, required: true }
    }],
    dimensions: {
        length: { type: Number, required: true },
        width: { type: Number, required: true },
        height: { type: Number, required: true },
        unit: { type: String, default: 'feet' }
    },
    capacity: { type: Number, required: true },
    ageRange: {
        min: { type: Number, required: true },
        max: { type: Number, required: true }
    },
    setupRequirements: {
        space: { type: String, required: true },
        powerSource: { type: Boolean, default: true },
        surfaceType: [{ type: String }]
    },
    features: [{ type: String }],
    safetyGuidelines: { type: String, required: true },
    maintenanceSchedule: {
        lastMaintenance: { type: Date },
        nextMaintenance: { type: Date }
    },
    weatherRestrictions: [{ type: String }],
    additionalServices: [{
        name: { type: String },
        price: { type: Number }
    }]
}, { timestamps: true });

// Indexes for better query performance
productSchema.index({ slug: 1 });
productSchema.index({ name: 1 });
productSchema.index({ category: 1 });
productSchema.index({ availability: 1 });
productSchema.index({ 'price.base': 1 });
productSchema.index({ 'dimensions.length': 1, 'dimensions.width': 1 });
productSchema.index({ capacity: 1 });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;