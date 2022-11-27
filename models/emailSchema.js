const mongoose = require("mongoose");
const { Schema } = mongoose;

const emailSchema = new Schema({
    from: { type: String, required: true },
    to: { type: String },
    subject: { type: String, required: true },
    text: { type: String, required: true },
}, { timestamps: true });

const Email = mongoose.model("Email", emailSchema);

module.exports = Email;