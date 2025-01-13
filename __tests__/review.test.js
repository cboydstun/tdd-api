const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");
const Review = require("../models/reviewSchema");

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

// Valid review data for testing
const validReviewData = {
  reviewId: "test-review-123",
  placeId: "place-123",
  authorName: "Test User",
  rating: 4,
  text: "Great experience!",
  language: "en-US",
  authorUrl: "https://example.com/user",
  profilePhotoUrl: "https://example.com/photo.jpg",
  relativeTimeDescription: "a week ago",
  isLocalGuide: false,
};

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  // Ensure mockUser is set in app.locals before each test
  app.locals.mockUser = mockUser;
  await Review.deleteMany({});
  // Reset mock counters
  jest.clearAllMocks();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Review API Endpoints", () => {
  describe("GET /api/v1/reviews", () => {
    it("should return all reviews when no placeId is provided", async () => {
      await Review.create([
        validReviewData,
        {
          ...validReviewData,
          reviewId: "test-review-456",
          placeId: "place-456",
        },
      ]);

      const response = await request(app).get("/api/v1/reviews");

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty("rating");
      expect(response.body[0]).toHaveProperty("text");
    });

    it("should return filtered reviews when placeId is provided", async () => {
      await Review.create([
        validReviewData,
        {
          ...validReviewData,
          reviewId: "test-review-456",
          placeId: "place-456",
        },
      ]);

      const response = await request(app)
        .get("/api/v1/reviews")
        .query({ placeId: "place-123" });

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].placeId).toBe("place-123");
    });
  });

  describe("GET /api/v1/reviews/:id", () => {
    it("should return a review by id", async () => {
      const review = await Review.create(validReviewData);

      const response = await request(app)
        .get(`/api/v1/reviews/${review._id}`)
        .set("Authorization", "Bearer test-token");

      expect(response.status).toBe(200);
      expect(response.body.reviewId).toBe(validReviewData.reviewId);
      expect(response.body.rating).toBe(validReviewData.rating);
    });

    it("should return 404 for non-existent review", async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .get(`/api/v1/reviews/${fakeId}`)
        .set("Authorization", "Bearer test-token");

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Review not found");
    });

    it("should return 400 for invalid review ID format", async () => {
      const response = await request(app)
        .get("/api/v1/reviews/invalid-id")
        .set("Authorization", "Bearer test-token");

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Invalid review ID format");
    });
  });

  describe("POST /api/v1/reviews", () => {
    it("should create a new review", async () => {
      const response = await request(app)
        .post("/api/v1/reviews")
        .set("Authorization", "Bearer test-token")
        .send(validReviewData);

      expect(response.status).toBe(201);
      expect(response.body.reviewId).toBe(validReviewData.reviewId);
      expect(response.body.rating).toBe(validReviewData.rating);
      expect(response.body.text).toBe(validReviewData.text);
    });

    it("should not create a review with duplicate reviewId", async () => {
      // Create first review
      await Review.create(validReviewData);

      // Try to create another review with same reviewId
      const response = await request(app)
        .post("/api/v1/reviews")
        .set("Authorization", "Bearer test-token")
        .send(validReviewData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe(
        "Review with this reviewId already exists",
      );
    });

    it("should validate required fields", async () => {
      const invalidData = {
        text: "Missing required fields",
      };

      const response = await request(app)
        .post("/api/v1/reviews")
        .set("Authorization", "Bearer test-token")
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error", "Validation failed");
    });
  });

  describe("PUT /api/v1/reviews/:id", () => {
    it("should update an existing review", async () => {
      const review = await Review.create(validReviewData);

      const updateData = {
        rating: 5,
        text: "Updated review text",
      };

      const response = await request(app)
        .put(`/api/v1/reviews/${review._id}`)
        .set("Authorization", "Bearer test-token")
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.rating).toBe(updateData.rating);
      expect(response.body.text).toBe(updateData.text);
    });

    it("should not update review with duplicate reviewId", async () => {
      // Create two reviews
      const review1 = await Review.create(validReviewData);
      const review2 = await Review.create({
        ...validReviewData,
        reviewId: "test-review-456",
      });

      // Try to update review2 with review1's reviewId
      const response = await request(app)
        .put(`/api/v1/reviews/${review2._id}`)
        .set("Authorization", "Bearer test-token")
        .send({ reviewId: review1.reviewId });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe(
        "Review with this reviewId already exists",
      );
    });

    it("should return 404 for updating non-existent review", async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .put(`/api/v1/reviews/${fakeId}`)
        .set("Authorization", "Bearer test-token")
        .send({ rating: 5 });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Review not found");
    });

    it("should return 400 for invalid review ID format", async () => {
      const response = await request(app)
        .put("/api/v1/reviews/invalid-id")
        .set("Authorization", "Bearer test-token")
        .send({ rating: 5 });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Invalid review ID format");
    });
  });

  describe("DELETE /api/v1/reviews/:id", () => {
    it("should delete an existing review", async () => {
      const review = await Review.create(validReviewData);

      const response = await request(app)
        .delete(`/api/v1/reviews/${review._id}`)
        .set("Authorization", "Bearer test-token");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Review deleted successfully");

      const deletedReview = await Review.findById(review._id);
      expect(deletedReview).toBeNull();
    });

    it("should return 404 for deleting non-existent review", async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .delete(`/api/v1/reviews/${fakeId}`)
        .set("Authorization", "Bearer test-token");

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Review not found");
    });

    it("should return 400 for invalid review ID format", async () => {
      const response = await request(app)
        .delete("/api/v1/reviews/invalid-id")
        .set("Authorization", "Bearer test-token");

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Invalid review ID format");
    });
  });
});
