// app.js
// import express and initialize app
const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config();

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

// import and use csurf
const csrf = require('csurf');
app.use(csrf({ cookie: true }));

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
  keyGenerator: (req) => {
    return req.ip; // Use IP address for rate limiting
  },
});

// Apply rate limiting to all requests
app.use(ipRateLimiter);

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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ limit: '100kb', extended: true }));

// suspicious IP addresses
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
];

// blockScanner middleware
const blockScanner = (req, res, next) => {
  const userAgent = req.get('User-Agent') || '';
  const path = req.path;
  const method = req.method;
  
  // Check user agent against blocked patterns
  if (blockedPatterns.some(pattern => userAgent.includes(pattern))) {
    logger.warn(`Blocked request from suspicious user agent: ${req.ip}, ${userAgent}`);
    return res.status(403).send('Access Denied');
  }
  
  // Check for suspicious paths
  if (suspiciousPaths.includes(path)) {
    logger.warn(`Blocked request to suspicious path: ${req.ip}, ${path}`);
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

// trust proxy and get real IP address
app.set('trust proxy', true);

// import jwt middleware
const authMiddleware = require("./middlewares/jwtMiddleware");

// import routes
const router = require("./routes/index");

// use routes
app.use("/api/v1", router);

//health check route
app.get("/api/health", (req, res) => {
  logger.info("Health check...");
  res.status(200).json({ status: "✅" });
});

//buggy route to test the 500 route error handler
app.get("/api/bugsalot", (req, res) => {
  throw new Error("Buggy route");
});

// protected route
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ message: "You are authorized" });
});

// serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//handle errors
app.use((err, req, res, next) => {
  res.status(500).json({ error: "Something broke!", stack: err.stack });
});

//create 404 route
app.use((req, res) => {
  res.status(404).json({ error: "404 unknown route", path: req.path });
});

module.exports = app;