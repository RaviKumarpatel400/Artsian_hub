import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Seller from "../models/Seller.js"; // ✅ new model

// SIGNUP controller
export const signup = async (req, res) => {
  try {
    const { name, email, password, role, shopName, gstin } = req.body;

    // check if user/seller already exists in either collection
    const existingUser = await User.findOne({ email });
    const existingSeller = await Seller.findOne({ email });
    if (existingUser || existingSeller) {
      return res.status(400).json({ message: "Account with this email already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    let newAccount;

    if (role === "craftsman") {
      // ✅ create seller
      newAccount = new Seller({
        name,
        email,
        password: hashedPassword,
        shopName,
        gstin,
      });
    } else {
      // ✅ create personal user
      newAccount = new User({
        name,
        email,
        password: hashedPassword,
      });
    }

    await newAccount.save();

    res.status(201).json({ message: "Account registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // look in Users first
    let account = await User.findOne({ email });
    let accountType = "user";

    if (!account) {
      // look in Sellers if not found
      account = await Seller.findOne({ email });
      accountType = "craftsman";
    }

    if (!account) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // compare passwords
    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // create JWT
    const token = jwt.sign(
      { id: account._id, role: accountType }, // ✅ include role
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      token,
      user: {
        _id: account._id,
        name: account.name,
        email: account.email,
        role: accountType,
        ...(accountType === "craftsman"
          ? { shopName: account.shopName, gstin: account.gstin }
          : {}),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
