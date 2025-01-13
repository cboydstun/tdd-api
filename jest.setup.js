// Mock security middleware
jest.mock("./middlewares/security", () => ({
  helmet: () => (req, res, next) => next(),
  ipRateLimiter: (req, res, next) => next(),
  speedLimiter: (req, res, next) => next(),
  xss: () => (req, res, next) => next(),
  hsts: () => (req, res, next) => next(),
  compression: () => (req, res, next) => next(),
  strictSecurityCheck: (req, res, next) => next(),
  trackBlockedAttempts: (req, res, next) => next(),
  enhancedLoggingMiddleware: (req, res, next) => next(),
}));

// Mock JWT middleware
jest.mock("./middlewares/jwtMiddleware", () => (req, res, next) => {
  req.user = {
    _id: "123456789",
    email: "test@example.com",
  };
  next();
});

// Mock upload middleware
jest.mock("./middlewares/uploadMiddleware", () => ({
  array: () => (req, res, next) => {
    req.files = [];
    next();
  },
}));

// Mock too busy utility
jest.mock("./utils/tooBusy", () => (req, res, next) => next());

// Mock logger
jest.mock("./utils/logger", () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
}));
