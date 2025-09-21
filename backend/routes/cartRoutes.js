import express from "express";
import Cart from "../models/Cart.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// 👉 Add item to cart
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, products: [] });
    }

    const existingItem = cart.products.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await cart.save();

    res.status(200).json({ message: "Product added to cart", cart });
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 👉 Get cart for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("products.product");
    res.status(200).json(cart || { user: req.user.id, products: [] });
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 👉 Update item quantity
router.put("/update", authMiddleware, async (req, res) => {
  try {
    const { productId, type } = req.body;
    const userId = req.user.id;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.products.find(
      (p) => p.product.toString() === productId
    );
    if (!item) return res.status(404).json({ message: "Product not in cart" });

    if (type === "inc") {
      item.quantity += 1;
    } else if (type === "dec" && item.quantity > 1) {
      item.quantity -= 1;
    }

    await cart.save();
    cart = await cart.populate("products.product"); // ✅ re-populate
    res.status(200).json(cart);
  } catch (err) {
    console.error("Error updating quantity:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 👉 Remove item from cart
router.delete("/remove", authMiddleware, async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.products = cart.products.filter(
      (p) => p.product.toString() !== productId
    );

    await cart.save();
    cart = await cart.populate("products.product");
    res.status(200).json(cart);
  } catch (err) {
    console.error("Error removing from cart:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 👉 Clear entire cart
router.delete("/clear", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    let cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.products = [];
    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    console.error("Error clearing cart:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// 👉 Add item to cart - FIXED
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user.id;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, products: [] });
    }

    const existingItem = cart.products.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    await cart.save();
    
    // ✅ CRITICAL: Populate before sending response
    const populatedCart = await Cart.findOne({ user: userId }).populate("products.product");
    
    res.status(200).json({ 
      message: "Product added to cart", 
      user: populatedCart.user,
      products: populatedCart.products // ✅ This is what frontend expects
    });
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 👉 Get cart - FIXED  
router.get("/", authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("products.product");
    
    if (!cart) {
      return res.status(200).json({ user: req.user.id, products: [] });
    }
    
    // ✅ Filter out null products (deleted products)
    const validProducts = cart.products.filter(item => item.product !== null);
    
    res.status(200).json({
      user: cart.user,
      products: validProducts
    });
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
