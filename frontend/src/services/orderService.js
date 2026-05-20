import api from "./api";

const ORDERS_KEY = "pageturner_orders";

export const orderService = {
  // Get all orders
  getOrders: async () => {
    // Temporary localStorage implementation
    await new Promise((resolve) => setTimeout(resolve, 300));

    const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");

    return {
      data: orders.sort((a, b) => new Date(b.date) - new Date(a.date)),
    };
  },

  // Get single order by ID
  getOrderById: async (id) => {
    // Temporary localStorage implementation
    await new Promise((resolve) => setTimeout(resolve, 200));

    const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");

    const order = orders.find((o) => o.id === id);

    if (!order) {
      throw new Error("Order not found");
    }

    return {
      data: order,
    };
  },

  // Create new order
  createOrder: async (orderData) => {
    // Temporary localStorage implementation
    await new Promise((resolve) => setTimeout(resolve, 500));

    const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");

    const newOrder = {
      id: `ORD-${Date.now()}`,

      ...orderData,

      status: "Processing",

      date: new Date().toISOString(),
    };

    orders.push(newOrder);

    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

    // Clear cart after order
    localStorage.removeItem("pageturner_cart");

    return {
      data: newOrder,
    };
  },
};

export default orderService;
