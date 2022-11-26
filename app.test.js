//import request and app
const request = require("supertest");
const app = require("./app");

// @GET / - should serve up the React SPA index.html file
describe("GET /", () => {
    test("should render a React App", async () => {
        const response = await request(app).get("/");
        expect(response.statusCode).toBe(200);
        //should serve up an index.html file
        expect(response.text).toContain("<!doctype html>");
        //should have a title of "React App"
        expect(response.text).toContain("<title>React App</title>");
        //should have a div with an id of "root"
        expect(response.text).toContain('<div id="root"></div>');
    });
});

// @GET /api/health - should return a 200 status code and a JSON object with a status property with the value '"✅'
describe("GET /api/health", () => {
    test("should return a 200 status code with an object including a green checkmark emoji", async () => {
        const response = await request(app).get("/api/health");
        expect(response.statusCode).toBe(200);
        expect(typeof response.body).toBe("object");
        expect(response.body.status).toBeDefined();
        expect(response.body.status).toBe("✅");
    });
});

// any unknown route - should return a 404 status code and a JSON object with an error property with the value '"404 unknown route'
describe("any page that returns a 404", () => {
    test("any unknown route", async () => {
        const response = await request(app).get("/foo");
        //should return a 404 status code
        expect(response.statusCode).toBe(404);
        //should return a JSON object with an error property with the value '"404 unknown route'
        expect(typeof response.body).toBe("object");
        expect(response.body.error).toBeDefined();
        expect(response.body.error).toBe("404 unknown route");
    });
});

// error handling for any 500 errors
describe("any page that returns a 500", () => {
    test("It should respond with a 500 status code", async () => {
        const response = await request(app).get("/api/bugsalot");
        expect(response.statusCode).toBe(500);

        expect(typeof response.body).toBe("object");
        expect(response.body.error).toBeDefined();
        expect(response.body.error).toBe("Something broke!");
    });
});

// @GET /api/v1/blogs - should return a 200 status code and an array of blog objects
// describe("GET /api/v1/blogs", () => {
//     test("should return a 200 status code and an array of blog objects", async () => {
//         const response = await request(app).get("/api/v1/blogs");
//         expect(response.statusCode).toBe(200);
//         expect(Array.isArray(response.body)).toBe(true);
//         expect(response.body.length).toBe(3);
//         expect(response.body[0].title).toBeDefined();
//         expect(response.body[0].author).toBeDefined();
//         expect(response.body[0].body).toBeDefined();
//         expect(response.body[0].comments).toBeDefined();
//         expect(response.body[0].date).toBeDefined();
//         expect(response.body[0].hidden).toBeDefined();
//         expect(response.body[0].meta).toBeDefined();
//     });
// });