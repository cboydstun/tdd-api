const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/jwtMiddleware");

const leadController = require("../controllers/leadController");

// define routes
router.get("/", authMiddleware, leadController.getAllLeads);
router.get("/:id", authMiddleware, leadController.getLeadById);
router.post("/", leadController.createLead); // PUBLIC
router.put("/:id", authMiddleware, leadController.updateLead);
router.delete("/:id", authMiddleware, leadController.deleteLead);

// export router
module.exports = router;