const express = require("express");
const router = express.Router();

// import middleware
const authMiddleware = require("../middlewares/jwtMiddleware");

const userController = require("../controllers/userController");

// define data routes
router.get('/', authMiddleware, userController.getAllUsers);
router.get('/:id', authMiddleware, userController.getUserById);
router.post('/', userController.createUser); // PUBLIC
router.put('/:id', authMiddleware, userController.updateUser);
router.delete('/:id', authMiddleware, userController.deleteUser);

// define login route - PUBLIC
router.post('/login', userController.loginUser);

// export router
module.exports = router;