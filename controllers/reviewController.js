// controllers/reviewController.js
const Review = require("../models/reviewSchema");

// @GET - /reviews - Get all reviews - public
const getAllReviews = async (req, res) => {
  try {
    const { placeId } = req.query;
    const filter = placeId ? { placeId } : {};
    const reviews = await Review.find(filter).sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

// @GET - /reviews/:id - Get review by id - private
const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.status(200).json(review);
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(400).json({ error: "Invalid review ID format" });
    }
    res.status(500).json({ error: "Failed to fetch review" });
  }
};

// @POST - /reviews - Create a new review - private
const createReview = async (req, res) => {
  try {
    // Check if review with same reviewId already exists
    const existingReview = await Review.findOne({
      reviewId: req.body.reviewId,
    });
    if (existingReview) {
      return res
        .status(400)
        .json({ error: "Review with this reviewId already exists" });
    }

    const review = await Review.create(req.body);
    res.status(201).json(review);
  } catch (err) {
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((error) => error.message);
      return res
        .status(400)
        .json({ error: "Validation failed", details: errors });
    }
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ error: "Review with this reviewId already exists" });
    }
    res.status(500).json({ error: "Failed to create review" });
  }
};

// @PUT - /reviews/:id - Update a review - private
const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // If reviewId is being changed, check for uniqueness
    if (req.body.reviewId && req.body.reviewId !== review.reviewId) {
      const existingReview = await Review.findOne({
        reviewId: req.body.reviewId,
      });
      if (existingReview) {
        return res
          .status(400)
          .json({ error: "Review with this reviewId already exists" });
      }
    }

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
        context: "query",
      },
    );
    res.status(200).json(updatedReview);
  } catch (err) {
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((error) => error.message);
      return res
        .status(400)
        .json({ error: "Validation failed", details: errors });
    }
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ error: "Review with this reviewId already exists" });
    }
    if (err.kind === "ObjectId") {
      return res.status(400).json({ error: "Invalid review ID format" });
    }
    res.status(500).json({ error: "Failed to update review" });
  }
};

// @DELETE - /reviews/:id - Delete a review - private
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    await Review.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(400).json({ error: "Invalid review ID format" });
    }
    res.status(500).json({ error: "Failed to delete review" });
  }
};

module.exports = {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
};
