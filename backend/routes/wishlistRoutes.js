import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Wishlist from "../models/Wishlist.js";

const router = express.Router();

// Get wishlist
router.get("/", authMiddleware, async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id }).populate("products.product");
    if (!wishlist) wishlist = new Wishlist({ user: req.user.id, products: [] });
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add to wishlist
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) wishlist = new Wishlist({ user: req.user.id, products: [] });

    if (wishlist.products.some(p => p.product.toString() === productId)) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    wishlist.products.push({ product: productId });
    await wishlist.save();
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Remove from wishlist
router.delete("/remove", authMiddleware, async (req, res) => {
  try {
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) return res.status(404).json({ message: "Wishlist not found" });

    wishlist.products = wishlist.products.filter(
      (p) => p.product.toString() !== productId
    );
    await wishlist.save();
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
