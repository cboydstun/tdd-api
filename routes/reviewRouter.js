// routes/reviewRouter.js
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/jwtMiddleware");

const reviewController = require("../controllers/reviewController");

// define data routes
router.get('/', reviewController.getAllReviews);
router.get('/:id', authMiddleware, reviewController.getReviewById);
router.post('/', authMiddleware, reviewController.createReview);
router.put('/:id', authMiddleware, reviewController.updateReview);
router.delete('/:id', authMiddleware, reviewController.deleteReview);

// export router
module.exports = router;