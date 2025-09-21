import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import SavedItem from "../models/SavedItem.js";
import Cart from "../models/Cart.js";

const router = express.Router();

// Get saved items
router.get("/", authMiddleware, async (req, res) => {
  try {
    let saved = await SavedItem.findOne({ user: req.user.id }).populate("products.product");
    if (!saved) saved = new SavedItem({ user: req.user.id, products: [] });
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Save product for later (move from cart)
router.post("/save", authMiddleware, async (req, res) => {
  try {
    const { productId } = req.body;

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // remove from cart
    const product = cart.products.find((p) => p.product.toString() === productId);
    if (!product) return res.status(404).json({ message: "Product not in cart" });

    cart.products = cart.products.filter((p) => p.product.toString() !== productId);
    await cart.save();

    // add to saved
    let saved = await SavedItem.findOne({ user: req.user.id });
    if (!saved) saved = new SavedItem({ user: req.user.id, products: [] });

    saved.products.push(product);
    await saved.save();

    res.json({ cart, saved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Move product back to cart
router.post("/move-to-cart", authMiddleware, async (req, res) => {
  try {
    const { productId } = req.body;

    let saved = await SavedItem.findOne({ user: req.user.id });
    if (!saved) return res.status(404).json({ message: "Saved list not found" });

    const product = saved.products.find((p) => p.product.toString() === productId);
    if (!product) return res.status(404).json({ message: "Product not in saved list" });

    saved.products = saved.products.filter((p) => p.product.toString() !== productId);
    await saved.save();

    // add to cart
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) cart = new Cart({ user: req.user.id, products: [] });

    cart.products.push(product);
    await cart.save();

    res.json({ cart, saved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
