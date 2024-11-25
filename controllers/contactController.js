// controllers/contactController.js
const Contact = require('../models/contactSchema');
const nodemailer = require('nodemailer');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

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
        if (!contact) {
            return res.status(500).json({ error: "Contact not found" });
        }
        res.status(200).json(contact);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @POST - /contacts - Create a new contact - public
const createContact = async (req, res, next) => {
    try {
        if (!req.body.bouncer || !req.body.email || !req.body.partyDate || !req.body.partyZipCode || !req.body.sourcePage) {
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
                Cotton Candy Machine: ${req.body.cottonCandyMachine}
                Snow Cone Machine: ${req.body.snowConeMachine}
                Petting Zoo: ${req.body.pettingZoo}
                Pony Rides: ${req.body.ponyRides}
                DJ: ${req.body.dj}
                Overnight: ${req.body.overnight}
                Confirmed: NOT YET!
                Message: ${req.body.message}
                Source Page: ${req.body.sourcePage}
                `
        };

        transporter.sendMail(mailOptions, function (err, data) {
            if (err) {
                console.log('Error Occurs', err);
            } else {
                console.log('Email sent!!!');
            }
        });

        // SMS notification
        const smsBody = `
            New Bouncer Job:
            Bouncer: ${req.body.bouncer}
            Email: ${req.body.email}
            Date: ${req.body.partyDate}
            Phone: ${req.body.phone}
        `.trim();

        await client.messages.create({
            body: smsBody,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: process.env.USER_PHONE_NUMBER
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
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(500).json({ error: "Contact not found" });
        }
        const updatedContact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedContact);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @DELETE - /contacts/:id - Delete a contact by id - private
const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(500).json({ error: "Contact not found" });
        }
        const deletedContact = await Contact.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedContact);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @GET - check if bouncer is available on a given date - public
const getAvailable = async (req, res) => {
    try {
        // if contact is found and confirmed is true, then bouncer is not available
        const contact = await Contact.findOne({ bouncer: req.params.bouncer, partyDate: req.params.partyDate, confirmed: true });
        if (contact) {
            res.status(200).json({ available: false });
        }
        else {
            res.status(200).json({ available: true });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAllContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact,
    getAvailable
};
