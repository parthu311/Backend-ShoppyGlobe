const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { authenticate } = require("../middleware/auth");
const router = express.Router();

// POST /cart - Add product to cart
router.post("/", authenticate, async (req, res) => {
  const { productId, quantity } = req.body;

  // Input validation for quantity
  if (!productId || !quantity || quantity <= 0) {
    return res.status(400).json({ message: "Invalid product ID or quantity." });
  }

  try {
    // Check if the product exists in the database
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the user already has a cart
    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      // If no cart exists, create a new cart
      cart = new Cart({ userId: req.user.id, products: [] });
    }

    // Check if the product already exists in the cart
    const productIndex = cart.products.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (productIndex > -1) {
      // If product exists, update its quantity
      cart.products[productIndex].quantity += quantity;
    } else {
      // If product doesn't exist, add it to the cart
      cart.products.push({ productId, quantity });
    }

    // Save the cart after modifications
    await cart.save();

    // Send back the updated cart
    res.json(cart);
  } catch (err) {
    // Log error to the server console for debugging
    console.error("Error occurred in POST /cart:", err);

    // Detailed error response to the client
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: "Validation error: " + err.message });
    }
    // General server error
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
});

router.put("/:productId", authenticate, async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  // Validate quantity
  if (!quantity || quantity <= 0) {
    return res.status(400).json({ message: "Invalid quantity" });
  }

  try {
    // Find the user's cart
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the product in the cart
    const product = cart.products.find(
      (item) => item.productId.toString() === productId
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found in the cart" });
    }

    // Update the product quantity
    product.quantity = quantity;

    // Save the updated cart
    await cart.save();

    res.json({ message: "Cart updated successfully", cart });
  } catch (err) {
    console.error("Error in updating cart:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.delete("/:productId", authenticate, async (req, res) => {
  const { productId } = req.params;

  try {
    // Find the user's cart
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    // Remove the product from the cart
    const initialLength = cart.products.length;
    cart.products = cart.products.filter(
      (item) => item.productId.toString() !== productId
    );

    if (cart.products.length === initialLength) {
      return res.status(404).json({ message: "Product not found in cart." });
    }

    // Save the updated cart
    await cart.save();

    res.json({ message: "Product removed from cart successfully.", cart });
  } catch (err) {
    console.error("Error in DELETE /cart/:productId:", err);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
