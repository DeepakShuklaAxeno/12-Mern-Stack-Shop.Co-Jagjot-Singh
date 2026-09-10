const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const validId = (id) => mongoose.isValidObjectId(id);

const loadCart = async (userId) => {
    let cart = await Cart.findOne({ userId }).populate("cartItems.product");
    if (!cart) cart = await Cart.create({ userId, cartItems: [] });
    cart.calculateTotals();
    await cart.save();
    return cart;
};

const getCart = async (req, res) => {
    try {
        return res.status(200).json({ cart: await loadCart(req.user._id) });
    } catch (error) {
        return res.status(500).json({ message: "Unable to fetch cart", error: error.message });
    }
};

const addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1, size, color } = req.body;
        const requestedQuantity = Number(quantity);
        if (!validId(productId) || !Number.isInteger(requestedQuantity) || requestedQuantity < 1) {
            return res.status(400).json({ message: "A valid product and quantity are required" });
        }
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });
        if (product.stockQuantity < requestedQuantity) {
            return res.status(409).json({ message: "Requested quantity is unavailable" });
        }
        let cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) cart = new Cart({ userId: req.user._id, cartItems: [] });
        const item = cart.cartItems.find((entry) =>
            entry.product.toString() === productId && entry.size === size && entry.color === color
        );
        if (item) {
            if (item.quantity + requestedQuantity > product.stockQuantity) {
                return res.status(409).json({ message: "Cart quantity exceeds available stock" });
            }
            item.quantity += requestedQuantity;
        } else {
            cart.cartItems.push({ product: productId, quantity: requestedQuantity, size, color });
        }
        await cart.save();
        return res.status(200).json({ message: "Product added to cart", cart: await loadCart(req.user._id) });
    } catch (error) {
        return res.status(400).json({ message: "Unable to add product to cart", error: error.message });
    }
};

const updateCartItem = async (req, res) => {
    try {
        const { quantity } = req.body;
        const requestedQuantity = Number(quantity);
        if (!Number.isInteger(requestedQuantity) || requestedQuantity < 1) {
            return res.status(400).json({ message: "Quantity must be a positive integer" });
        }
        const cart = await Cart.findOne({ userId: req.user._id });
        const item = cart?.cartItems.id(req.params.itemId);
        if (!item) return res.status(404).json({ message: "Cart item not found" });
        const product = await Product.findById(item.product);
        if (!product) return res.status(404).json({ message: "Product not found" });
        if (requestedQuantity > product.stockQuantity) {
            return res.status(409).json({ message: "Quantity exceeds available stock" });
        }
        item.quantity = requestedQuantity;
        await cart.save();
        return res.status(200).json({ cart: await loadCart(req.user._id) });
    } catch (error) {
        return res.status(400).json({ message: "Unable to update cart", error: error.message });
    }
};

const removeCartItem = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) return res.status(404).json({ message: "Cart not found" });
        const item = cart.cartItems.id(req.params.itemId);
        if (!item) return res.status(404).json({ message: "Cart item not found" });
        item.deleteOne();
        await cart.save();
        return res.status(200).json({ cart: await loadCart(req.user._id) });
    } catch (error) {
        return res.status(400).json({ message: "Unable to remove cart item", error: error.message });
    }
};

const clearCart = async (req, res) => {
    await Cart.findOneAndUpdate({ userId: req.user._id }, { cartItems: [], coupons: [], subtotal: 0, discount: 0, total: 0 }, { upsert: true });
    return res.status(200).json({ message: "Cart cleared", cart: await loadCart(req.user._id) });
};

const applyCoupon = async (req, res) => {
    const code = String(req.body.code || "").trim().toUpperCase();
    const coupons = { WELCOME10: 10, SALE20: 20 };
    if (!coupons[code]) return res.status(400).json({ message: "Invalid coupon" });
    await Cart.findOneAndUpdate(
        { userId: req.user._id },
        { $addToSet: { coupons: { code, discountPercentage: coupons[code] } } },
        { new: true, upsert: true }
    );
    return res.status(200).json({ message: "Coupon applied", cart: await loadCart(req.user._id) });
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart, applyCoupon, loadCart };
