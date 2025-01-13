const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");
const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  await User.deleteMany({});
  // Create a test user directly using the model
  const testUser = new User({
    email: "test@example.com",
    password: "password123",
  });
  await testUser.save();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("User Authentication", () => {
  describe("POST /api/v1/users/login", () => {
    it("should login with valid credentials and return token", async () => {
      const loginData = {
        email: "test@example.com",
        password: "password123",
      };

      const response = await request(app)
        .post("/api/v1/users/login")
        .send(loginData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");

      const decodedToken = jwt.verify(
        response.body.token,
        process.env.JWT_SECRET,
      );
      expect(decodedToken).toHaveProperty("id");
    });

    it("should not login with incorrect password", async () => {
      const loginData = {
        email: "test@example.com",
        password: "wrongpassword",
      };

      const response = await request(app)
        .post("/api/v1/users/login")
        .send(loginData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Incorrect password");
    });

    it("should not login with non-existent email", async () => {
      const loginData = {
        email: "nonexistent@example.com",
        password: "password123",
      };

      const response = await request(app)
        .post("/api/v1/users/login")
        .send(loginData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("User not found");
    });

    it("should not login without email", async () => {
      const loginData = {
        password: "password123",
      };

      const response = await request(app)
        .post("/api/v1/users/login")
        .send(loginData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Please provide an email");
    });

    it("should not login without password", async () => {
      const loginData = {
        email: "test@example.com",
      };

      const response = await request(app)
        .post("/api/v1/users/login")
        .send(loginData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Please provide a password");
    });
  });
});
