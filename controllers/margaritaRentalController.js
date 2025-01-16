// controllers/margaritaRentalController.js
const mongoose = require("mongoose");
const MargaritaRental = require("../models/margaritaRentalSchema");
const paypal = require("paypal-rest-sdk");

// Configure PayPal SDK
paypal.configure({
    mode: 'sandbox',
    client_id: process.env.PAYPAL_CLIENT_ID,
    client_secret: process.env.PAYPAL_SECRET
});

// Valid machine types and mixer types
const VALID_MACHINE_TYPES = ["single", "double"];
const VALID_MIXER_TYPES = ["none", "kool-aid", "margarita", "pina-colada"];
const VALID_STATUSES = ["pending", "confirmed", "cancelled", "completed"];

// Status transition rules
const VALID_STATUS_TRANSITIONS = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["completed", "cancelled"],
    cancelled: [],
    completed: []
};

// Helper function to check if machine is available on given dates
const checkAvailability = async (machineType, startDate, endDate) => {
    const conflictingBookings = await MargaritaRental.find({
        machineType,
        status: { $nin: ["cancelled", "completed"] },
        $or: [
            {
                rentalDate: { $lte: endDate },
                returnDate: { $gte: startDate },
            },
        ],
    });

    return conflictingBookings.length === 0;
};

// Helper function to validate dates
const validateDates = (rentalDate, returnDate) => {
    const rental = new Date(rentalDate);
    const return_ = new Date(returnDate);
    const now = new Date();

    // Check if dates are valid
    if (isNaN(rental.getTime()) || isNaN(return_.getTime())) {
        throw new Error("Invalid date format");
    }

    // Check if rental date is in the past
    if (rental < now) {
        throw new Error("Rental date cannot be in the past");
    }

    // Check if return date is before rental date
    if (return_ <= rental) {
        throw new Error("Return date must be after rental date");
    }
};

// Helper function to validate machine and mixer types
const validateMachineAndMixerTypes = (machineType, mixerType) => {
    if (!VALID_MACHINE_TYPES.includes(machineType) || !VALID_MIXER_TYPES.includes(mixerType)) {
        throw new Error("Invalid machine or mixer type");
    }
};

// Helper function to validate status transition
const validateStatusTransition = (currentStatus, newStatus) => {
    if (!VALID_STATUSES.includes(newStatus)) {
        throw new Error("Invalid status value");
    }

    if (!VALID_STATUS_TRANSITIONS[currentStatus]?.includes(newStatus)) {
        throw new Error("Invalid status transition");
    }
};

// GET /margarita-rentals - Get all rentals
const getAllRentals = async (req, res) => {
    try {
        const rentals = await MargaritaRental.find({})
            .sort({ createdAt: -1 });
        res.status(200).json(rentals);
    } catch (err) {
        res.status(500).json({
            error: "Failed to fetch rentals",
            details: err.message
        });
    }
};

// GET /margarita-rentals/:id - Get rental by ID
const getRentalById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid rental ID" });
        }

        const rental = await MargaritaRental.findById(req.params.id);
        if (!rental) {
            return res.status(404).json({ error: "Rental not found" });
        }
        res.status(200).json(rental);
    } catch (err) {
        res.status(500).json({
            error: "Failed to fetch rental",
            details: err.message
        });
    }
};

// POST /margarita-rentals/check-availability - Check machine availability
const checkMachineAvailability = async (req, res) => {
    try {
        const { machineType, rentalDate, returnDate } = req.body;

        if (!machineType || !rentalDate || !returnDate) {
            return res.status(400).json({
                error: "Machine type, rental date, and return date are required"
            });
        }

        // Validate dates
        try {
            validateDates(rentalDate, returnDate);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }

        const isAvailable = await checkAvailability(
            machineType,
            new Date(rentalDate),
            new Date(returnDate)
        );

        res.status(200).json({ available: isAvailable });
    } catch (err) {
        res.status(500).json({
            error: "Failed to check availability",
            details: err.message
        });
    }
};

