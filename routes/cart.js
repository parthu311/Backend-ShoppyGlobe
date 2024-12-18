const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { authenticate } = require("../middleware/auth");
const router = express.Router();

// POST /cart
router.post("/", authenticate, async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new Cart({ userId: req.user.id, products: [] });
    }

    cart.products.push({ productId, quantity });
    await cart.save();

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
