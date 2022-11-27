const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

// define data routes
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

// define login route
router.post('/login', userController.loginUser);

// export router
module.exports = router;