const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");
const Blog = require("../models/blogSchema");
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

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  // Ensure mockUser is set in app.locals before each test
  app.locals.mockUser = mockUser;
  await Blog.deleteMany({});
  // Reset mock counters
  jest.clearAllMocks();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Blog API Endpoints", () => {
  describe("GET /api/v1/blogs", () => {
    it("should return all published blogs", async () => {
      // Create test blogs
      await Blog.create([
        {
          title: "Published Blog",
          slug: "published-blog",
          introduction: "Test intro",
          body: "Test body",
          conclusion: "Test conclusion",
          author: mockUser._id,
          status: "published",
        },
        {
          title: "Draft Blog",
          slug: "draft-blog",
          introduction: "Draft intro",
          body: "Draft body",
          conclusion: "Draft conclusion",
          author: mockUser._id,
          status: "draft",
        },
      ]);

      const response = await request(app).get("/api/v1/blogs");

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe("Published Blog");
    });
  });

  describe("GET /api/v1/blogs/:slug", () => {
    it("should return a blog by slug", async () => {
      const blog = await Blog.create({
        title: "Test Blog",
        slug: "test-blog",
        introduction: "Test intro",
        body: "Test body",
        conclusion: "Test conclusion",
        author: mockUser._id,
        status: "published",
      });

      const response = await request(app).get(`/api/v1/blogs/${blog.slug}`);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe("Test Blog");
    });

    it("should return 404 for non-existent blog", async () => {
      const response = await request(app).get("/api/v1/blogs/non-existent");

      expect(response.status).toBe(404);
    });
  });

  describe("POST /api/v1/blogs", () => {
    it("should create a new blog", async () => {
      const blogData = {
        title: "New Blog",
        introduction: "New intro",
        body: "New body",
        conclusion: "New conclusion",
        status: "draft",
        images: JSON.stringify([{
          url: "https://res.cloudinary.com/demo/image/upload/v1234/test.jpg",
          public_id: "test",
          secure_url: "https://res.cloudinary.com/demo/image/upload/v1234/test.jpg"
        }])
      };

      const response = await request(app)
        .post("/api/v1/blogs")
        .set("Authorization", "Bearer test-token")
        .send(blogData);

      expect(response.status).toBe(201);
      expect(response.body.title).toBe("New Blog");
      expect(response.body.slug).toBe("new-blog");
      expect(response.body.author).toBe(mockUser._id.toString());
    });

    it("should return 400 for missing required fields", async () => {
      const blogData = {
        title: "New Blog",
        // Missing required fields
      };

      const response = await request(app)
        .post("/api/v1/blogs")
        .set("Authorization", "Bearer test-token")
        .send(blogData);

      expect(response.status).toBe(400);
    });
  });

  describe("PUT /api/v1/blogs/:slug", () => {
    it("should update an existing blog", async () => {
      const blog = await Blog.create({
        title: "Original Blog",
        slug: "original-blog",
        introduction: "Original intro",
        body: "Original body",
        conclusion: "Original conclusion",
        author: mockUser._id,
        status: "draft",
      });

      const updateData = {
        title: "Updated Blog",
        introduction: "Updated intro",
        body: "Updated body",
        conclusion: "Updated conclusion",
        images: JSON.stringify([{
          url: "https://res.cloudinary.com/demo/image/upload/v1234/test2.jpg",
          public_id: "test2",
          secure_url: "https://res.cloudinary.com/demo/image/upload/v1234/test2.jpg"
        }])
      };

      const response = await request(app)
        .put(`/api/v1/blogs/${blog.slug}`)
        .set("Authorization", "Bearer test-token")
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe("Updated Blog");
    });

    it("should return 404 for updating non-existent blog", async () => {
      const updateData = {
        title: "Updated Blog",
      };

      const response = await request(app)
        .put("/api/v1/blogs/non-existent")
        .set("Authorization", "Bearer test-token")
        .send(updateData);

      expect(response.status).toBe(404);
    });
  });

  describe("DELETE /api/v1/blogs/:slug", () => {
    it("should delete an existing blog", async () => {
      const blog = await Blog.create({
        title: "Blog to Delete",
        slug: "blog-to-delete",
        introduction: "Delete intro",
        body: "Delete body",
        conclusion: "Delete conclusion",
        author: mockUser._id,
        status: "draft",
      });

      const response = await request(app)
        .delete(`/api/v1/blogs/${blog.slug}`)
        .set("Authorization", "Bearer test-token");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Blog successfully deleted");

      const deletedBlog = await Blog.findOne({ slug: blog.slug });
      expect(deletedBlog).toBeNull();
    });

    it("should return 404 for deleting non-existent blog", async () => {
      const response = await request(app)
        .delete("/api/v1/blogs/non-existent")
        .set("Authorization", "Bearer test-token");

      expect(response.status).toBe(404);
    });
  });

  describe("DELETE /api/v1/blogs/:slug/images/:imageName", () => {
    it("should delete an image from a blog", async () => {
      const blog = await Blog.create({
        title: "Blog with Image",
        slug: "blog-with-image",
        introduction: "Test intro",
        body: "Test body",
        conclusion: "Test conclusion",
        author: mockUser._id,
        images: [
          {
            filename: "test-image.jpg",
            url: "https://test-cloudinary-url.com/image.jpg",
            public_id: "test-public-id",
            mimetype: "image/jpeg",
            size: 1024,
          },
        ],
      });

      const response = await request(app)
        .delete(`/api/v1/blogs/${blog.slug}/images/test-image.jpg`)
        .set("Authorization", "Bearer test-token");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Image removed successfully");

      const updatedBlog = await Blog.findOne({ slug: blog.slug });
      expect(updatedBlog.images).toHaveLength(0);
    });

    it("should return 404 for non-existent image", async () => {
      const blog = await Blog.create({
        title: "Blog without Image",
        slug: "blog-without-image",
        introduction: "Test intro",
        body: "Test body",
        conclusion: "Test conclusion",
        author: mockUser._id,
      });

      const response = await request(app)
        .delete(`/api/v1/blogs/${blog.slug}/images/non-existent.jpg`)
        .set("Authorization", "Bearer test-token");

      expect(response.status).toBe(404);
    });
  });
});
