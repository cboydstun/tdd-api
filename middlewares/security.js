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

const suspiciousPaths = [
  '/.env',
  '/.idea/workspace.xml',
  '/login.asp',
  '/wp-login.php',
  '/wp-admin',
  '/admin',
];

const blockScanner = (req, res, next) => {
    const userAgent = req.get('User-Agent') || '';
    const path = req.path.toLowerCase();
    const method = req.method;

    // Check user agent against blocked patterns
    if (blockedPatterns.some(pattern => userAgent.includes(pattern))) {
        logger.warn(`Blocked request from suspicious user agent: ${req.ip}, ${userAgent}`);
        return res.status(403).send('Access Denied');
    }

    // Check for suspicious paths, but exclude legitimate API routes
    if (!path.startsWith('/api/v1/') && suspiciousPaths.some(p => path.includes(p))) {
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

const blockedIPs = new Map();
const trackBlockedAttempts = (req, res, next) => {
  if (res.statusCode === 403) {
    const count = (blockedIPs.get(req.ip) || 0) + 1;
    blockedIPs.set(req.ip, count);
    if (count >= 5) {
      logger.error(`Multiple blocked attempts from IP: ${req.ip}, Count: ${count}`);
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
  blockScanner,
  trackBlockedAttempts
};