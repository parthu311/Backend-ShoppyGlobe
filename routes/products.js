const express = require("express");
const Product = require("../models/Product");
const router = express.Router();

// GET /products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /products/:id
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", async (req, res) => {
  const { name, price, description, stock } = req.body;

  if (!name || !price || !stock) {
    return res.status(400).json({ message: "Name, price, and stock are required." });
  }

  try {
    const product = new Product({
      name,
      price,
      description,
      stock,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
