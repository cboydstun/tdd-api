const Contact = require('../models/contactSchema');
const nodemailer = require('nodemailer');

// @GET - /contacts - Get all contacts - private
const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find({});
        res.status(200).json(contacts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @GET - /contacts/:id - Get contact by id - private
const getContactById = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        res.status(200).json(contact);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @POST - /contacts - Create a new contact - public
// Contact Model: Represents a contact entry submitted through the contact form
const createContact = async (req, res, next) => {
    try {
        if (!req.body.bouncer || !req.body.email || !req.body.partyDate || !req.body.partyZipCode) {
            throw new Error("Please provide all required fields");
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
            subject: `New Bounce Contact ${req.body.bouncer.toUpperCase()}`,
            text:
                `
                Incoming bounce house contact from ${req.body.bouncer.toUpperCase()}.
                Name: ${req.body.bouncer}
                Email: ${req.body.email}
                Party Date: ${req.body.partyDate}
                Party Zip Code: ${req.body.partyZipCode}
                Phone: ${req.body.phone}
                Tables and Chairs: ${req.body.tablesChairs}
                Generator: ${req.body.generator}
                Popcorn Machine: ${req.body.popcornMachine}
                Message: ${req.body.message}
                `
        };

        transporter.sendMail(mailOptions, function (err, data) {
            if (err) {
                console.log('Error Occurs', err);
            } else {
                console.log('Email sent!!!');
            }
        });

        const contact = await Contact.create(req.body);

        res.status(201).json(contact);
    } catch (err) {

        res.status(500).json({ error: err.message });

    }
};

// @PUT - /contacts/:id - Update a contact by id - private
const updateContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(contact);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @DELETE - /contacts/:id - Delete a contact by id - private
const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        res.status(200).json(contact);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact
};