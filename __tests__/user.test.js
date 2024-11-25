const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const User = require('../models/userSchema');
const jwt = require('jsonwebtoken');

// Mock the JWT middleware for protected routes
jest.mock('../middlewares/jwtMiddleware', () => {
    return jest.fn((req, res, next) => {
        req.user = {
            _id: req.app.locals.mockUser._id,
            email: req.app.locals.mockUser.email
        };
        next();
    });
});

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
});

beforeEach(async () => {
    await User.deleteMany({});
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('User Authentication Endpoints', () => {
    describe('POST /api/v1/users (Register)', () => {
        it('should register a new user with valid credentials', async () => {
            const userData = {
                email: 'test@example.com',
                password: 'password123'
            };

            const response = await request(app)
                .post('/api/v1/users')
                .send(userData);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('_id');
            expect(response.body.email).toBe(userData.email);
            // Password should be hashed
            expect(response.body.password).not.toBe(userData.password);
        });

        it('should not register a user without email', async () => {
            const userData = {
                password: 'password123'
            };

            const response = await request(app)
                .post('/api/v1/users')
                .send(userData);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });

        it('should not register a user without password', async () => {
            const userData = {
                email: 'test@example.com'
            };

            const response = await request(app)
                .post('/api/v1/users')
                .send(userData);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });

        it('should not register a duplicate email', async () => {
            const userData = {
                email: 'test@example.com',
                password: 'password123'
            };

            // Register first user
            await request(app)
                .post('/api/v1/users')
                .send(userData);

            // Try to register same email again
            const response = await request(app)
                .post('/api/v1/users')
                .send(userData);

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('error');
        });
    });

    describe('POST /api/v1/users/login', () => {
        beforeEach(async () => {
            // Create a test user before each login test
            await request(app)
                .post('/api/v1/users')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });
        });

        it('should login with valid credentials and return token', async () => {
            const loginData = {
                email: 'test@example.com',
                password: 'password123'
            };

            const response = await request(app)
                .post('/api/v1/users/login')
                .send(loginData);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');

            // Verify token is valid JWT
            const decodedToken = jwt.verify(response.body.token, process.env.JWT_SECRET);
            expect(decodedToken).toHaveProperty('id');
        });

        it('should not login with incorrect password', async () => {
            const loginData = {
                email: 'test@example.com',
                password: 'wrongpassword'
            };

            const response = await request(app)
                .post('/api/v1/users/login')
                .send(loginData);

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Incorrect password');
        });

        it('should not login with non-existent email', async () => {
            const loginData = {
                email: 'nonexistent@example.com',
                password: 'password123'
            };

            const response = await request(app)
                .post('/api/v1/users/login')
                .send(loginData);

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('User not found');
        });

        it('should not login without email', async () => {
            const loginData = {
                password: 'password123'
            };

            const response = await request(app)
                .post('/api/v1/users/login')
                .send(loginData);

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Please provide an email');
        });

        it('should not login without password', async () => {
            const loginData = {
                email: 'test@example.com'
            };

            const response = await request(app)
                .post('/api/v1/users/login')
                .send(loginData);

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Please provide a password');
        });
    });
});
