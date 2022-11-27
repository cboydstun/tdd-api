const express = require("express");
const router = express.Router();

const emailController = require("../controllers/emailController");

// define data routes
router.get('/', emailController.getAllEmails);
router.get('/:id', emailController.getEmailById);
router.post('/', emailController.createEmail);
router.put('/:id', emailController.updateEmail);
router.delete('/:id', emailController.deleteEmail);

// export router
module.exports = router;