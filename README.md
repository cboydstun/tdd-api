# TDD API

A robust, production-ready RESTful API built with Node.js and Express.js, featuring comprehensive security measures, resource management, and file handling capabilities.

## Features

- **Authentication & Authorization**

  - JWT-based authentication
  - Role-based access control
  - Secure password hashing with bcrypt

- **Security**

  - Helmet security headers
  - Rate limiting and speed limiting
  - XSS protection
  - HSTS enabled
  - Compression
  - CORS configuration
  - Request size limiting
  - Too busy server protection

- **Resource Management**

  - Blog posts CRUD operations
  - Products management
  - Contact form handling
  - Email functionality
  - Lead management
  - User management

- **File Operations**

  - File upload support with Multer
  - Static file serving
  - Upload size restrictions
  - Cloudinary integration for media storage

- **Error Handling & Logging**
  - Centralized error handling
  - Winston logger implementation with multiple transports
  - Enhanced logging middleware with Morgan
  - Request tracking
  - Environment-based log levels
  - Separate error and combined log files

## Prerequisites

- Node.js (v16 or higher recommended)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone https://github.com/cboydstun/tdd-api.git
cd tdd-api
```

2. Install dependencies:

```bash
npm install
```

3. Create a .env file based on sample.env:

```bash
cp sample.env .env
```

4. Configure your environment variables in .env

## Environment Variables

Required environment variables:

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT
- `CLIENT_URL`: Frontend application URL
- `PORT`: API port (default: 8080)

## Running the Application

Development mode:

```bash
npm start
```

Run tests:

```bash
npm test
```

Watch mode for tests:

```bash
npm run test:watch
```

Seed sample data:

```bash
npm run seed:blogs    # Seed blog posts
npm run seed:products # Seed products
```

## API Endpoints

### Authentication & Users

- POST `/api/v1/users/login` - User login
- GET `/api/v1/users` - Get all users (Protected)
- GET `/api/v1/users/:id` - Get specific user (Protected)
- POST `/api/v1/users` - Create new user (Protected)
- PUT `/api/v1/users/:id` - Update user (Protected)
- DELETE `/api/v1/users/:id` - Delete user (Protected)

### Blog Posts

- GET `/api/v1/blogs` - Get all blog posts
- POST `/api/v1/blogs` - Create new blog post (Protected)
- GET `/api/v1/blogs/:id` - Get specific blog post
- PUT `/api/v1/blogs/:id` - Update blog post (Protected)
- DELETE `/api/v1/blogs/:id` - Delete blog post (Protected)

### Products

- GET `/api/v1/products` - Get all products
- POST `/api/v1/products` - Create new product (Protected)
- GET `/api/v1/products/:id` - Get specific product
- PUT `/api/v1/products/:id` - Update product (Protected)
- DELETE `/api/v1/products/:id` - Delete product (Protected)

### Contacts

- GET `/api/v1/contacts` - Get all contacts (Protected)
- POST `/api/v1/contacts` - Submit contact form
- GET `/api/v1/contacts/:id` - Get specific contact (Protected)
- PUT `/api/v1/contacts/:id` - Update contact (Protected)
- DELETE `/api/v1/contacts/:id` - Delete contact (Protected)
- GET `/api/v1/contacts/available/:partyDate/:bouncer` - Check availability

### Health Check

- GET `/api/health` - API health status

## Security Features

1. **Rate Limiting**: Prevents brute force attacks
2. **XSS Protection**: Sanitizes input to prevent cross-site scripting
3. **Helmet**: Sets various HTTP headers for security
4. **CORS**: Configurable Cross-Origin Resource Sharing
5. **Request Limiting**: Prevents large payload attacks
6. **Too Busy**: Prevents DoS attacks by monitoring event loop

## Logging System

The API uses Winston for advanced logging with the following features:

- Multiple severity levels (error, warn, info, http, debug)
- Environment-based logging (development shows all logs, production shows only warn/error)
- Colored console output for better visibility
- Timestamp format: YYYY-MM-DD HH:mm:ss:ms
- File-based logging:
  - `logs/error.log`: Contains only error-level messages
  - `logs/all.log`: Contains all log messages
- HTTP request logging via Morgan middleware

## Error Handling

The API implements centralized error handling with detailed logging:

- Validation errors
- Authentication errors
- Authorization errors
- Resource not found
- Server errors

## Testing

The project uses Jest for testing with the following features:

- Unit tests for controllers and services
- Integration tests for API endpoints
- Mock implementations for external services (Cloudinary, Nodemailer, Twilio)
- In-memory MongoDB for testing
- Watch mode for development
- Supertest for HTTP assertions

Run tests with:

```bash
npm test          # Run all tests
npm run test:watch # Run tests in watch mode
```

## License

ISC

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## HTTPS with AWS Lightsail

[Link to YouTube Video](https://www.youtube.com/watch?v=rtshCulV2hk)

- `sudo /opt/bitnami/bncert-tool`
- press "Y" for yes
- repeat `sudo /opt/bitnami/bncert-tool`
- Enter domain "domain.com", a space, and then "www.domain.com"
- Answer "Y" for yes, "Y" for yes, "N" for no, "Y" for yes
- Enter email address
- Enter "Y" for yes
- Press "Enter" to continue
