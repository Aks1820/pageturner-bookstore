import { createContext, useContext, useState, useEffect } from "react";
import cartService from "../services/cartService";
import booksService from "../services/booksService";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();

  const [cartItems, setCartItems] = useState([]);
  const [cartBooks, setCartBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      setCartItems([]);
      setCartBooks([]);
      setLoading(false);
    }
  }, [user]);

  const loadCart = async () => {
    try {
      setLoading(true);

      const response = await cartService.getCart();

      const items = response.data || [];

      setCartItems(items);

      if (items.length > 0) {
        const result = await booksService.getAll({ limit: 100 });

        const allBooks = result.books || [];

        const cartBooksData = items
          .map((item) => {
            const book = allBooks.find((b) => b._id === item.bookId);

            return book
              ? {
                  ...book,
                  quantity: item.quantity,
                }
              : null;
          })
          .filter((b) => b !== null);

        setCartBooks(cartBooksData);
      } else {
        setCartBooks([]);
      }
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error("Error loading cart:", error);
      }

      setCartItems([]);
      setCartBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (bookId, quantity = 1) => {
    try {
      await cartService.addToCart(bookId, quantity);
      await loadCart();
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const updateQuantity = async (bookId, quantity) => {
    try {
      await cartService.updateQuantity(bookId, quantity);
      await loadCart();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const removeFromCart = async (bookId) => {
    try {
      await cartService.removeFromCart(bookId);
      await loadCart();
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();

      setCartItems([]);
      setCartBooks([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const getTotal = () => {
    return cartBooks.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getItemCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartBooks,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getTotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
