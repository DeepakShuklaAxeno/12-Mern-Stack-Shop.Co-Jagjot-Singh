const express = require("express");
const { verifyToken } = require("../middlewares/authMiddleware");
const { getCart, addToCart, updateCartItem, removeCartItem, clearCart, applyCoupon } = require("../controllers/cartController");

const router = express.Router();
router.use(verifyToken);
router.get("/", getCart);
router.post("/items", addToCart);
router.patch("/items/:itemId", updateCartItem);
router.delete("/items/:itemId", removeCartItem);
router.delete("/", clearCart);
router.post("/coupon", applyCoupon);

module.exports = router;
