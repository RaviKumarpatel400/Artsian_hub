import mongoose from "mongoose";

const SellerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    shopName: { type: String, required: true },
    gstin: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Seller", SellerSchema);
