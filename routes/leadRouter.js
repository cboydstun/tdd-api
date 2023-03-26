const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/jwtMiddleware");

const leadController = require("../controllers/leadController");

// define routes
router.get("/", authMiddleware, leadController.getAllLeads);
router.get("/:id", authMiddleware, authMiddleware, leadController.getLeadById);
router.post("/", leadController.createLead); // PUBLIC
router.put("/:id", authMiddleware, leadController.updateLead);
router.delete("/:id", authMiddleware, leadController.deleteLead);
router.get("/size/:size", authMiddleware, leadController.getLeadsBySize);
router.get("/date/:date", authMiddleware, leadController.getLeadsByDate);
router.get("/sizedate/:size", authMiddleware, leadController.getLeadsBySizeAndDate);
router.get("/available/:size", leadController.checkLeadsAvailability); // PUBLIC

// export router
module.exports = router;