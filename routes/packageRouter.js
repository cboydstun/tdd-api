// routes/packageRouter.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/jwtMiddleware");
const packageController = require("../controllers/packageController");

// Public routes
router.get("/", packageController.getAllPackages);
router.get("/:slug", packageController.getPackageBySlug);

// Protected routes (admin only)
router.post("/", authMiddleware, packageController.createPackage);
router.put("/:slug", authMiddleware, packageController.updatePackage);
router.delete("/:slug", authMiddleware, packageController.deletePackage);

module.exports = router;
