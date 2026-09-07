const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");

const checkout = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        const { shippingAddress, paymentMethod = "credit_card" } = req.body;
        if (!shippingAddress || !Object.values(shippingAddress).every(Boolean)) {
            return res.status(400).json({ message: "Complete shipping information is required" });
        }
        const cart = await Cart.findOne({ userId: req.user._id }).populate("cartItems.product");
        if (!cart || cart.cartItems.length === 0) return res.status(400).json({ message: "Cart is empty" });
        await session.startTransaction();

        const orderItems = [];
        let subtotal = 0;
        for (const item of cart.cartItems) {
            const product = await Product.findById(item.product._id).session(session);
            if (!product) throw new Error(`Product ${item.product._id} no longer exists`);
            if (product.stockQuantity < item.quantity) {
                const error = new Error(`${product.name} does not have enough stock`);
                error.status = 409;
                throw error;
            }
            const price = product.sellingPrice;
            subtotal += price * item.quantity;
            orderItems.push({
                product: product._id,
                name: product.name,
                price,
                quantity: item.quantity,
                size: item.size,
                color: item.color,
            });
            product.stockQuantity -= item.quantity;
            await product.save({ session });
        }
        const discount = Math.min(subtotal, cart.coupons.reduce(
            (total, coupon) => total + subtotal * coupon.discountPercentage / 100, 0
        ));
        const totalAmount = subtotal - discount;
        let order;
        [order] = await Order.create([{
            userId: req.user._id,
            orderItems,
            shippingAddress,
            paymentMethod,
            subtotal,
            discount,
            totalAmount,
        }], { session });
        await Cart.deleteOne({ userId: req.user._id }).session(session);
        await session.commitTransaction();
        return res.status(201).json({ message: "Order created successfully", order });
    } catch (error) {
        if (session.inTransaction()) await session.abortTransaction();
        return res.status(error.status || 400).json({ message: "Checkout failed", error: error.message });
    } finally {
        await session.endSession();
    }
};

const listMyOrders = async (req, res) => {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 }).populate("orderItems.product", "name images");
    return res.status(200).json({ orders });
};

const getMyOrder = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.orderId)) return res.status(400).json({ message: "Invalid order id" });
    const order = await Order.findOne({ _id: req.params.orderId, userId: req.user._id }).populate("orderItems.product", "name images");
    if (!order) return res.status(404).json({ message: "Order not found" });
    return res.status(200).json({ order });
};

module.exports = { checkout, listMyOrders, getMyOrder };
