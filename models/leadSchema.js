const mongoose = require("mongoose");
const { Schema } = mongoose;


// lead schema includes choices, date, name, email, phone, address, zipCode, and message
const leadSchema = new Schema({
    choices: { type: String, required: true },
    date: { type: String, required: false },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    zipCode: { type: String, required: true },
    message: { type: String, required: false },
}, { timestamps: true });

const Lead = mongoose.model("Lead", leadSchema);

module.exports = Lead;