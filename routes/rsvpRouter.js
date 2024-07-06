const express = require("express");
const router = express.Router();

const rsvpController = require("../controllers/rsvpController");

// define data routes
router.post('/', rsvpController.createRSVP);

// export router
module.exports = router;