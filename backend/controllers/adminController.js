const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const Category = require("../models/Category");

const productFields = (body) => {
    const markedPrice = Number(body.markedPrice);
    const sellingPrice = Number(body.sellingPrice ?? markedPrice);
    return {
        name: body.name,
        description: body.description,
        category: body.category,
        markedPrice,
        sellingPrice,
        discountPercentage: Number(body.discountPercentage ?? Math.max(0, ((markedPrice - sellingPrice) / markedPrice) * 100)),
        stockQuantity: Number(body.stockQuantity ?? 0),
        images: Array.isArray(body.images) ? body.images : [],
        sizeOptions: Array.isArray(body.sizeOptions) ? body.sizeOptions : [],
        colorOptions: Array.isArray(body.colorOptions) ? body.colorOptions : [],
    };
};

const dashboard = async (req, res) => {
    const [products, categories, users, orders, outOfStock, lowStock] = await Promise.all([
        Product.countDocuments(), Category.countDocuments(), User.countDocuments(), Order.countDocuments(),
        Product.countDocuments({ stockQuantity: 0 }), Product.countDocuments({ stockQuantity: { $gt: 0, $lte: 5 } }),
    ]);
    return res.status(200).json({ products, categories, users, orders, outOfStock, lowStock, lowStockThreshold: 5 });
};

const listProducts = async (req, res) => res.status(200).json({ products: await Product.find().populate("category") });

const createProduct = async (req, res) => {
    try {
        const product = await Product.create(productFields(req.body));
        return res.status(201).json({ message: "Product created", product });
    } catch (error) {
        return res.status(400).json({ message: "Unable to create product", error: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.productId)) return res.status(400).json({ message: "Invalid product id" });
        const product = await Product.findByIdAndUpdate(req.params.productId, productFields(req.body), { new: true, runValidators: true }).populate("category");
        if (!product) return res.status(404).json({ message: "Product not found" });
        return res.status(200).json({ message: "Product updated", product });
    } catch (error) {
        return res.status(400).json({ message: "Unable to update product", error: error.message });
    }
};

const deleteProduct = async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    return res.status(200).json({ message: "Product deleted" });
};

const listCategories = async (req, res) => res.status(200).json({ categories: await Category.find().sort({ name: 1 }) });

const createCategory = async (req, res) => {
    try {
        const category = await Category.create({ name: req.body.name, description: req.body.description });
        return res.status(201).json({ message: "Category created", category });
    } catch (error) {
        return res.status(400).json({ message: "Unable to create category", error: error.message });
    }
};

const updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.categoryId, { name: req.body.name, description: req.body.description }, { new: true, runValidators: true });
        if (!category) return res.status(404).json({ message: "Category not found" });
        return res.status(200).json({ message: "Category updated", category });
    } catch (error) {
        return res.status(400).json({ message: "Unable to update category", error: error.message });
    }
};

const deleteCategory = async (req, res) => {
    const productCount = await Product.countDocuments({ category: req.params.categoryId });
    if (productCount) return res.status(409).json({ message: "Move products before deleting this category" });
    const category = await Category.findByIdAndDelete(req.params.categoryId);
    if (!category) return res.status(404).json({ message: "Category not found" });
    return res.status(200).json({ message: "Category deleted" });
};

const listOrders = async (req, res) => res.status(200).json({ orders: await Order.find().sort({ createdAt: -1 }).populate("userId", "name email") });

const updateOrderStatus = async (req, res) => {
    const allowed = ["processing", "shipped", "delivered", "cancelled"];
    if (!allowed.includes(req.body.orderStatus)) return res.status(400).json({ message: "Invalid order status" });
    const order = await Order.findByIdAndUpdate(req.params.orderId, { orderStatus: req.body.orderStatus }, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });
    return res.status(200).json({ message: "Order status updated", order });
};

module.exports = { dashboard, listProducts, createProduct, updateProduct, deleteProduct, listCategories, createCategory, updateCategory, deleteCategory, listOrders, updateOrderStatus };
