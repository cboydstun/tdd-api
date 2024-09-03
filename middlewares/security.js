const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");
const xss = require("xss-clean");
const hsts = require("hsts");
const compression = require("compression");
const logger = require('../utils/logger');

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

const allowedOrigin = process.env.CLIENT_URL || 'https://www.satxbounce.com';

const strictSecurityCheck = (req, res, next) => {
    const origin = req.get('Origin');
    const referer = req.get('Referer');

    // Check if the request is coming from the allowed origin
    if (origin !== allowedOrigin && (!referer || !referer.startsWith(allowedOrigin))) {
        logger.warn(`Blocked request from unauthorized origin: ${req.ip}, Origin: ${origin}, Referer: ${referer}`);
        return res.status(403).send('Access Denied');
    }

    // Only allow specific HTTP methods
    const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'];
    if (!allowedMethods.includes(req.method)) {
        logger.warn(`Blocked request with unauthorized method: ${req.ip}, Method: ${req.method}`);
        return res.status(405).send('Method Not Allowed');
    }

    // Only allow requests to your API routes
    if (!req.path.startsWith('/api/v1/')) {
        logger.warn(`Blocked request to unauthorized path: ${req.ip}, Path: ${req.path}`);
        return res.status(404).send('Not Found');
    }

    next();
};

const blockedIPs = new Map();
const trackBlockedAttempts = (req, res, next) => {
  if (res.statusCode === 403 || res.statusCode === 405 || res.statusCode === 404) {
    const count = (blockedIPs.get(req.ip) || 0) + 1;
    blockedIPs.set(req.ip, count);
    if (count >= 5) {
      logger.error(`Multiple blocked attempts from IP: ${req.ip}, Count: ${count}`);
      // Implement temporary IP ban here
      return res.status(403).send('Access Denied');
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
  strictSecurityCheck,
  trackBlockedAttempts
};