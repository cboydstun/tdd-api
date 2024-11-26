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

const allowedOrigins = [
  process.env.CLIENT_URL || 'https://www.satxbounce.com',
  'http://localhost:5173', // Vite development server
  'http://127.0.0.1:5173'
];

const enhancedLoggingMiddleware = (req, res, next) => {
  const startTime = process.hrtime();

  res.on('finish', () => {
    const duration = process.hrtime(startTime);
    const durationInMs = duration[0] * 1000 + duration[1] / 1e6;

    const logData = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl || req.url,
      status: res.statusCode,
      duration: `${durationInMs.toFixed(3)}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent') || 'Unknown',
      referer: req.get('Referer') || 'Unknown',
      origin: req.get('Origin') || 'Unknown',
      contentLength: res.get('Content-Length') || 0,
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

const strictSecurityCheck = (req, res, next) => {
  const origin = req.get('Origin');
  const referer = req.get('Referer');

  // Allow access to uploads directory and health check
  if (req.path.startsWith('/uploads/') || req.path === '/api/health') {
    return next();
  }

  // Check if the request is coming from an allowed origin
  if (origin && !allowedOrigins.includes(origin)) {
    if (!referer || !allowedOrigins.some(allowed => referer.startsWith(allowed))) {
      logger.warn(`Blocked unauthorized request: ${req.method} ${req.path} from ${req.ip}`, {
        origin: origin || 'Unknown',
        referer: referer || 'Unknown',
        path: req.path,
      });
      return res.status(403).send('Access Denied');
    }
  }

  // Only allow specific HTTP methods
  const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'];
  if (!allowedMethods.includes(req.method)) {
    logger.warn(`Blocked unauthorized method: ${req.method} from ${req.ip}`, {
      method: req.method,
      path: req.path,
    });
    return res.status(405).send('Method Not Allowed');
  }

  // Only allow requests to your API routes, uploads, or health check
  if (!req.path.startsWith('/api/v1/') && !req.path.startsWith('/uploads/') && req.path !== '/api/health') {
    logger.warn(`Blocked unauthorized path: ${req.method} ${req.path} from ${req.ip}`, {
      path: req.path,
    });
    return res.status(404).send('Not Found');
  }

  next();
};

const blockedIPs = new Map();
const trackBlockedAttempts = (req, res, next) => {
  if ([403, 405, 404].includes(res.statusCode)) {
    const count = (blockedIPs.get(req.ip) || 0) + 1;
    blockedIPs.set(req.ip, count);
    if (count >= 5) {
      logger.error(`Multiple blocked attempts from IP: ${req.ip}, Count: ${count}`);
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
  enhancedLoggingMiddleware,
  trackBlockedAttempts
};
