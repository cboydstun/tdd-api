const Email = require("../models/emailSchema");
const nodemailer = require('nodemailer');

// @GET - /emails - Get all emails
const getAllEmails = async (req, res) => {
    try {
        const emails = await Email.find({});
        res.status(200).json(emails);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @GET - /emails/:id - Get email by id
const getEmailById = async (req, res) => {
    try {
        const email = await Email.findById(req.params.id);
        res.status(200).json(email);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @POST - /emails - Create a new email
const createEmail = async (req, res) => {
    try {
        if (!req.body.from || !req.body.subject || !req.body.text) {
            res.status(400).json({ error: "Please provide all required fields" });
        } else {
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL || 'abc@gmail.com', // TODO: your gmail account
                    pass: process.env.PASSWORD || '1234' // TODO: your gmail password
                }
            });

            let mailOptions = {
                from: req.body.from,
                to: process.env.EMAIL,
                subject: req.body.subject,
                text: req.body.text
            };

            transporter.sendMail(mailOptions, (err, data) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
            });
            const email = await Email.create(req.body);
            res.status(201).json(email);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @PUT - /emails/:id - Update an email
const updateEmail = async (req, res) => {
    try {
        const email = await
            Email.findByIdAndUpdate(req.body.id, req.body, { new: true });
        res.status(200).json(email);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @DELETE - /emails/:id - Delete an email
const deleteEmail = async (req, res) => {
    try {
        const email = await Email.findByIdAndDelete(req.params.id);
        res.status(200).json(email);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    getAllEmails,
    getEmailById,
    createEmail,
    updateEmail,
    deleteEmail
};