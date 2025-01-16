// controllers/margaritaRentalController.js
const MargaritaRental = require("../models/margaritaRentalSchema");
const paypal = require("@paypal/paypal-server-sdk");

// PayPal client configuration
let clientId = process.env.PAYPAL_CLIENT_ID;
let clientSecret = process.env.PAYPAL_CLIENT_SECRET;
let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
let client = new paypal.core.PayPalHttpClient(environment);

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
        const amount = MargaritaRental.calculatePrice(machineType, mixerType);

        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
            intent: "CAPTURE",
            purchase_units: [{
                amount: {
                    currency_code: "USD",
                    value: amount.toString()
                }
            }]
        });

        const order = await client.execute(request);
        res.status(200).json({
            orderId: order.result.id,
            amount: amount
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
        const request = new paypal.orders.OrdersCaptureRequest(orderId);
        const capture = await client.execute(request);

        res.status(200).json({
            transactionId: capture.result.purchase_units[0].payments.captures[0].id,
            status: capture.result.status
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
        const { status } = req.body;
        const rental = await MargaritaRental.findById(req.params.id);

        if (!rental) {
            return res.status(404).json({ error: "Rental not found" });
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
