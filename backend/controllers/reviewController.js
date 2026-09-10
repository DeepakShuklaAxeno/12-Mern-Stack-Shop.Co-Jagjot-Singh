const mongoose = require("mongoose");
const Product = require("../models/Product");

const createReview = async (req, res) => {
  try {
    const { rating, reviewText } = req.body;
    const numericRating = Number(rating);
    const text = String(reviewText || "").trim();

    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    if (text.length < 5 || text.length > 500) {
      return res.status(400).json({
        message: "Review must be between 5 and 500 characters",
      });
    }

    if (!mongoose.isValidObjectId(req.params.productId)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const existingReview = product.reviews.find(
      (review) => review.userId.toString() === req.user._id.toString()
    );

    if (existingReview) {
      return res.status(409).json({
        message: "You have already reviewed this product",
      });
    }

    product.reviews.push({
      userId: req.user._id,
      rating: numericRating,
      reviewText: text,
    });

    product.rating =
      product.reviews.reduce((sum, review) => sum + review.rating, 0) /
      product.reviews.length;

    await product.save();

    const updatedProduct = await Product.findById(product._id)
      .populate("reviews.userId", "name")
      .populate("category", "name description");

    return res.status(201).json({
      message: "Review submitted successfully",
      product: updatedProduct,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Unable to submit review",
      error: error.message,
    });
  }
};

module.exports = { createReview };