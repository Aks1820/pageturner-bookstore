import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";
import booksService from "../services/booksService";

const Home = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const categories = ["Fiction", "Self-Help", "Sci-Fi", "Finance", "Thriller"];

  useEffect(() => {
    loadFeaturedBooks();
  }, []);

  const loadFeaturedBooks = async () => {
    try {
      const result = await booksService.getAll({ limit: 4 });
      setFeaturedBooks(result.books);
    } catch (error) {
      console.error("Error loading featured books:", error);
    }
  };

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section style={styles.hero}>
        <div className="container" style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Discover Your Next
            <br />
            <span style={styles.heroAccent}>Great Read</span>
          </h1>
          <p style={styles.heroSubtitle}>
            Explore thousands of books across every genre. Your perfect book is
            just a click away.
          </p>
          <Link to="/books" className="btn btn-primary" style={styles.heroBtn}>
            Browse Books <ArrowRight size={18} style={{ marginLeft: "8px" }} />
          </Link>
        </div>
        <div style={styles.heroPattern}></div>
      </section>

      {/* Categories */}
      <section style={styles.section}>
        <div className="container">
          <h2 style={styles.sectionTitle}>Browse by Category</h2>
          <div style={styles.categories}>
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/books?category=${cat}`}
                style={styles.categoryCard}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section style={styles.section}>
        <div className="container">
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Featured Books</h2>
            <Link to="/books" style={styles.viewAll}>
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div style={styles.booksGrid}>
            {featuredBooks.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.cta}>
        <div className="container" style={styles.ctaContent}>
          <h2 style={styles.ctaTitle}>Start Your Reading Journey Today</h2>
          <p style={styles.ctaText}>
            Join thousands of book lovers who have found their next favorite
            read.
          </p>
          <Link to="/books" className="btn btn-primary">
            Explore Now
          </Link>
        </div>
      </section>
    </div>
  );
};

const BookCard = ({ book }) => {
  return (
    <Link to={`/books/${book._id}`} className="card" style={styles.bookCard}>
      <div style={styles.bookCover}>
        <img src={book.cover} alt={book.title} style={styles.bookImage} />
      </div>
      <div style={styles.bookInfo}>
        <h3 style={styles.bookTitle}>{book.title}</h3>
        <p style={styles.bookAuthor}>{book.author}</p>
        <div style={styles.bookMeta}>
          <span style={styles.bookPrice}>${book.price.toFixed(2)}</span>
          <span style={styles.bookRating}>
            <Star size={14} fill="var(--success)" color="var(--success)" />
            {book.rating}
          </span>
        </div>
      </div>
    </Link>
  );
};

const styles = {
  hero: {
    padding: "80px 0",
    position: "relative",
    overflow: "hidden",
    background:
      "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
  },
  heroContent: {
    position: "relative",
    zIndex: 1,
  },
  heroTitle: {
    fontSize: "3.5rem",
    lineHeight: 1.2,
    marginBottom: "20px",
  },
  heroAccent: {
    color: "var(--accent)",
  },
  heroSubtitle: {
    fontSize: "1.25rem",
    color: "var(--text-secondary)",
    maxWidth: "500px",
    marginBottom: "30px",
  },
  heroBtn: {
    display: "inline-flex",
    alignItems: "center",
  },
  heroPattern: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "50%",
    height: "100%",
    background:
      "radial-gradient(circle at 70% 50%, var(--accent) 0%, transparent 50%)",
    opacity: 0.1,
  },
  section: {
    padding: "60px 0",
  },
  sectionTitle: {
    fontSize: "2rem",
    marginBottom: "30px",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },
  viewAll: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "var(--accent)",
    fontWeight: "500",
  },
  categories: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "16px",
  },
  categoryCard: {
    padding: "24px",
    background: "var(--surface)",
    borderRadius: "12px",
    border: "1px solid var(--border)",
    textAlign: "center",
    fontWeight: "600",
    transition: "all 0.3s ease",
    ":hover": {
      background: "var(--accent)",
      color: "white",
    },
  },
  booksGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "24px",
  },
  bookCard: {
    display: "block",
    textDecoration: "none",
  },
  bookCover: {
    height: "200px",
    overflow: "hidden",
  },
  bookImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  bookInfo: {
    padding: "16px",
  },
  bookTitle: {
    fontSize: "1.1rem",
    marginBottom: "4px",
    color: "var(--text-primary)",
  },
  bookAuthor: {
    fontSize: "0.9rem",
    color: "var(--text-secondary)",
    marginBottom: "12px",
  },
  bookMeta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bookPrice: {
    fontSize: "1.2rem",
    fontWeight: "700",
    color: "var(--accent)",
  },
  bookRating: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "0.9rem",
    color: "var(--text-secondary)",
  },
  cta: {
    padding: "80px 0",
    background: "var(--surface)",
    textAlign: "center",
  },
  ctaContent: {
    maxWidth: "600px",
    margin: "0 auto",
  },
  ctaTitle: {
    fontSize: "2.5rem",
    marginBottom: "16px",
  },
  ctaText: {
    fontSize: "1.1rem",
    color: "var(--text-secondary)",
    marginBottom: "30px",
  },
};

export default Home;
