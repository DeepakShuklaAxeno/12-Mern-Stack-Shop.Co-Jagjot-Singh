const express = require("express");
const { listProducts, getProduct, listCategories, getCategory } = require("../controllers/catalogController");

const router = express.Router();
router.get("/products", listProducts);
router.get("/products/:productId", getProduct);
router.get("/categories", listCategories);
router.get("/categories/:categoryId", getCategory);

module.exports = router;
