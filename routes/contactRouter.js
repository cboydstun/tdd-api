const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/jwtMiddleware");

const contactController = require("../controllers/contactController");

// define data routes
router.get('/', authMiddleware, contactController.getAllContacts);
router.get('/:id', authMiddleware, contactController.getContactById);
router.post('/', contactController.createContact); // PUBLIC
router.put('/:id', authMiddleware, contactController.updateContact);
router.delete('/:id', authMiddleware, contactController.deleteContact);

// export router
module.exports = router;