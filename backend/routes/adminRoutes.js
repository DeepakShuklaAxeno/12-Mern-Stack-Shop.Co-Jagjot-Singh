const express = require("express");
const { verifyAdmin } = require("../middlewares/authMiddleware");
const adminController = require("../controllers/adminController");
const multorController = require("../controllers/fileUploadController");
const upload = require('../middlewares/multor.middleware');

const router = express.Router();

router.use(verifyAdmin);

router.get("/dashboard", adminController.dashboard);
router.get("/products", adminController.listProducts);

router.post(
    "/products",
    upload.array("images", 4),
    adminController.createProduct
);

router.patch(
    "/products/:productId",
    upload.array("images", 5),
    adminController.updateProduct
);

router.post(
    "/products/upload",
    upload.array("images", 5),
    multorController.uploadImages
);

router.delete("/products/:productId", adminController.deleteProduct);

router.get("/categories", adminController.listCategories);
router.post("/categories", adminController.createCategory);
router.patch("/categories/:categoryId", adminController.updateCategory);
router.delete("/categories/:categoryId", adminController.deleteCategory);

router.get("/orders", adminController.listOrders);
router.patch(
    "/orders/:orderId/status",
    adminController.updateOrderStatus
);

module.exports = router;
