// Import required modules and dependencies
const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config();

// Import custom utilities and middleware
const logger = require('./utils/logger');
const tooBusyCheck = require('./utils/tooBusy');

// Import security middleware
const {
  helmet,
  ipRateLimiter,
  speedLimiter,
  xss,
  hsts,
  compression,
  strictSecurityCheck,
  trackBlockedAttempts,
  enhancedLoggingMiddleware,
} = require('./middlewares/security');

// Import additional middleware
const cors = require("cors");

// Import routes
const router = require("./routes/index");

// Apply strict security check before any other middleware
app.use(strictSecurityCheck);

app.use(enhancedLoggingMiddleware);

// Configure and apply CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'https://www.satxbounce.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

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

// Apply tracking of blocked attempts
app.use(trackBlockedAttempts);

// Trust proxy for accurate client IP detection
app.set('trust proxy', (ip) => {
  if (ip === '127.0.0.1' || ip === '::1') {
    return true; // trusted local IPs
  } else {
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

// Global error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}\nStack: ${err.stack}`);
  res.status(500).json({ error: "Something went wrong" });
});

module.exports = app;