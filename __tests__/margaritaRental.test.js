const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");
const MargaritaRental = require("../models/margaritaRentalSchema");

// Mock PayPal SDK
jest.mock("@paypal/paypal-server-sdk", () => require("./mocks/paypal"));

// Mock the JWT middleware
jest.mock("../middlewares/jwtMiddleware", () => {
    return jest.fn((req, res, next) => {
        req.user = {
            _id: req.app.locals.mockUser._id,
            email: req.app.locals.mockUser.email,
        };
        next();
    });
});

let mongoServer;

// Create a valid ObjectId for the mock user
const mockUserId = new mongoose.Types.ObjectId();

// Mock user for authentication
const mockUser = {
    _id: mockUserId,
    email: "test@example.com",
};

// Valid rental data for testing
const validRentalData = {
    machineType: "single",
    mixerType: "margarita",
    rentalDate: new Date("2024-12-25"),
    returnDate: new Date("2024-12-26"),
    customer: {
        name: "John Doe",
        email: "john@example.com",
        phone: "+1234567890",
        address: {
            street: "123 Main St",
            city: "Test City",
            state: "TX",
            zipCode: "12345"
        }
    },
    paypalTransactionId: "test-transaction-id"
};

beforeAll(async () => {
    // Mock PayPal environment variables
    process.env.PAYPAL_CLIENT_ID = "test-client-id";
    process.env.PAYPAL_CLIENT_SECRET = "test-client-secret";

    // Mock MargaritaRental.calculatePrice static method
    MargaritaRental.calculatePrice = jest.fn().mockImplementation((machineType, mixerType) => {
        const prices = {
            single: {
                none: 89.95,
                "kool-aid": 99.95,
                margarita: 124.95,
                "pina-colada": 124.95,
            },
            double: {
                none: 124.95,
                "kool-aid": 149.95,
                margarita: 174.95,
                "pina-colada": 174.95,
            },
        };
        return prices[machineType][mixerType];
    });

    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
});

beforeEach(async () => {
    app.locals.mockUser = mockUser;
    await MargaritaRental.deleteMany({});
    jest.clearAllMocks();
});

afterAll(async () => {
    // Clean up environment variables
    delete process.env.PAYPAL_CLIENT_ID;
    delete process.env.PAYPAL_CLIENT_SECRET;

    await mongoose.disconnect();
    await mongoServer.stop();
});

