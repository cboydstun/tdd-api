const request = require("supertest");
const app = require("./app");

// Import mocks
require('./__tests__/mocks/middleware');

describe("GET /api/health", () => {
    test("should return a 200 status code with an object including a green checkmark emoji", async () => {
        const response = await request(app).get("/api/health");
        expect(response.statusCode).toBe(200);
        expect(typeof response.body).toBe("object");
        expect(response.body.status).toBeDefined();
        expect(response.body.status).toBe("✅");
    });
});
