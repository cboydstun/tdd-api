// Import required modules and dependencies
const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config();

// Import custom utilities and middleware
const logger = require('./utils/logger');
const enhancedRequestLogging = require('./middlewares/enhancedRequestLogging');
const tooBusyCheck = require('./utils/tooBusy');
const { handleRobotsTxt, handleAdsTxt } = require('./utils/botHandler');

// Import security middleware
const {
  helmet,
  ipRateLimiter,
  speedLimiter,
  xss,
  hsts,
  compression,
  blockScanner,
  trackBlockedAttempts
} = require('./middlewares/security');

// Import additional middleware
const cors = require("cors");

// Import routes
const router = require("./routes/index");

// Apply enhanced request logging
app.use(enhancedRequestLogging);

// Configure and apply CORS
app.use(cors({
  origin: `${process.env.CLIENT_URL}`,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

// Set Cross-Origin-Resource-Policy header
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});

// Serve static files from 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, path, stat) => {
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

// Apply security middleware
app.use(helmet());
app.use(tooBusyCheck);
app.use(ipRateLimiter);
app.use(speedLimiter);
app.use(xss());
app.use(hsts({ maxAge: 15552000 })); // 180 days
app.use(compression());

// Configure body parsing
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// Apply custom security scanners
app.use(blockScanner);
app.use(trackBlockedAttempts);

// Trust proxy for accurate client IP detection
app.set('trust proxy', (ip) => {
  // Trust the first IP in X-Forwarded-For
  // You should adjust this based on your specific setup
  if (ip === '127.0.0.1' || ip === '::1') {
    return true; // trusted local IPs
  } else {
    // Add your reverse proxy's IP address here
    return ip === process.env.REVERSE_PROXY_IP;
  }
});

// Apply main router
app.use("/api/v1", router);

// Health check route
app.get("/api/health", (req, res) => {
  logger.info("Health check...");
  res.status(200).json({ status: "✅" });
});

// Bot handling routes
app.get('/robots.txt', handleRobotsTxt);
app.get('/ads.txt', handleAdsTxt);

// Global error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}\nStack: ${err.stack}`);
  res.status(500).json({ error: "Something broke!", stack: err.stack });
});

// 404 route for unhandled paths
app.use((req, res) => {
  logger.warn(`404 Not Found: ${req.method} ${req.path}`);
  res.status(404).json({ error: "404 unknown route", path: req.path });
});

module.exports = app;