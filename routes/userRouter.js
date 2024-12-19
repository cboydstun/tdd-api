// routes/userRouter.js
const express = require("express");
const router = express.Router();

// import middleware and utils
const userController = require("../controllers/userController");
const logger = require('../utils/logger');

// define login route
router.post('/login', (req, res, next) => {
    logger.info(`Login attempt for user: ${req.body.email}`);
    userController.loginUser(req, res, next);
});

module.exports = router;
