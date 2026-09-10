const express = require("express");
const { listProducts, getProduct, listCategories, getCategory } = require("../controllers/catalogController");
const { verifyToken } = require("../middlewares/authMiddleware");
const { createReview } = require("../controllers/reviewController");

const router = express.Router();
router.get("/products", listProducts);
router.get("/products/:productId", getProduct);
router.get("/categories", listCategories);
router.get("/categories/:categoryId", getCategory);
router.post(
  "/products/:productId/reviews",
  verifyToken,
  createReview
);

module.exports = router;
