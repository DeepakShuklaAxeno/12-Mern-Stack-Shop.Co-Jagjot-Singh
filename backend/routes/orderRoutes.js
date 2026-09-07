const express = require("express");
const { verifyToken } = require("../middlewares/authMiddleware");
const { checkout, listMyOrders, getMyOrder } = require("../controllers/orderController");

const router = express.Router();
router.use(verifyToken);
router.post("/checkout", checkout);
router.get("/", listMyOrders);
router.get("/:orderId", getMyOrder);

module.exports = router;
