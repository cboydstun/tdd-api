const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/jwtMiddleware");

const emailController = require("../controllers/emailController");

// define data routes
router.get('/', authMiddleware, emailController.getAllEmails);
router.get('/:id', authMiddleware, emailController.getEmailById);
router.post('/', emailController.createEmail); // PUBLIC
router.put('/:id', authMiddleware, emailController.updateEmail);
router.delete('/:id', authMiddleware, emailController.deleteEmail);

// export router
module.exports = router;