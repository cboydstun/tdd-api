const express = require("express");
const router = express.Router();

const leadController = require("../controllers/leadController");

// define routes
router.get("/", leadController.getAllLeads);
router.get("/:id", leadController.getLeadById);
router.post("/", leadController.createLead);
router.put("/:id", leadController.updateLead);
router.delete("/:id", leadController.deleteLead);

// export router
module.exports = router;