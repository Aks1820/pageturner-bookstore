import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCart } from "../context/CartContext";
import orderService from "../services/orderService";

const Cart = () => {
  const { cartBooks, updateQuantity, removeFromCart, getTotal, loading } =
    useCart();
  const navigate = useNavigate();
  const [checkingOut, setCheckingOut] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleCheckout = async () => {
    if (cartBooks.length === 0) return;

    setCheckingOut(true);
    try {
      await orderService.createOrder({
        items: cartBooks.map((book) => ({
          bookId: book._id,
          title: book.title,
          price: book.price,
          quantity: book.quantity,
        })),
        total: getTotal(),
      });
      setOrderPlaced(true);
      setTimeout(() => {
        navigate("/orders");
      }, 2000);
    } catch (error) {
      console.error("Error placing order:", error);
    } finally {
      setCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div className="container">
          <div style={styles.loading}>Loading cart...</div>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div style={styles.page}>
        <div className="container">
          <div style={styles.successMessage}>
            <ShoppingBag size={64} color="var(--success)" />
            <h2>Order Placed Successfully!</h2>
            <p>Redirecting to your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in" style={styles.page}>
      <div className="container">
        <h1 style={styles.pageTitle}>Shopping Cart</h1>

        {cartBooks.length === 0 ? (
          <div style={styles.emptyCart}>
            <ShoppingBag size={64} color="var(--text-secondary)" />
            <h2>Your cart is empty</h2>
            <p>Add some books to get started!</p>
            <div style={styles.emptyActions}>
              <Link to="/books" className="btn btn-primary">
                Browse Books
              </Link>
              <Link to="/books" style={styles.backLink}>
                <ArrowLeft size={20} />
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <>
            <Link to="/books" style={styles.backLink}>
              <ArrowLeft size={20} />
              Continue Shopping
            </Link>
            <div style={styles.cartContent}>
              <div style={styles.cartItems}>
                {cartBooks.map((book) => (
                  <div key={book._id} className="card" style={styles.cartItem}>
                    <div style={styles.itemImage}>
                      <img
                        src={book.cover}
                        alt={book.title}
                        style={styles.image}
                      />
                    </div>
                    <div style={styles.itemInfo}>
                      <h3 style={styles.itemTitle}>{book.title}</h3>
                      <p style={styles.itemAuthor}>{book.author}</p>
                      <span style={styles.itemPrice}>
                        ${book.price.toFixed(2)}
                      </span>
                    </div>
                    <div style={styles.itemActions}>
                      <div style={styles.quantityControls}>
                        <button
                          style={styles.qtyBtn}
                          onClick={() =>
                            updateQuantity(book._id, book.quantity - 1)
                          }
                          disabled={book.quantity <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        <span style={styles.qty}>{book.quantity}</span>
                        <button
                          style={styles.qtyBtn}
                          onClick={() =>
                            updateQuantity(book._id, book.quantity + 1)
                          }
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <button
                        style={styles.removeBtn}
                        onClick={() => removeFromCart(book._id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div style={styles.itemTotal}>
                      ${(book.price * book.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div style={styles.cartSummary}>
                <h2 style={styles.summaryTitle}>Order Summary</h2>
                <div style={styles.summaryRow}>
                  <span>
                    Subtotal ({cartBooks.reduce((s, i) => s + i.quantity, 0)}{" "}
                    items)
                  </span>
                  <span>${getTotal().toFixed(2)}</span>
                </div>
                <div style={styles.summaryRow}>
                  <span>Shipping</span>
                  <span style={styles.freeShipping}>FREE</span>
                </div>
                <div style={styles.divider}></div>
                <div style={styles.summaryTotal}>
                  <span>Total</span>
                  <span>${getTotal().toFixed(2)}</span>
                </div>
                <button
                  className="btn btn-primary"
                  style={styles.checkoutBtn}
                  onClick={handleCheckout}
                  disabled={checkingOut}
                >
                  {checkingOut ? "Processing..." : "Proceed to Checkout"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: {
    padding: "40px 0",
    minHeight: "60vh",
  },
  pageTitle: {
    fontSize: "2.5rem",
    marginBottom: "30px",
  },
  backLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    color: "var(--text-secondary)",
    marginBottom: "20px",
    transition: "color 0.3s ease",
  },
  loading: {
    textAlign: "center",
    padding: "60px",
    color: "var(--text-secondary)",
  },
  emptyCart: {
    textAlign: "center",
    padding: "60px",
    background: "var(--surface)",
    borderRadius: "12px",
  },
  emptyActions: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
    marginTop: "24px",
  },
  successMessage: {
    textAlign: "center",
    padding: "80px 20px",
    background: "var(--surface)",
    borderRadius: "12px",
  },
  cartContent: {
    display: "grid",
    gridTemplateColumns: "1fr 350px",
    gap: "30px",
    alignItems: "start",
  },
  cartItems: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  cartItem: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    padding: "20px",
  },
  itemImage: {
    width: "80px",
    height: "100px",
    borderRadius: "8px",
    overflow: "hidden",
    flexShrink: 0,
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: "1.1rem",
    marginBottom: "4px",
  },
  itemAuthor: {
    fontSize: "0.9rem",
    color: "var(--text-secondary)",
    marginBottom: "8px",
  },
  itemPrice: {
    fontSize: "1rem",
    color: "var(--text-secondary)",
  },
  itemActions: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  quantityControls: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "var(--primary)",
    borderRadius: "8px",
    padding: "4px",
  },
  qtyBtn: {
    background: "transparent",
    border: "none",
    color: "var(--text-primary)",
    padding: "8px",
    borderRadius: "4px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  qty: {
    minWidth: "30px",
    textAlign: "center",
    fontWeight: "600",
  },
  removeBtn: {
    background: "transparent",
    border: "none",
    color: "var(--accent)",
    cursor: "pointer",
    padding: "8px",
  },
  itemTotal: {
    fontSize: "1.2rem",
    fontWeight: "700",
    color: "var(--accent)",
    minWidth: "80px",
    textAlign: "right",
  },
  cartSummary: {
    background: "var(--surface)",
    borderRadius: "12px",
    padding: "24px",
    border: "1px solid var(--border)",
    position: "sticky",
    top: "100px",
  },
  summaryTitle: {
    fontSize: "1.3rem",
    marginBottom: "20px",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "12px",
    color: "var(--text-secondary)",
  },
  freeShipping: {
    color: "var(--success)",
  },
  divider: {
    height: "1px",
    background: "var(--border)",
    margin: "16px 0",
  },
  summaryTotal: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "1.3rem",
    fontWeight: "700",
    marginBottom: "20px",
  },
  checkoutBtn: {
    width: "100%",
  },
};

export default Cart;
