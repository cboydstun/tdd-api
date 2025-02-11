const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");
const Product = require("../models/productSchema");
const slugify = require("slugify");

// Mock Cloudinary
jest.mock("cloudinary", () => require("./mocks/cloudinary"));

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

// Valid product data for testing
const validProductData = {
  name: "Bounce Castle",
  description: "A fun bounce castle for kids",
  category: "Inflatables",
  price: {
    base: 150,
    currency: "USD",
  },
  rentalDuration: "full-day",
  availability: "available",
  images: [], // Initialize with empty array since images are handled separately
  specifications: [
    {
      name: "Material",
      value: "PVC",
    },
  ],
  dimensions: {
    length: 15,
    width: 15,
    height: 12,
    unit: "feet",
  },
  capacity: 8,
  ageRange: {
    min: 3,
    max: 12,
  },
  setupRequirements: {
    space: "20x20 feet",
    powerSource: true,
    surfaceType: ["grass", "concrete"],
  },
  features: ["blower included", "safety netting"],
  safetyGuidelines: "Adult supervision required at all times",
  weatherRestrictions: ["no rain", "wind under 15mph"],
};

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  app.locals.mockUser = mockUser;
  await Product.deleteMany({});
  // Reset mock counters
  jest.clearAllMocks();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Product API Endpoints", () => {
  describe("GET /api/v1/products", () => {
    it("should return all products", async () => {
      await Product.create([
        {
          ...validProductData,
          slug: slugify(validProductData.name, { lower: true }),
        },
        {
          ...validProductData,
          name: "Water Slide",
          slug: "water-slide",
        },
      ]);

      const response = await request(app).get("/api/v1/products");

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty("name");
      expect(response.body[0]).toHaveProperty("price");
    });

    it("should only return available products for non-authenticated users", async () => {
      await Product.create([
        {
          ...validProductData,
          slug: slugify(validProductData.name, { lower: true }),
        },
        {
          ...validProductData,
          name: "Water Slide",
          slug: "water-slide",
          availability: "maintenance",
        },
      ]);

      // Remove mock user to simulate non-authenticated request
      delete app.locals.mockUser;

      const response = await request(app).get("/api/v1/products");

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].availability).toBe("available");
    });
  });

  describe("GET /api/v1/products/:slug", () => {
    it("should return a product by slug", async () => {
      const product = await Product.create({
        ...validProductData,
        slug: slugify(validProductData.name, { lower: true }),
      });

      const response = await request(app).get(
        `/api/v1/products/${product.slug}`,
      );

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(validProductData.name);
      expect(response.body.price.base).toBe(validProductData.price.base);
    });

    it("should return 404 for non-existent product", async () => {
      const response = await request(app).get("/api/v1/products/non-existent");

      expect(response.status).toBe(404);
    });
  });

  describe("POST /api/v1/products", () => {
    it("should create a new product", async () => {
      const response = await request(app)
        .post("/api/v1/products")
        .set("Authorization", "Bearer test-token")
        .send(validProductData);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe(validProductData.name);
      expect(response.body.price.base).toBe(validProductData.price.base);
    });

    it("should validate required fields", async () => {
      const invalidData = {
        name: "Test Product",
        // Missing required fields
      };

      const response = await request(app)
        .post("/api/v1/products")
        .set("Authorization", "Bearer test-token")
        .send(invalidData);

      expect(response.status).toBe(400);
    });

    it("should validate rental duration enum", async () => {
      const invalidData = {
        ...validProductData,
        rentalDuration: "invalid-duration",
      };

      const response = await request(app)
        .post("/api/v1/products")
        .set("Authorization", "Bearer test-token")
        .send(invalidData);

      expect(response.status).toBe(400);
    });

    it("should validate availability enum", async () => {
      const invalidData = {
        ...validProductData,
        availability: "invalid-status",
      };

      const response = await request(app)
        .post("/api/v1/products")
        .set("Authorization", "Bearer test-token")
        .send(invalidData);

      expect(response.status).toBe(400);
    });

    it("should enforce unique slug", async () => {
      // Create first product
      await Product.create({
        ...validProductData,
        slug: slugify(validProductData.name, { lower: true }),
      });

      // Try to create another product with same name (which generates same slug)
      const response = await request(app)
        .post("/api/v1/products")
        .set("Authorization", "Bearer test-token")
        .send(validProductData);

      expect(response.status).toBe(400);
    });

    it("should validate price", async () => {
      const invalidData = {
        ...validProductData,
        price: {
          base: -150,
          currency: "USD",
        },
      };

      const response = await request(app)
        .post("/api/v1/products")
        .set("Authorization", "Bearer test-token")
        .send(invalidData);

      expect(response.status).toBe(400);
    });

    it("should validate dimensions", async () => {
      const invalidData = {
        ...validProductData,
        dimensions: {
          length: -15,
          width: 15,
          height: 12,
          unit: "invalid-unit",
        },
      };

      const response = await request(app)
        .post("/api/v1/products")
        .set("Authorization", "Bearer test-token")
        .send(invalidData);

      expect(response.status).toBe(400);
    });

    it("should validate capacity", async () => {
      const invalidData = {
        ...validProductData,
        capacity: -8,
      };

      const response = await request(app)
        .post("/api/v1/products")
        .set("Authorization", "Bearer test-token")
        .send(invalidData);

      expect(response.status).toBe(400);
    });

    it("should validate age range", async () => {
      const invalidData = {
        ...validProductData,
        ageRange: {
          min: 12,
          max: 3, // max less than min
        },
      };

      const response = await request(app)
        .post("/api/v1/products")
        .set("Authorization", "Bearer test-token")
        .send(invalidData);

      expect(response.status).toBe(400);
    });
  });

  describe("PUT /api/v1/products/:slug", () => {
    it("should update an existing product", async () => {
      const product = await Product.create({
        ...validProductData,
        slug: slugify(validProductData.name, { lower: true }),
      });

      const updateData = {
        name: "Updated Bounce Castle",
        price: {
          base: 200,
          currency: "USD",
        },
      };

      const response = await request(app)
        .put(`/api/v1/products/${product.slug}`)
        .set("Authorization", "Bearer test-token")
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updateData.name);
      expect(response.body.price.base).toBe(updateData.price.base);
    });

    it("should return 404 for updating non-existent product", async () => {
      const updateData = { name: "Updated Name" };

      const response = await request(app)
        .put("/api/v1/products/non-existent")
        .set("Authorization", "Bearer test-token")
        .send(updateData);

      expect(response.status).toBe(404);
    });

    it("should validate updated price", async () => {
      const product = await Product.create({
        ...validProductData,
        slug: slugify(validProductData.name, { lower: true }),
      });

      const updateData = {
        price: {
          base: -200,
          currency: "USD",
        },
      };

      const response = await request(app)
        .put(`/api/v1/products/${product.slug}`)
        .set("Authorization", "Bearer test-token")
        .send(updateData);

      expect(response.status).toBe(400);
    });

    it("should validate updated dimensions", async () => {
      const product = await Product.create({
        ...validProductData,
        slug: slugify(validProductData.name, { lower: true }),
      });

      const updateData = {
        dimensions: {
          length: -15,
          width: 15,
          height: 12,
          unit: "invalid-unit",
        },
      };

      const response = await request(app)
        .put(`/api/v1/products/${product.slug}`)
        .set("Authorization", "Bearer test-token")
        .send(updateData);

      expect(response.status).toBe(400);
    });
  });

  describe("DELETE /api/v1/products/:slug", () => {
    it("should delete an existing product", async () => {
      const product = await Product.create({
        ...validProductData,
        slug: slugify(validProductData.name, { lower: true }),
        images: [
          {
            url: "https://test-cloudinary-url.com/image.jpg",
            public_id: "test-public-id",
            alt: "Test Image",
            isPrimary: true,
          },
        ],
      });

      const response = await request(app)
        .delete(`/api/v1/products/${product.slug}`)
        .set("Authorization", "Bearer test-token");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Product successfully deleted");

      const deletedProduct = await Product.findOne({ slug: product.slug });
      expect(deletedProduct).toBeNull();
    });

    it("should return 404 for deleting non-existent product", async () => {
      const response = await request(app)
        .delete("/api/v1/products/non-existent")
        .set("Authorization", "Bearer test-token");

      expect(response.status).toBe(404);
    });
  });

  describe("DELETE /api/v1/products/:slug/images/:imageName", () => {
    it("should delete an image from a product", async () => {
      const product = await Product.create({
        ...validProductData,
        slug: slugify(validProductData.name, { lower: true }),
        images: [
          {
            url: "https://test-cloudinary-url.com/image.jpg",
            public_id: "test-public-id",
            filename: "test-image.jpg",
            alt: "Test Image",
            isPrimary: true,
          },
        ],
      });

      const response = await request(app)
        .delete(`/api/v1/products/${product.slug}/images/test-image.jpg`)
        .set("Authorization", "Bearer test-token");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Image removed successfully");

      const updatedProduct = await Product.findOne({ slug: product.slug });
      expect(updatedProduct.images).toHaveLength(0);
    });

    it("should return 404 for non-existent image", async () => {
      const product = await Product.create({
        ...validProductData,
        slug: slugify(validProductData.name, { lower: true }),
      });

      const response = await request(app)
        .delete(`/api/v1/products/${product.slug}/images/non-existent.jpg`)
        .set("Authorization", "Bearer test-token");

      expect(response.status).toBe(404);
    });
  });
});
