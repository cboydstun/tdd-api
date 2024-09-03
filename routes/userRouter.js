// routes/userRouter.js
const express = require("express");
const router = express.Router();

// import middleware and utils
const authMiddleware = require("../middlewares/jwtMiddleware");
const userController = require("../controllers/userController");
const logger = require('../utils/logger');

// define data routes
router.get('/', authMiddleware, userController.getAllUsers);
router.get('/:id', authMiddleware, userController.getUserById);
router.post('/', userController.createUser); // PUBLIC
router.put('/:id', authMiddleware, userController.updateUser);
router.delete('/:id', authMiddleware, userController.deleteUser);

// define login route
router.post('/login', (req, res, next) => {
    logger.info(`Login attempt for user: ${req.body.email}`);
    userController.login(req, res, next); // PUBLIC
});

// export router
module.exports = router;