const nodemailer = require('nodemailer');
const RSVP = require('../models/rsvpSchema'); // Adjust the path as needed

// @POST - /rsvp - Create a new RSVP - public
const createRSVP = async (req, res) => {
    try {
        const { name, phoneNumber, email, adultsAttending, childrenAttending } = req.body;

        if (!name || !phoneNumber || !email || adultsAttending === undefined || childrenAttending === undefined) {
            return res.status(400).json({ error: "Please provide all required fields" });
        }

        // Create new RSVP
        const rsvp = await RSVP.create({
            name,
            phoneNumber,
            email,
            adultsAttending,
            childrenAttending
        });

        // Set up email transporter
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });

        // Set up email content
        let mailOptions = {
            from: req.body.email,
            to: process.env.EMAIL,
            subject: `New Party RSVP from ${name}`,
            text: `
                New RSVP received:
                Name: ${name}
                Phone Number: ${phoneNumber}
                Email: ${email}
                Adults Attending: ${adultsAttending}
                Children Attending: ${childrenAttending}
            `
        };

        // Send email
        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log('Error sending email:', err);
            } else {
                console.log('Email sent successfully');
            }
        });

        res.status(201).json(rsvp);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createRSVP
};