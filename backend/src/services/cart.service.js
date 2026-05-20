const Cart = require("../models/cart.model");

// Get user cart
async function getCart(userId) {
  const cart = await Cart.findOne({
    userId,
  }).populate("items.bookId");

  if (!cart) {
    return [];
  }

  return cart.items.map((item) => ({
    bookId: item.bookId._id,
    quantity: item.quantity,
  }));
}

// Add item to cart
async function addToCart(userId, bookId, quantity = 1) {
  let cart = await Cart.findOne({
    userId,
  });

  // Create cart if it doesn't exist
  if (!cart) {
    cart = new Cart({
      userId,
      items: [],
    });
  }

  // Check if item already exists
  const existingItem = cart.items.find(
    (item) => item.bookId.toString() === bookId,
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      bookId,
      quantity,
    });
  }

  await cart.save();

  return cart.items;
}

// Update item quantity
async function updateQuantity(userId, bookId, quantity) {
  const cart = await Cart.findOne({
    userId,
  });

  if (!cart) {
    throw new Error("Cart not found");
  }

  const item = cart.items.find((item) => item.bookId.toString() === bookId);

  if (!item) {
    throw new Error("Item not found in cart");
  }

  // Remove item if quantity is 0
  if (quantity <= 0) {
    cart.items = cart.items.filter((item) => item.bookId.toString() !== bookId);
  } else {
    item.quantity = quantity;
  }

  await cart.save();

  return cart.items;
}

// Remove item from cart
async function removeFromCart(userId, bookId) {
  const cart = await Cart.findOne({
    userId,
  });

  if (!cart) {
    throw new Error("Cart not found");
  }

  cart.items = cart.items.filter((item) => item.bookId.toString() !== bookId);

  await cart.save();

  return cart.items;
}

// Clear entire cart
async function clearCart(userId) {
  const cart = await Cart.findOne({
    userId,
  });

  if (!cart) {
    return [];
  }

  cart.items = [];

  await cart.save();

  return [];
}

// Get cart with full book details
async function getCartWithBooks(userId) {
  const cart = await Cart.findOne({
    userId,
  }).populate("items.bookId");

  if (!cart) {
    return [];
  }

  return cart.items
    .filter((item) => item.bookId)
    .map((item) => ({
      ...item.bookId.toObject(),
      quantity: item.quantity,
    }));
}

module.exports = {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  getCartWithBooks,
};
