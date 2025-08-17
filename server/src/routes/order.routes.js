const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/order.controller");
const auth = require("../middlewares/auth");

// Buyer routes
router.post("/create", auth(['buyer']), ctrl.createOrder);
router.post("/verify", auth(['buyer']), ctrl.verifyPayment);
router.get("/my", auth(['buyer']), ctrl.myOrders);

module.exports = router;
