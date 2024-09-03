const toobusy = require('toobusy-js');
const logger = require('./logger');

const tooBusyCheck = (req, res, next) => {
  if (toobusy()) {
    logger.warn(`Server too busy. Request denied for: ${req.ip}`);
    res.status(503).send("Server is too busy right now, try again later.");
  } else {
    next();
  }
};

module.exports = tooBusyCheck;