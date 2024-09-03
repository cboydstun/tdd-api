// app.js
const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config();

// Import logger
const logger = require('./utils/logger');

// import and use logging middleware
const enhancedRequestLogging = require('./middlewares/enhancedRequestLogging');
app.use(enhancedRequestLogging);

// import and use CORS to allow cross-origin requests
const cors = require("cors");

// CORS configuration
app.use(cors({
  origin: `${process.env.CLIENT_URL}`,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

// Add Cross-Origin-Resource-Policy header to all responses
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, path, stat) => {
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

// import and use helmet to secure headers
const helmet = require("helmet");
app.use(helmet());

// too busy
const tooBusy = require("toobusy-js");
app.use((req, res, next) => {
  if (tooBusy()) {
    logger.warn(`Server too busy. Request denied for: ${req.ip}`);
    res.status(503).send("Server is too busy right now, try again later.");
  } else {
    next();
  }
});

// express-rate-limit
const rateLimit = require("express-rate-limit");
const ipRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  keyGenerator: (req) => req.ip,
});

// Apply rate limiting to all requests
app.use(ipRateLimiter);

// Implement request throttling
const slowDown = require("express-slow-down");
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 100, // allow 100 requests per 15 minutes, then...
  delayMs: () => 500, // always delay by 500ms once delayAfter is reached
  maxDelayMs: 2000, // maximum delay of 2 seconds
});
app.use(speedLimiter);

// xss-clean
const xss = require("xss-clean");
app.use(xss());

// hsts
const hsts = require("hsts");
app.use(hsts({ maxAge: 15552000 }));

// compression
const compression = require("compression");
app.use(compression());

// import bodyparser middleware
const bodyParser = require("body-parser");
app.use(express.json({ limit: '100kb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '100kb' }));
app.use(express.urlencoded({ limit: '100kb', extended: true }));

// suspicious user agents
const blockedPatterns = [
  'scanner.ducks.party',
  'Chrome/74.0.3729.169',
  'Expanse, a Palo Alto Networks company',
  'Mozilla/5.0 (ZZ;',
  'Mozilla/5.0 (X11; U; Linux x86_64; en-US; rv:1.9.1.13) Gecko/20100916 Iceape/2.0.8',
  'Chrome/81.0.4044.129',
  'Apache-HttpClient',
  'Chrome/107.0.0.0',
];

// suspicious paths that scanners should not be accessing
const suspiciousPaths = [
  '/.env',
  '/.idea/workspace.xml',
  '/login.asp',
  '/wp-login.php',
  '/wp-admin',
  '/admin',
  '/login'
];

// blockScanner middleware
const blockScanner = (req, res, next) => {
  const userAgent = req.get('User-Agent') || '';
  const path = req.path.toLowerCase();
  const method = req.method;
  
  // Check user agent against blocked patterns
  if (blockedPatterns.some(pattern => userAgent.includes(pattern))) {
    logger.warn(`Blocked request from suspicious user agent: ${req.ip}, ${userAgent}`);
    return res.status(403).send('Access Denied');
  }
  
  // Check for suspicious paths
  if (suspiciousPaths.some(p => path.includes(p))) {
    logger.warn(`Blocked request to suspicious path: ${req.ip}, ${path}`);
    return res.status(403).send('Access Denied');
  }
  
  // Check for empty or suspicious user agents
  if (!userAgent || userAgent === 'Unknown') {
    logger.warn(`Blocked request with suspicious user agent: ${req.ip}, ${userAgent}`);
    return res.status(403).send('Access Denied');
  }
  
  // Block HEAD requests to root path
  if (method === 'HEAD' && path === '/') {
    logger.warn(`Blocked suspicious HEAD request to root: ${req.ip}`);
    return res.status(403).send('Access Denied');
  }

  // Additional checks for specific malicious behavior
  if (path === '/' && (method === 'GET' || method === 'POST')) {
    logger.warn(`Blocked suspicious ${method} request to root: ${req.ip}`);
    return res.status(403).send('Access Denied');
  }

  next();
};

// Use the middleware in your Express app
app.use(blockScanner);

// Log and notify on repeated blocked attempts
const blockedIPs = new Map();
app.use((req, res, next) => {
  if (res.statusCode === 403) {
    const count = (blockedIPs.get(req.ip) || 0) + 1;
    blockedIPs.set(req.ip, count);
    if (count >= 5) {
      logger.error(`Multiple blocked attempts from IP: ${req.ip}, Count: ${count}`);
    }
  }
  next();
});

// trust proxy and get real IP address
app.set('trust proxy', true);

// import jwt middleware
const authMiddleware = require("./middlewares/jwtMiddleware");

// import routes
const router = require("./routes/index");

// use routes
app.use("/api/v1", router);

// health check route
app.get("/api/health", (req, res) => {
  logger.info("Health check...");
  res.status(200).json({ status: "✅" });
});

// Handle legitimate bot traffic
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send("User-agent: *\nDisallow: /api/\nDisallow: /admin/");
});

app.get('/ads.txt', (req, res) => {
  res.type('text/plain');
  res.send("# No ads configuration");
});

// buggy route to test the 500 route error handler
app.get("/api/bugsalot", (req, res) => {
  throw new Error("Buggy route");
});

// protected route
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ message: "You are authorized" });
});

// serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// handle errors
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}\nStack: ${err.stack}`);
  res.status(500).json({ error: "Something broke!", stack: err.stack });
});

// create 404 route
app.use((req, res) => {
  logger.warn(`404 Not Found: ${req.method} ${req.path}`);
  res.status(404).json({ error: "404 unknown route", path: req.path });
});

module.exports = app;