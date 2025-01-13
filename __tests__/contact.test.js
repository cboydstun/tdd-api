const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");
const Contact = require("../models/contactSchema");

// Mock environment variables
process.env.TWILIO_PHONE_NUMBER = "+15005550006";
process.env.USER_PHONE_NUMBER = "+15005550006";
process.env.EMAIL = "test@example.com";
process.env.PASSWORD = "test-password";

// Mock Twilio
jest.mock("twilio", () => require("./mocks/twilio"));

// Mock Nodemailer
jest.mock("nodemailer", () => require("./mocks/nodemailer"));

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

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  // Ensure mockUser is set in app.locals before each test
  app.locals.mockUser = mockUser;
  await Contact.deleteMany({});
  // Clear mock data
  jest.clearAllMocks();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Contact API Endpoints", () => {
  const validContactData = {
    bouncer: "Castle Combo",
    email: "test@example.com",
    partyDate: "2024-12-25",
    phone: "+15005550006", // Twilio test number
    partyZipCode: "78250",
    tablesChairs: true,
    generator: false,
    message: "Test party request",
    sourcePage: "/bouncers/castle-combo",
  };

  describe("POST /api/v1/contacts (Public)", () => {
    it("should create a new contact and send notifications", async () => {
      const response = await request(app)
        .post("/api/v1/contacts")
        .send(validContactData);

      expect(response.status).toBe(201);
      expect(response.body.email).toBe(validContactData.email);
      expect(response.body.bouncer).toBe(validContactData.bouncer);

      // Verify Twilio mock was called
      const twilioMock = require("twilio")();
      expect(twilioMock.messages.create).toHaveBeenCalledTimes(1);

      // Verify Nodemailer mock was called
      const nodemailer = require("nodemailer");
      expect(nodemailer.createTransport).toHaveBeenCalled();
      expect(nodemailer.createTransport().sendMail).toHaveBeenCalled();
    });

    it("should return 500 for missing required fields", async () => {
      const invalidData = {
        email: "test@example.com",
        // Missing required fields
      };

      const response = await request(app)
        .post("/api/v1/contacts")
        .send(invalidData);

      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Please provide all required fields");
    });
  });

  describe("GET /api/v1/contacts/available/:partyDate/:bouncer (Public)", () => {
    it("should check availability for a date and bouncer", async () => {
      const partyDate = "2024-12-25";
      const bouncer = "Castle-Combo";

      const response = await request(app).get(
        `/api/v1/contacts/available/${partyDate}/${bouncer}`,
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("available", true);
    });

    it("should return unavailable if date is already booked", async () => {
      // Create a confirmed booking
      await Contact.create({
        ...validContactData,
        confirmed: true,
      });

      const partyDate = "2024-12-25";
      const bouncer = "Castle Combo"; // Match exactly with validContactData

      const response = await request(app).get(
        `/api/v1/contacts/available/${partyDate}/${bouncer}`,
      );

      expect(response.status).toBe(200);
      expect(response.body.available).toBe(false);
    });
  });

  describe("GET /api/v1/contacts (Protected)", () => {
    it("should return all contacts", async () => {
      // Create test contacts
      await Contact.create([
        validContactData,
        {
          ...validContactData,
          email: "test2@example.com",
        },
      ]);

      const response = await request(app)
        .get("/api/v1/contacts")
        .set("Authorization", "Bearer test-token");

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });
  });

  describe("GET /api/v1/contacts/:id (Protected)", () => {
    it("should return a contact by id", async () => {
      const contact = await Contact.create(validContactData);

      const response = await request(app)
        .get(`/api/v1/contacts/${contact._id}`)
        .set("Authorization", "Bearer test-token");

      expect(response.status).toBe(200);
      expect(response.body.email).toBe(validContactData.email);
    });

    it("should return 500 for non-existent contact", async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .get(`/api/v1/contacts/${fakeId}`)
        .set("Authorization", "Bearer test-token");

      expect(response.status).toBe(500);
    });
  });

  describe("PUT /api/v1/contacts/:id (Protected)", () => {
    it("should update an existing contact", async () => {
      const contact = await Contact.create(validContactData);

      const updateData = {
        confirmed: true,
        message: "Updated message",
      };

      const response = await request(app)
        .put(`/api/v1/contacts/${contact._id}`)
        .set("Authorization", "Bearer test-token")
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.confirmed).toBe(true);
      expect(response.body.message).toBe("Updated message");
    });

    it("should return 500 for updating non-existent contact", async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .put(`/api/v1/contacts/${fakeId}`)
        .set("Authorization", "Bearer test-token")
        .send({ confirmed: true });

      expect(response.status).toBe(500);
    });
  });

  describe("DELETE /api/v1/contacts/:id (Protected)", () => {
    it("should delete an existing contact", async () => {
      const contact = await Contact.create(validContactData);

      const response = await request(app)
        .delete(`/api/v1/contacts/${contact._id}`)
        .set("Authorization", "Bearer test-token");

      expect(response.status).toBe(200);

      const deletedContact = await Contact.findById(contact._id);
      expect(deletedContact).toBeNull();
    });

    it("should return 500 for deleting non-existent contact", async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .delete(`/api/v1/contacts/${fakeId}`)
        .set("Authorization", "Bearer test-token");

      expect(response.status).toBe(500);
    });
  });
});
