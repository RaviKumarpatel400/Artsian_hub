import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

const router = express.Router();

// Place order (checkout)
router.post("/checkout", authMiddleware, async (req, res) => {
  try {
    const { totalAmount } = req.body;

    let cart = await Cart.findOne({ user: req.user.id }).populate("products.product");
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // create order
    const order = new Order({
      user: req.user.id,
      items: cart.products.map((p) => ({
        product: p.product._id,
        quantity: p.quantity,
      })),
      totalAmount,
    });

    await order.save();

    // clear cart
    cart.products = [];
    await cart.save();

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user orders
router.get("/", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
