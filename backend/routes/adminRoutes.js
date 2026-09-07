const express = require("express");
const { verifyAdmin } = require("../middlewares/authMiddleware");
const controller = require("../controllers/adminController");

const router = express.Router();
router.use(verifyAdmin);
router.get("/dashboard", controller.dashboard);
router.get("/products", controller.listProducts);
router.post("/products", controller.createProduct);
router.patch("/products/:productId", controller.updateProduct);
router.delete("/products/:productId", controller.deleteProduct);
router.get("/categories", controller.listCategories);
router.post("/categories", controller.createCategory);
router.patch("/categories/:categoryId", controller.updateCategory);
router.delete("/categories/:categoryId", controller.deleteCategory);
router.get("/orders", controller.listOrders);
router.patch("/orders/:orderId/status", controller.updateOrderStatus);

module.exports = router;
