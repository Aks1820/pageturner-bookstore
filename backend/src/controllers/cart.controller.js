const cartService = require("../services/cart.service");

// Get user cart
async function getCart(req, res) {
  try {
    const items = await cartService.getCart(req.user.id);

    return res.status(200).json({
      success: true,
      data: items,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

// Add item to cart
async function addToCart(req, res) {
  try {
    const { bookId, quantity = 1 } = req.body;

    const items = await cartService.addToCart(req.user.id, bookId, quantity);

    return res.status(200).json({
      success: true,
      message: "Added to cart",
      data: items,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

// Update item quantity
async function updateQuantity(req, res) {
  try {
    const { bookId } = req.params;
    const { quantity } = req.body;

    const items = await cartService.updateQuantity(
      req.user.id,
      bookId,
      quantity,
    );

    return res.status(200).json({
      success: true,
      message: "Cart updated",
      data: items,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

// Remove item from cart
async function removeFromCart(req, res) {
  try {
    const { bookId } = req.params;

    const items = await cartService.removeFromCart(req.user.id, bookId);

    return res.status(200).json({
      success: true,
      message: "Item removed",
      data: items,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

// Clear entire cart
async function clearCart(req, res) {
  try {
    await cartService.clearCart(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Cart cleared",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
};
