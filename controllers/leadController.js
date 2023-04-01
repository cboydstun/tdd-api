const Lead = require("../models/leadSchema");
const nodemailer = require('nodemailer');

const { formatDate } = require("../utils/formatDate");

require("dotenv").config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = require("twilio")(accountSid, authToken);

const timeZone = 'America/Chicago'; // or whatever time zone is used by the API

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
            throw new Error("Please provide all required fields");
        }

        console.log(req.body.date);

        // check for lead by size and date
        const existingLead = await Lead.findOne({
            date: req.body.date,
            choices: req.body.choices
        });

        if (existingLead) {
            throw new Error("There is already a lead for this date and size");
        }

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
            subject: `New Bounce Lead ${req.body.name.toUpperCase()} for ${req.body.date}`,
            text:
                `
                Incoming bounce house lead from ${req.body.name.toUpperCase()} for ${req.body.date}.
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

        twilioClient.messages
            .create({
                body: `Your ${req.body.choices.toUpperCase()} bounce house reservation for ${req.body.date} has been received. We will contact you shortly. Thank you for choosing SATX Bounce!`,
                from: "+18449773588",
                to: req.body.phone
            })
            .then(message => console.log(message.sid));

        const lead = await Lead.create(req.body);
        res.status(201).json(lead);

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

// @GET - get all leads by size - /leads/:size
const getLeadsBySize = async (req, res) => {
    try {
        const leads = await Lead.find({ choices: req.params.size });
        res.status(200).json(leads);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @GET - get all leads by date - /leads/:date
const getLeadsByDate = async (req, res) => {
    try {
        const date = new Date(req.params.date);

        const leads = await Lead.find({ date: date });
        res.status(200).json(leads);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @GET - get all leads by size and date - /leads/available/:size?date
const getLeadsBySizeAndDate = async (req, res) => {
    try {
        const date = new Date(req.query.date);
        const leads = await Lead.find({ choices: req.params.size });
        const filteredLeads = leads.filter((lead) => {
            const leadDate = new Date(lead.date);
            return leadDate.getTime() === date.getTime();
        });
        res.status(200).json(filteredLeads);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @GET - check if leads by size and date are available - /leads/available/:size
const checkLeadsAvailability = async (req, res) => {
    try {
        const date = new Date(req.query.date);
        const leads = await Lead.find({ choices: req.params.size }).select('-_id -name -email -phone');
        const filteredLeads = leads.filter((lead) => {
            const leadDate = new Date(lead.date);
            return leadDate.getTime() === date.getTime();
        });
        const exists = filteredLeads.length > 0;
        res.status(200).json({ exists });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAllLeads,
    getLeadById,
    createLead,
    updateLead,
    deleteLead,
    getLeadsBySizeAndDate,
    getLeadsBySize,
    getLeadsByDate,
    getLeadsBySizeAndDate,
    checkLeadsAvailability
};

