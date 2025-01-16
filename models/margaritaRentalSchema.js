// models/margaritaRentalSchema.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
const phoneRegex = /^(\+?[\d\s\-()]{7,16})?$/;

const margaritaRentalSchema = new Schema(
    {
        machineType: {
            type: String,
            enum: ["single", "double"],
            required: true,
        },
        capacity: {
            type: Number,
            enum: [15, 30],
            required: true,
        },
        mixerType: {
            type: String,
            enum: ["none", "kool-aid", "margarita", "pina-colada"],
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        rentalDate: {
            type: Date,
            required: true,
        },
        returnDate: {
            type: Date,
            required: true,
        },
        customer: {
            name: {
                type: String,
                required: true,
                trim: true,
            },
            email: {
                type: String,
                required: true,
                match: [emailRegex, "Please enter a valid email address"],
            },
            phone: {
                type: String,
                required: true,
                match: [phoneRegex, "Please enter a valid phone number"],
            },
            address: {
                street: { type: String, required: true },
                city: { type: String, required: true },
                state: { type: String, required: true },
                zipCode: { type: String, required: true },
            },
        },
        payment: {
            paypalTransactionId: {
                type: String,
                required: true,
            },
            amount: {
                type: Number,
                required: true,
            },
            status: {
                type: String,
                enum: ["pending", "completed", "failed", "refunded"],
                default: "pending",
            },
            date: {
                type: Date,
                default: Date.now,
            },
        },
        status: {
            type: String,
            enum: ["pending", "confirmed", "in-progress", "completed", "cancelled"],
            default: "pending",
        },
        notes: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

// Helper method to calculate price based on machine configuration
margaritaRentalSchema.statics.calculatePrice = function (machineType, mixerType) {
    const prices = {
        single: {
            none: 89.95,
            "kool-aid": 99.95,
            margarita: 124.95,
            "pina-colada": 124.95,
        },
        double: {
            none: 124.95,
            "kool-aid": 149.95,
            margarita: 174.95,
            "pina-colada": 174.95,
        },
    };

    return prices[machineType][mixerType];
};

// Indexes for better query performance
margaritaRentalSchema.index({ rentalDate: 1 });
margaritaRentalSchema.index({ "customer.email": 1 });
margaritaRentalSchema.index({ status: 1 });
margaritaRentalSchema.index({ "payment.status": 1 });

const MargaritaRental = mongoose.model("MargaritaRental", margaritaRentalSchema);

module.exports = MargaritaRental;
