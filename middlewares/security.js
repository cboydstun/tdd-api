const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");
const xss = require("xss-clean");
const hsts = require("hsts");
const compression = require("compression");
const logger = require("../utils/logger");

const ipRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip,
});

const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 100,
  delayMs: () => 500,
  maxDelayMs: 2000,
});

const allowedOrigins = [
  process.env.CLIENT_URL || "https://www.satxbounce.com",
  "http://localhost:5173", // Vite development server
  "http://127.0.0.1:5173",
  "https://bounce-v2-ruby.vercel.app/",
];

const enhancedLoggingMiddleware = (req, res, next) => {
  const startTime = process.hrtime();

  res.on("finish", () => {
    const duration = process.hrtime(startTime);
    const durationInMs = duration[0] * 1000 + duration[1] / 1e6;

    const logData = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl || req.url,
      status: res.statusCode,
      duration: `${durationInMs.toFixed(3)}ms`,
      ip: req.ip,
      userAgent: req.get("User-Agent") || "Unknown",
      referer: req.get("Referer") || "Unknown",
      origin: req.get("Origin") || "Unknown",
      contentLength: res.get("Content-Length") || 0,
    };

    const logMessage = `${logData.method} ${logData.url} ${logData.status} ${logData.duration} - ${logData.ip} - ${logData.userAgent}`;

    if (res.statusCode >= 400) {
      logger.warn(logMessage, logData);
    } else {
      logger.info(logMessage, logData);
    }
  });

  next();
};

const blockedIPs = new Map();
const trackBlockedAttempts = (req, res, next) => {
  if ([403, 405, 404].includes(res.statusCode)) {
    const count = (blockedIPs.get(req.ip) || 0) + 1;
    blockedIPs.set(req.ip, count);
    if (count >= 5) {
      logger.error(
        `Multiple blocked attempts from IP: ${req.ip}, Count: ${count}`,
      );
      return res.status(403).send("Access Denied");
    }
  }
  next();
};

module.exports = {
  helmet,
  ipRateLimiter,
  speedLimiter,
  xss,
  hsts,
  compression,
  enhancedLoggingMiddleware,
  trackBlockedAttempts,
};
