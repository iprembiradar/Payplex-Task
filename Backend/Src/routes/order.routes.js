const express = require("express");
const router = express.Router();

const {
  placeOrder,
  getAllOrders,
  getUserOrders,
  getSingleOrder,
  updateOrderStatus,
  cancelOrder
} = require("../controllers/order.controller");

router.post("/place", placeOrder);

router.get("/", getAllOrders);
router.get("/user/:userId", getUserOrders);
router.get("/:id", getSingleOrder);


router.put("/:id/status", updateOrderStatus);
router.put("/:id/cancel", cancelOrder);


module.exports = router;