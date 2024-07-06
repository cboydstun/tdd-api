const mongoose = require('mongoose');

const rsvpSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    adultsAttending: {
        type: Number,
        required: true,
        min: 0
    },
    childrenAttending: {
        type: Number,
        required: true,
        min: 0
    }
});

const RSVP = mongoose.model('RSVP', rsvpSchema);

module.exports = RSVP;