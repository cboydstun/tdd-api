const logger = require('../utils/logger');

const enhancedRequestLogging = (req, res, next) => {
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

module.exports = enhancedRequestLogging;