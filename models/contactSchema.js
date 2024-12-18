// models/contactSchema.js
const mongoose = require('mongoose');

const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
const phoneRegex = /^(\+?[\d\s\-()]{7,16})?$/;

const contactSchema = new mongoose.Schema({
    bouncer: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        match: [emailRegex, 'Please enter a valid email address'],
        index: true
    },
    partyDate: {
        type: Date,
        required: true
    },
    phone: {
        type: String,
        required: false,
        match: [phoneRegex, 'Please enter a valid phone number']
    },
    partyZipCode: {
        type: String,
        required: true
    },
    tablesChairs: {
        type: Boolean,
        default: false
    },
    generator: {
        type: Boolean,
        default: false
    },
    popcornMachine: {
        type: Boolean,
        default: false
    },
    cottonCandyMachine: {
        type: Boolean,
        default: false
    },
    snowConeMachine: {
        type: Boolean,
        default: false
    },
    margaritaMachine: {
        type: Boolean,
        default: false
    },
    slushyMachine: {
        type: Boolean,
        default: false
    },
    overnight: {
        type: Boolean,
        default: false
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    message: {
        type: String,
        required: false
    },
    sourcePage: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;