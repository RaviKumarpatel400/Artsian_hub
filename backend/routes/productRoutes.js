import express from "express";
import Product from "../models/Product.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ CATEGORIES ROUTE - Must come BEFORE /:id route
router.get("/categories", async (req, res) => {
  try {
    const categories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          name: '$_id',
          count: 1,
          _id: 0
        }
      },
      {
        $sort: { name: 1 }
      }
    ]);

    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 👉 Add a new product (Craftsman only)
router.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "craftsman") {
      return res.status(403).json({ message: "Only craftsmen can add products" });
    }

    const { name, price, category, artisan, image, description } = req.body;

    const product = new Product({
      name,
      price,
      category,
      artisan,
      image,
      description,
    });

    await product.save();

    res.status(201).json({ message: "Product added successfully", product });
  } catch (err) {
    console.error("Error saving product:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 👉 Get all products with optional category filtering (Marketplace page)
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    
    let filter = {};
    if (category) {
      // Case-insensitive category filtering
      filter.category = { $regex: new RegExp(category, 'i') };
    }

    const products = await Product.find(filter).sort({ createdAt: -1 }); // newest first
    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 👉 Get single product by ID - Must come AFTER specific routes
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // ✅ Validate ObjectId format to prevent casting errors
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.status(200).json(product);
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Add this route to your productRoutes.js file
// ✅ Similar Products Route - Add this BEFORE the /:id route
router.get('/product/:id/similar', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }

    // Find the current product
    const currentProduct = await Product.findById(id);
    if (!currentProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Find similar products based on category, excluding current product
    const similarProducts = await Product.find({
      category: currentProduct.category,
      _id: { $ne: currentProduct._id } // Exclude current product
    })
    .limit(8) // Limit to 8 similar products
    .sort({ createdAt: -1 }) // Get newest first
    .select('name price category image artisan description'); // Select only needed fields

    res.status(200).json(similarProducts);
  } catch (error) {
    console.error('Error fetching similar products:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
