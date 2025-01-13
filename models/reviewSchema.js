// models/reviewSchema.js
const mongoose = require("mongoose");

// Simplified URL validation for testing
const languageRegex = /^[a-z]{2}(-[A-Z]{2})?$/;

const reviewSchema = new mongoose.Schema(
  {
    placeId: {
      type: String,
      required: true,
      index: true,
    },
    reviewId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    authorName: {
      type: String,
      required: true,
      trim: true,
    },
    authorUrl: {
      type: String,
      trim: true,
    },
    profilePhotoUrl: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot be more than 5"],
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    relativeTimeDescription: {
      type: String,
      trim: true,
    },
    language: {
      type: String,
      match: [
        languageRegex,
        'Please enter a valid language code (e.g., "en" or "en-US")',
      ],
      trim: true,
    },
    time: {
      type: Date,
      default: Date.now,
    },
    likes: {
      type: Number,
      default: 0,
      min: [0, "Likes cannot be negative"],
    },
    isLocalGuide: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
