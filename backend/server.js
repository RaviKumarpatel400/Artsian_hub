import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js"; 
import savedRoutes from "./routes/savedRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
// ✅ Import cart routes

dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize express app BEFORE using it
const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:8080", // ✅ Your Vite frontend
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" })); // ✅ handle larger JSON payloads (e.g., images)

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes); 
app.use("/api/saved", savedRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wishlist", wishlistRoutes);

// ✅ Cart routes


// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
