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
    message: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
