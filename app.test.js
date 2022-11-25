//import request and app
const request = require("supertest");
const app = require("./app");

//test the root path
describe("GET /", () => {
    test("It should respond with a 200 status code", async () => {
        const response = await request(app).get("/");
        expect(response.statusCode).toBe(200);
    });

    test("It should return an object", async () => {
        const response = await request(app).get("/");
        expect(typeof response.body).toBe("object");
    });

    test("It should return a message property", async () => {
        const response = await request(app).get("/");
        expect(response.body.message).toBeDefined();
    });

    test("It should return a message property with the value 'Hello World!'", async () => {
        const response = await request(app).get("/");
        expect(response.body.message).toBe("Hello World!");
    });
});