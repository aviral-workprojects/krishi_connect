// server/src/controllers/order.controller.js
const crypto = require("crypto");
const { sequelize, Crop, Order, OrderItem } = require("../models");
const razorpay = require("../utils/payment");

// Helper: calculate total and prepare order items
async function buildOrderFromCart(items) {
  // items: [{ cropId, quantityKg }]
  const crops = await Crop.findAll({ where: { id: items.map(i => i.cropId) } });
  if (crops.length !== items.length) throw new Error("Some crops not found");

  const orderItems = [];
  let totalPaise = 0;

  for (const it of items) {
    const crop = crops.find(c => c.id === it.cropId);
    const qty = parseFloat(it.quantityKg);

    if (isNaN(qty) || qty <= 0) {
      throw new Error(`Invalid quantity for crop ${crop ? crop.name : "unknown"}`);
    }
    if (qty > parseFloat(crop.quantityKg)) {
      throw new Error(`Insufficient stock for crop ${crop.name}`);
    }

    const lineTotalPaise = Math.round(qty * parseFloat(crop.pricePerKg) * 100);

    orderItems.push({
      cropId: crop.id,
      quantityKg: qty,
      pricePerKg: crop.pricePerKg,
      lineTotalPaise,
      farmerId: crop.farmerId, // keep farmer reference
    });

    totalPaise += lineTotalPaise;
  }
  return { orderItems, totalPaise };
}

// ✅ POST /api/orders/create
exports.createOrder = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { items } = req.body; // [{ cropId, quantityKg }]
    if (!Array.isArray(items) || !items.length) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const { orderItems, totalPaise } = await buildOrderFromCart(items);

    // Create Razorpay order
    const rpOrder = await razorpay.orders.create({
      amount: totalPaise,
      currency: "INR",
      receipt: `kb_${Date.now()}`,
      notes: { buyerId: req.user.id.toString() },
    });

    // Persist main order in DB
    const order = await Order.create(
      {
        buyerId: req.user.id,
        farmerId: orderItems[0].farmerId, // TODO: extend later for multi-farmer support
        amount: totalPaise,
        currency: "INR",
        status: "created",
        razorpayOrderId: rpOrder.id,
      },
      { transaction: t }
    );

    // Persist order items
    for (const oi of orderItems) {
      await OrderItem.create({ ...oi, orderId: order.id }, { transaction: t });
    }

    await t.commit();
    res.status(201).json({
      orderId: order.id,
      razorpayOrderId: rpOrder.id,
      currency: "INR",
      amount: totalPaise,
    });
  } catch (e) {
    await t.rollback();
    console.error("Create Order Error:", e.message);
    next(e);
  }
};

// ✅ POST /api/orders/verify
exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing payment fields" });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    const isValid = expected === razorpay_signature;

    const order = await Order.findOne({
      where: { razorpayOrderId: razorpay_order_id },
      include: [{ model: OrderItem, as: "orderItems" }],
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (isValid) {
      order.status = "paid";
      order.razorpayPaymentId = razorpay_payment_id;
      order.razorpaySignature = razorpay_signature;

      // Reduce stock for each crop
      for (const it of order.orderItems) {
        const crop = await Crop.findByPk(it.cropId);
        if (crop) {
          const newQty = parseFloat(crop.quantityKg) - parseFloat(it.quantityKg);
          await crop.update({ quantityKg: newQty < 0 ? 0 : newQty });
        }
      }

      await order.save();
      return res.json({ success: true, message: "Payment verified and order updated" });
    } else {
      order.status = "failed";
      await order.save();
      return res.status(400).json({ success: false, error: "Signature mismatch" });
    }
  } catch (e) {
    console.error("Verify Payment Error:", e.message);
    next(e);
  }
};

// ✅ GET /api/orders/my
exports.myOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      where: { buyerId: req.user.id },
      include: [{ model: OrderItem, as: "orderItems" }],
      order: [["id", "DESC"]],
    });
    res.json(orders);
  } catch (e) {
    console.error("Fetch My Orders Error:", e.message);
    next(e);
  }
};
