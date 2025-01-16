// routes/margaritaRentalRouter.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/jwtMiddleware");
const margaritaRentalController = require("../controllers/margaritaRentalController");

// Public routes
router.post("/check-availability", margaritaRentalController.checkMachineAvailability);
router.post("/create-payment", margaritaRentalController.createPayment);
router.post("/capture-payment", margaritaRentalController.capturePayment);
router.post("/", margaritaRentalController.createRental);

// Protected routes (admin only)
router.get("/", authMiddleware, margaritaRentalController.getAllRentals);
router.get("/:id", authMiddleware, margaritaRentalController.getRentalById);
router.put("/:id", authMiddleware, margaritaRentalController.updateRentalStatus);

module.exports = router;
