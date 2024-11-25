// Mock security middleware
jest.mock('../../middlewares/security', () => ({
    helmet: () => (req, res, next) => next(),
    ipRateLimiter: (req, res, next) => next(),
    speedLimiter: (req, res, next) => next(),
    xss: () => (req, res, next) => next(),
    hsts: () => (req, res, next) => next(),
    compression: () => (req, res, next) => next(),
    strictSecurityCheck: (req, res, next) => next(),
    trackBlockedAttempts: (req, res, next) => next(),
    enhancedLoggingMiddleware: (req, res, next) => next()
}));

// Mock JWT middleware
jest.mock('../../middlewares/jwtMiddleware', () => {
    return (req, res, next) => {
        // Get mockUser from app.locals and ensure we use it properly
        if (req.app.locals.mockUser) {
            console.log('Mock user in middleware:', req.app.locals.mockUser);
            console.log('Mock user _id in middleware:', req.app.locals.mockUser._id);
            console.log('Mock user _id type in middleware:', typeof req.app.locals.mockUser._id);

            // Create a new object to avoid reference issues
            req.user = {
                _id: req.app.locals.mockUser._id,
                email: req.app.locals.mockUser.email
            };

            console.log('Set user in middleware:', req.user);
            console.log('Set user _id type in middleware:', typeof req.user._id);
        }
        next();
    };
});

// Mock upload middleware
jest.mock('../../middlewares/uploadMiddleware', () => ({
    array: () => (req, res, next) => {
        req.files = [];
        next();
    }
}));

// Mock too busy utility
jest.mock('../../utils/tooBusy', () => (req, res, next) => next());