// POST /margarita-rentals/create-payment - Create PayPal payment
const createPayment = async (req, res) => {
    try {
        const { machineType, mixerType } = req.body;

        try {
            validateMachineAndMixerTypes(machineType, mixerType);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }

        const amount = MargaritaRental.calculatePrice(machineType, mixerType);

        const create_payment_json = {
            intent: "sale",
            payer: {
                payment_method: "paypal"
            },
            redirect_urls: {
                return_url: `${process.env.CLIENT_URL}/success`,
                cancel_url: `${process.env.CLIENT_URL}/cancel`
            },
            transactions: [{
                amount: {
                    currency: "USD",
                    total: amount.toString()
                },
                description: `Margarita Machine Rental - ${machineType} with ${mixerType} mixer`
            }]
        };

        paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
                res.status(500).json({
                    error: "Failed to create payment",
                    details: error.message
                });
            } else {
                res.status(200).json({
                    orderId: payment.id,
                    amount: amount
                });
            }
        });
    } catch (err) {
        res.status(500).json({
            error: "Failed to create payment",
            details: err.message
        });
    }
};

// POST /margarita-rentals/capture-payment - Capture PayPal payment
const capturePayment = async (req, res) => {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({ error: "OrderId is required" });
        }

        paypal.payment.execute(orderId, { payer_id: "test-payer-id" }, function (error, payment) {
            if (error) {
                res.status(500).json({
                    error: "Failed to capture payment",
                    details: error.message
                });
            } else {
                res.status(200).json({
                    transactionId: payment.id,
                    status: payment.state
                });
            }
        });
    } catch (err) {
        res.status(500).json({
            error: "Failed to capture payment",
            details: err.message
        });
    }
};

// POST /margarita-rentals - Create a new rental
const createRental = async (req, res) => {
    try {
        const {
            machineType,
            mixerType,
            rentalDate,
            returnDate,
            customer,
            paypalTransactionId
        } = req.body;

        // Validate required fields
        if (!machineType || !mixerType || !rentalDate || !returnDate || !customer || !paypalTransactionId) {
            return res.status(400).json({
                error: "All fields are required"
            });
        }

        // Validate machine and mixer types
        try {
            validateMachineAndMixerTypes(machineType, mixerType);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }

        // Validate dates
        try {
            validateDates(rentalDate, returnDate);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }

        // Check availability
        const isAvailable = await checkAvailability(
            machineType,
            new Date(rentalDate),
            new Date(returnDate)
        );

        if (!isAvailable) {
            return res.status(400).json({
                error: "Machine is not available for the selected dates"
            });
        }

        // Calculate price
        const price = MargaritaRental.calculatePrice(machineType, mixerType);

        // Set capacity based on machine type
        const capacity = machineType === "single" ? 15 : 30;

        const rental = new MargaritaRental({
            machineType,
            capacity,
            mixerType,
            price,
            rentalDate,
            returnDate,
            customer,
            status: "pending",
            payment: {
                paypalTransactionId,
                amount: price,
                status: "completed"
            }
        });

        await rental.save();
        res.status(201).json(rental);
    } catch (err) {
        res.status(500).json({
            error: "Failed to create rental",
            details: err.message
        });
    }
};

// PUT /margarita-rentals/:id - Update rental status
const updateRentalStatus = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid rental ID" });
        }

        const { status } = req.body;
        const rental = await MargaritaRental.findById(req.params.id);

        if (!rental) {
            return res.status(404).json({ error: "Rental not found" });
        }

        try {
            validateStatusTransition(rental.status, status);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }

        rental.status = status;
        await rental.save();

        res.status(200).json(rental);
    } catch (err) {
        res.status(500).json({
            error: "Failed to update rental status",
            details: err.message
        });
    }
};

module.exports = {
    getAllRentals,
    getRentalById,
    checkMachineAvailability,
    createPayment,
    capturePayment,
    createRental,
    updateRentalStatus
};
