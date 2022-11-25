//import request and app
const request = require("supertest");
const app = require("./app");

//test the "hello world" route
describe("GET /", () => {
    it("should return a 200 status code", async () => {
        const response = await request(app).get("/");
        expect(response.statusCode).toBe(200);
    });
    it("should return a JSON object from the GET route", async () => {
        const response = await request(app).get("/");
        expect(response.body).toEqual({ message: "Hello World!" });
    });
});


//test the health path
describe("GET /health", () => {
    test("It should respond with a 200 status code", async () => {
        const response = await request(app).get("/health");
        expect(response.statusCode).toBe(200);
    });

    test("It should return an object", async () => {
        const response = await request(app).get("/health");
        expect(typeof response.body).toBe("object");
    });

    test("It should return a status property", async () => {
        const response = await request(app).get("/health");
        expect(response.body.status).toBeDefined();
    });

    test("It should return a status property with the value 'UP'", async () => {
        const response = await request(app).get("/health");
        expect(response.body.status).toBe("✅");
    });
});

//test the 404 path
describe("any page that returns a 404", () => {
    test("It should respond with a 404 status code", async () => {
        const response = await request(app).get("/foo");
        expect(response.statusCode).toBe(404);
    });

    test("It should return an object", async () => {
        const response = await request(app).get("/foo");
        expect(typeof response.body).toBe("object");
    });

    test("It should return an error property", async () => {
        const response = await request(app).get("/foo");
        expect(response.body.error).toBeDefined();
    });

    test("It should return an error property with the value 'Not found'", async () => {
        const response = await request(app).get("/foo");
        expect(response.body.error).toBe("404 unknown route");
    });
});
