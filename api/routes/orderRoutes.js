const express = require("express");
const { createOrders, getOrders } = require("../controllers/orderControllers");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/").post(protect, createOrders).get(protect, getOrders);

module.exports = router;
