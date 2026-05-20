const express = require("express");

const router = express.Router();

const { authMiddleware } = require("../middlewares/auth.middleware");

const {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
} = require("../controllers/cart.controller");

// Cart routes
router.get("/", authMiddleware, getCart);

router.post("/", authMiddleware, addToCart);

router.put("/:bookId", authMiddleware, updateQuantity);

router.delete("/:bookId", authMiddleware, removeFromCart);

router.delete("/", authMiddleware, clearCart);

module.exports = router;
