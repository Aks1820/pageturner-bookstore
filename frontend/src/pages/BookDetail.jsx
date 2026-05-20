import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Star, ShoppingCart, Check } from "lucide-react";
import booksService from "../services/booksService";
import { useCart } from "../context/CartContext";

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    loadBook();
  }, [id]);

  const loadBook = async () => {
    try {
      setLoading(true);
      const result = await booksService.getById(id);
      setBook(result.book);
    } catch (err) {
      setError("Book not found");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(book._id, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div className="container">
          <div style={styles.loading}>Loading book details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <div className="container">
          <div style={styles.error}>
            <h2>{error}</h2>
            <Link to="/books" className="btn btn-primary">
              Back to Books
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in" style={styles.page}>
      <div className="container">
        <Link to="/books" style={styles.backLink}>
          <ArrowLeft size={20} />
          Back to Books
        </Link>

        <div style={styles.bookDetail}>
          <div style={styles.bookImage}>
            <img src={book.cover} alt={book.title} style={styles.image} />
          </div>

          <div style={styles.bookInfo}>
            <span style={styles.category}>{book.category}</span>
            <h1 style={styles.title}>{book.title}</h1>
            <p style={styles.author}>by {book.author}</p>

            <div style={styles.rating}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  fill={
                    i < Math.floor(book.rating)
                      ? "var(--success)"
                      : "transparent"
                  }
                  color="var(--success)"
                />
              ))}
              <span style={styles.ratingText}>{book.rating} out of 5</span>
            </div>

            <div style={styles.price}>${book.price.toFixed(2)}</div>

            <p style={styles.description}>{book.description}</p>

            <div style={styles.stock}>
              <span
                style={{
                  ...styles.stockBadge,
                  background:
                    book.stock > 10 ? "var(--success)" : "var(--accent)",
                }}
              >
                {book.stock > 10 ? "In Stock" : `Only ${book.stock} left`}
              </span>
            </div>

            <div style={styles.quantitySection}>
              <label style={styles.quantityLabel}>Quantity:</label>
              <div style={styles.quantityControls}>
                <button
                  style={styles.qtyBtn}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span style={styles.qty}>{quantity}</span>
                <button
                  style={styles.qtyBtn}
                  onClick={() =>
                    setQuantity(Math.min(book.stock, quantity + 1))
                  }
                  disabled={quantity >= book.stock}
                >
                  +
                </button>
              </div>
            </div>

            <button
              className={`btn btn-primary ${added ? "bounce" : ""}`}
              style={styles.addBtn}
              onClick={handleAddToCart}
            >
              {added ? (
                <>
                  <Check size={20} />
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingCart size={20} />
                  Add to Cart
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    padding: "40px 0",
  },
  backLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    color: "var(--text-secondary)",
    marginBottom: "30px",
    transition: "color 0.3s ease",
  },
  loading: {
    textAlign: "center",
    padding: "60px",
    color: "var(--text-secondary)",
  },
  error: {
    textAlign: "center",
    padding: "60px",
  },
  bookDetail: {
    display: "grid",
    gridTemplateColumns: "350px 1fr",
    gap: "50px",
    alignItems: "start",
  },
  bookImage: {
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
  },
  image: {
    width: "100%",
    height: "auto",
    display: "block",
  },
  bookInfo: {
    paddingTop: "20px",
  },
  category: {
    display: "inline-block",
    padding: "6px 12px",
    background: "rgba(233, 69, 96, 0.1)",
    color: "var(--accent)",
    borderRadius: "6px",
    fontSize: "0.85rem",
    fontWeight: "600",
    marginBottom: "16px",
  },
  title: {
    fontSize: "2.5rem",
    lineHeight: 1.2,
    marginBottom: "8px",
  },
  author: {
    fontSize: "1.2rem",
    color: "var(--text-secondary)",
    marginBottom: "16px",
  },
  rating: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    marginBottom: "20px",
  },
  ratingText: {
    marginLeft: "8px",
    color: "var(--text-secondary)",
    fontSize: "0.9rem",
  },
  price: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "var(--accent)",
    marginBottom: "24px",
  },
  description: {
    fontSize: "1.1rem",
    lineHeight: 1.7,
    color: "var(--text-secondary)",
    marginBottom: "24px",
  },
  stock: {
    marginBottom: "24px",
  },
  stockBadge: {
    padding: "8px 16px",
    borderRadius: "6px",
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "white",
  },
  quantitySection: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "24px",
  },
  quantityLabel: {
    fontWeight: "600",
  },
  quantityControls: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "var(--surface)",
    borderRadius: "8px",
    padding: "4px",
  },
  qtyBtn: {
    background: "transparent",
    border: "none",
    color: "var(--text-primary)",
    width: "36px",
    height: "36px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "1.2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  qty: {
    minWidth: "40px",
    textAlign: "center",
    fontSize: "1.1rem",
    fontWeight: "600",
  },
  addBtn: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "16px 32px",
    fontSize: "1.1rem",
  },
};

export default BookDetail;
