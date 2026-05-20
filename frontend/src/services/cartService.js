import api from "./api";

export const cartService = {
  getCart: async () => {
    const response = await api.get("/cart");
    return response.data;
  },

  addToCart: async (bookId, quantity = 1) => {
    const response = await api.post("/cart", { bookId, quantity });
    return response.data;
  },

  updateQuantity: async (bookId, quantity) => {
    const response = await api.put(`/cart/${bookId}`, { quantity });
    return response.data;
  },

  removeFromCart: async (bookId) => {
    const response = await api.delete(`/cart/${bookId}`);
    return response.data;
  },

  clearCart: async () => {
    const response = await api.delete("/cart");
    return response.data;
  },

  getCartCount: async () => {
    try {
      const response = await api.get("/cart");
      const items = response.data.data || [];
      return items.reduce((sum, item) => sum + item.quantity, 0);
    } catch {
      return 0;
    }
  },
};

export default cartService;
