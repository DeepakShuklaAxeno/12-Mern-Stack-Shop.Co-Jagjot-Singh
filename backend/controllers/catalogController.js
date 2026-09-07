const mongoose = require("mongoose");
const Product = require("../models/Product");
const Category = require("../models/Category");

const parseNumber = (value, fallback) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
};

const listProducts = async (req, res) => {
    try {
        const page = Math.max(1, parseNumber(req.query.page, 1));
        const limit = Math.min(50, Math.max(1, parseNumber(req.query.limit, 12)));
        const filter = {};
        const search = String(req.query.search || "").trim();

        if (search) filter.$text = { $search: search };
        if (req.query.category) {
            if (!mongoose.isValidObjectId(req.query.category)) {
                return res.status(400).json({ message: "Invalid category" });
            }
            filter.category = req.query.category;
        }
        const minPrice = parseNumber(req.query.minPrice, null);
        const maxPrice = parseNumber(req.query.maxPrice, null);
        if (minPrice !== null || maxPrice !== null) {
            filter.sellingPrice = {};
            if (minPrice !== null) filter.sellingPrice.$gte = Math.max(0, minPrice);
            if (maxPrice !== null) filter.sellingPrice.$lte = Math.max(0, maxPrice);
        }
        if (req.query.availability === "in-stock") filter.stockQuantity = { $gt: 0 };
        if (req.query.availability === "out-of-stock") filter.stockQuantity = 0;
        if (req.query.color) filter.colorOptions = req.query.color;
        if (req.query.size) filter.sizeOptions = req.query.size;

        const sortMap = {
            "price-asc": { sellingPrice: 1 },
            "price-desc": { sellingPrice: -1 },
            newest: { createdAt: -1 },
            name: { name: 1 },
        };
        const sort = sortMap[req.query.sort] || { createdAt: -1 };
        const [products, total] = await Promise.all([
            Product.find(filter)
                .populate("category", "name description")
                .sort(sort)
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            Product.countDocuments(filter),
        ]);

        return res.status(200).json({
            products,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error) {
        return res.status(500).json({ message: "Unable to fetch products", error: error.message });
    }
};

const getProduct = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.productId)) {
            return res.status(400).json({ message: "Invalid product id" });
        }
        const product = await Product.findById(req.params.productId).populate("category", "name description");
        if (!product) return res.status(404).json({ message: "Product not found" });
        return res.status(200).json({ product });
    } catch (error) {
        return res.status(500).json({ message: "Unable to fetch product", error: error.message });
    }
};

const listCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 }).lean();
        return res.status(200).json({ categories });
    } catch (error) {
        return res.status(500).json({ message: "Unable to fetch categories", error: error.message });
    }
};

const getCategory = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.categoryId)) {
            return res.status(400).json({ message: "Invalid category id" });
        }
        const category = await Category.findById(req.params.categoryId);
        if (!category) return res.status(404).json({ message: "Category not found" });
        return res.status(200).json({ category });
    } catch (error) {
        return res.status(500).json({ message: "Unable to fetch category", error: error.message });
    }
};

module.exports = { listProducts, getProduct, listCategories, getCategory };