describe("Margarita Rental API Endpoints", () => {
    describe("POST /api/v1/margarita-rentals/check-availability", () => {
        it("should check availability for given dates", async () => {
            const checkData = {
                machineType: "single",
                rentalDate: "2024-12-25",
                returnDate: "2024-12-26"
            };

            const response = await request(app)
                .post("/api/v1/margarita-rentals/check-availability")
                .send(checkData);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("available", true);
        });

        it("should return unavailable if machine is already booked", async () => {
            // Create an existing booking
            await MargaritaRental.create({
                ...validRentalData,
                status: "confirmed",
                price: 124.95, // Price for single tank with margarita mixer
                capacity: 15, // Capacity for single tank
                payment: {
                    paypalTransactionId: "test-transaction-id",
                    amount: 124.95,
                    status: "completed"
                }
            });

            const checkData = {
                machineType: "single",
                rentalDate: "2024-12-25",
                returnDate: "2024-12-26"
            };

            const response = await request(app)
                .post("/api/v1/margarita-rentals/check-availability")
                .send(checkData);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("available", false);
        });

        it("should validate required fields", async () => {
            const invalidData = {
                machineType: "single"
                // Missing dates
            };

            const response = await request(app)
                .post("/api/v1/margarita-rentals/check-availability")
                .send(invalidData);

            expect(response.status).toBe(400);
        });
    });

    describe("POST /api/v1/margarita-rentals/create-payment", () => {
        it("should create a PayPal payment", async () => {
            const paymentData = {
                machineType: "single",
                mixerType: "margarita"
            };

            const response = await request(app)
                .post("/api/v1/margarita-rentals/create-payment")
                .send(paymentData);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("orderId", "test-order-id");
            expect(response.body).toHaveProperty("amount", 124.95); // Price for single tank with margarita mixer
        });

        it("should validate machine and mixer types", async () => {
            const invalidData = {
                machineType: "invalid",
                mixerType: "invalid"
            };

            const response = await request(app)
                .post("/api/v1/margarita-rentals/create-payment")
                .send(invalidData);

            expect(response.status).toBe(500);
        });
    });

    describe("POST /api/v1/margarita-rentals/capture-payment", () => {
        it("should capture a PayPal payment", async () => {
            const captureData = {
                orderId: "test-order-id"
            };

            const response = await request(app)
                .post("/api/v1/margarita-rentals/capture-payment")
                .send(captureData);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("transactionId", "test-transaction-id");
            expect(response.body).toHaveProperty("status", "COMPLETED");
        });
    });

    describe("POST /api/v1/margarita-rentals", () => {
        it("should create a new rental", async () => {
            const response = await request(app)
                .post("/api/v1/margarita-rentals")
                .send(validRentalData);

            expect(response.status).toBe(201);
            expect(response.body.machineType).toBe(validRentalData.machineType);
            expect(response.body.mixerType).toBe(validRentalData.mixerType);
            expect(response.body.price).toBe(124.95); // Price for single tank with margarita mixer
            expect(response.body.capacity).toBe(15); // Capacity for single tank
        });

        it("should validate required fields", async () => {
            const invalidData = {
                machineType: "single"
                // Missing other required fields
            };

            const response = await request(app)
                .post("/api/v1/margarita-rentals")
                .send(invalidData);

            expect(response.status).toBe(400);
        });

        it("should validate machine availability", async () => {
            // Create an existing booking
            await MargaritaRental.create({
                ...validRentalData,
                status: "confirmed",
                price: 124.95, // Price for single tank with margarita mixer
                capacity: 15, // Capacity for single tank
                payment: {
                    paypalTransactionId: "test-transaction-id",
                    amount: 124.95,
                    status: "completed"
                }
            });

            // Try to create another booking for the same dates
            const response = await request(app)
                .post("/api/v1/margarita-rentals")
                .send(validRentalData);

            expect(response.status).toBe(400);
            expect(response.body.error).toBe("Machine is not available for the selected dates");
        });
    });

    describe("GET /api/v1/margarita-rentals (Protected)", () => {
        it("should return all rentals", async () => {
            await MargaritaRental.create([
                {
                    ...validRentalData,
                    price: 124.95, // Price for single tank with margarita mixer
                    capacity: 15, // Capacity for single tank
                    payment: {
                        paypalTransactionId: "test-transaction-id",
                        amount: 124.95,
                        status: "completed"
                    }
                },
                {
                    ...validRentalData,
                    machineType: "double",
                    price: 174.95, // Price for double tank with margarita mixer
                    capacity: 30, // Capacity for double tank
                    payment: {
                        paypalTransactionId: "test-transaction-id",
                        amount: 174.95,
                        status: "completed"
                    }
                }
            ]);

            const response = await request(app)
                .get("/api/v1/margarita-rentals")
                .set("Authorization", "Bearer test-token");

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(2);
        });
    });

    describe("GET /api/v1/margarita-rentals/:id (Protected)", () => {
        it("should return a rental by id", async () => {
            const rental = await MargaritaRental.create({
                ...validRentalData,
                price: 124.95, // Price for single tank with margarita mixer
                capacity: 15, // Capacity for single tank
                payment: {
                    paypalTransactionId: "test-transaction-id",
                    amount: 124.95,
                    status: "completed"
                }
            });

            const response = await request(app)
                .get(`/api/v1/margarita-rentals/${rental._id}`)
                .set("Authorization", "Bearer test-token");

            expect(response.status).toBe(200);
            expect(response.body.machineType).toBe(validRentalData.machineType);
        });

        it("should return 404 for non-existent rental", async () => {
            const fakeId = new mongoose.Types.ObjectId();

            const response = await request(app)
                .get(`/api/v1/margarita-rentals/${fakeId}`)
                .set("Authorization", "Bearer test-token");

            expect(response.status).toBe(404);
        });
    });

    describe("PUT /api/v1/margarita-rentals/:id (Protected)", () => {
        it("should update rental status", async () => {
            const rental = await MargaritaRental.create({
                ...validRentalData,
                price: 124.95, // Price for single tank with margarita mixer
                capacity: 15, // Capacity for single tank
                payment: {
                    paypalTransactionId: "test-transaction-id",
                    amount: 124.95,
                    status: "completed"
                }
            });

            const response = await request(app)
                .put(`/api/v1/margarita-rentals/${rental._id}`)
                .set("Authorization", "Bearer test-token")
                .send({ status: "confirmed" });

            expect(response.status).toBe(200);
            expect(response.body.status).toBe("confirmed");
        });

        it("should return 404 for non-existent rental", async () => {
            const fakeId = new mongoose.Types.ObjectId();

            const response = await request(app)
                .put(`/api/v1/margarita-rentals/${fakeId}`)
                .set("Authorization", "Bearer test-token")
                .send({ status: "confirmed" });

            expect(response.status).toBe(404);
        });
    });
});
