const Lead = require("../models/leadSchema");
const nodemailer = require('nodemailer');

// @GET - /leads - Get all leads
const getAllLeads = async (req, res) => {
    try {
        const leads = await Lead.find({});
        res.status(200).json(leads);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @GET - /leads/:id - Get lead by id
const getLeadById = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        res.status(200).json(lead);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// @POST - /leads - Create a new lead - require name, email, phone, address, zipCode
const createLead = async (req, res, next) => {
    try {
        if (!req.body.name || !req.body.email || !req.body.phone || !req.body.address || !req.body.zipCode) {
            res.status(400).json({ error: "Please provide all required fields" });
        } else {
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD
                }
            });

            let mailOptions = {
                from: req.body.email,
                to: process.env.EMAIL,
                subject: `New Bounce Lead ${req.body.name} for ${req.body.date}`,
                text:
                    `
                Name: ${req.body.name}
                Email: ${req.body.email}
                Phone: ${req.body.phone}
                Choice: ${req.body.choices}
                Address: ${req.body.address}
                Zip Code: ${req.body.zipCode}
                Message: ${req.body.message}
                `
            };

            transporter.sendMail(mailOptions, (err, data) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
            });
            const lead = await Lead.create(req.body);
            res.status(201).json(lead);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @PUT - /leads/:id - Update a lead
const updateLead = async (req, res) => {
    try {
        const lead = await Lead.findByIdAndUpdate(req.body.id, req.body, { new: true });
        res.status(200).json(lead);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @DELETE - /leads/:id - Delete a lead
const deleteLead = async (req, res) => {
    try {
        const lead = await Lead.findByIdAndDelete(req.params.id);
        res.status(200).json(lead);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAllLeads,
    getLeadById,
    createLead,
    updateLead,
    deleteLead
};

