import { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";

import { Search, Star, Filter, ChevronLeft, ChevronRight } from "lucide-react";

import booksService from "../services/booksService";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Books = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [category, setCategory] = useState(
    searchParams.get("category") || "All",
  );

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { addToCart } = useCart();

  const { user } = useAuth();

  const isAdmin = user?.role === "admin";

  const categories = [
    "All",
    "Fiction",
    "Self-Help",
    "Sci-Fi",
    "Finance",
    "Memoir",
    "Thriller",
    "History",
  ];

  const limit = 12;

  useEffect(() => {
    loadBooks();
  }, [category, page]);

  const loadBooks = async () => {
    try {
      setLoading(true);

      const params = { page, limit };

      if (category !== "All") {
        params.category = category;
      }

      if (search) {
        params.search = search;
      }

      const result = await booksService.getAll(params);

      setBooks(result.books);
      setTotalPages(result.totalPages || 1);
    } catch (error) {
      console.error("Error loading books:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    setPage(1);

    if (search.trim()) {
      try {
        setLoading(true);

        const result = await booksService.getAll({
          search,
          page: 1,
          limit,
        });

        setBooks(result.books);
        setTotalPages(result.totalPages || 1);
      } catch (error) {
        console.error("Error searching books:", error);
      } finally {
        setLoading(false);
      }
    } else {
      loadBooks();
    }
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setSearch("");
    setPage(1);

    if (cat === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this book?");

    if (!confirmed) return;

    try {
      await booksService.delete(id);

      loadBooks();
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];

    const showEllipsisStart = totalPages > 7 && page > 3;

    const showEllipsisEnd = totalPages > 7 && page < totalPages - 2;

    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
        style={{
          ...styles.pageBtn,
          opacity: page === 1 ? 0.5 : 1,
          cursor: page === 1 ? "not-allowed" : "pointer",
        }}
      >
        <ChevronLeft size={18} />
      </button>,
    );

    if (!showEllipsisStart) {
      for (let i = 1; i <= Math.min(5, totalPages); i++) {
        pages.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            style={{
              ...styles.pageBtn,
              ...(page === i ? styles.pageBtnActive : {}),
            }}
          >
            {i}
          </button>,
        );
      }
    } else {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          style={{
            ...styles.pageBtn,
            ...(page === 1 ? styles.pageBtnActive : {}),
          }}
        >
          1
        </button>,
      );

      if (page > 3) {
        pages.push(
          <span key="ellipsis1" style={styles.ellipsis}>
            ...
          </span>,
        );
      }

      for (
        let i = Math.max(2, page - 1);
        i <= Math.min(page + 1, totalPages - 1);
        i++
      ) {
        pages.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            style={{
              ...styles.pageBtn,
              ...(page === i ? styles.pageBtnActive : {}),
            }}
          >
            {i}
          </button>,
        );
      }

      if (page < totalPages - 2) {
        pages.push(
          <span key="ellipsis2" style={styles.ellipsis}>
            ...
          </span>,
        );
      }
    }

    if (!showEllipsisEnd && totalPages > 5) {
      for (let i = Math.max(6, page + 2); i <= totalPages; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            style={{
              ...styles.pageBtn,
              ...(page === i ? styles.pageBtnActive : {}),
            }}
          >
            {i}
          </button>,
        );
      }
    }

    if (showEllipsisEnd && totalPages > 5) {
      pages.push(
        <span key="ellipsis3" style={styles.ellipsis}>
          ...
        </span>,
      );

      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          style={{
            ...styles.pageBtn,
            ...(page === totalPages ? styles.pageBtnActive : {}),
          }}
        >
          {totalPages}
        </button>,
      );
    }

    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(page + 1)}
        disabled={page === totalPages}
        style={{
          ...styles.pageBtn,
          opacity: page === totalPages ? 0.5 : 1,
          cursor: page === totalPages ? "not-allowed" : "pointer",
        }}
      >
        <ChevronRight size={18} />
      </button>,
    );

    return pages;
  };

  return (
    <div className="fade-in" style={styles.page}>
      <div className="container">
        <h1 style={styles.pageTitle}>Browse Books</h1>

        <div style={styles.controls}>
          <form onSubmit={handleSearch} style={styles.searchForm}>
            <div style={styles.searchInput}>
              <Search size={20} color="var(--text-secondary)" />

              <input
                type="text"
                placeholder="Search books..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={styles.searchField}
              />
            </div>
          </form>

          <div style={styles.categoryFilter}>
            <Filter size={20} color="var(--text-secondary)" />

            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              style={styles.select}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {isAdmin && (
            <button
              style={styles.addBookBtn}
              onClick={() => navigate("/admin/add-book")}
            >
              + Add Book
            </button>
          )}
        </div>

        {loading ? (
          <div style={styles.loading}>Loading books...</div>
        ) : books.length === 0 ? (
          <div style={styles.empty}>No books found</div>
        ) : (
          <>
            <div style={styles.booksGrid}>
              {books.map((book) => (
                <BookCard
                  key={book._id}
                  book={book}
                  onAddToCart={addToCart}
                  isAdmin={isAdmin}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            <div style={styles.pagination}>{renderPagination()}</div>
          </>
        )}
      </div>
    </div>
  );
};

const BookCard = ({ book, onAddToCart, isAdmin, onDelete }) => {
  const [showAdded, setShowAdded] = useState(false);

  const navigate = useNavigate();

  const handleAdd = () => {
    onAddToCart(book._id);

    setShowAdded(true);

    setTimeout(() => {
      setShowAdded(false);
    }, 1500);
  };

  return (
    <div className="card" style={styles.bookCard}>
      <Link to={`/books/${book._id}`} style={styles.bookLink}>
        <div style={styles.bookCover}>
          <img src={book.cover} alt={book.title} style={styles.bookImage} />
        </div>
      </Link>

      <div style={styles.bookInfo}>
        <Link to={`/books/${book._id}`} style={styles.bookTitleLink}>
          <h3 style={styles.bookTitle}>{book.title}</h3>
        </Link>

        <p style={styles.bookAuthor}>{book.author}</p>

        <span style={styles.bookCategory}>{book.category}</span>

        <div style={styles.bookMeta}>
          <span style={styles.bookPrice}>${book.price.toFixed(2)}</span>

          <span style={styles.bookRating}>
            <Star size={14} fill="var(--success)" color="var(--success)" />

            {book.rating}
          </span>
        </div>

        {isAdmin ? (
          <div style={styles.adminActions}>
            <button
              style={styles.editBtn}
              onClick={() => navigate(`/admin/edit-book/${book._id}`)}
            >
              Edit
            </button>

            <button style={styles.deleteBtn} onClick={() => onDelete(book._id)}>
              Delete
            </button>
          </div>
        ) : (
          <button
            className={`btn btn-primary ${showAdded ? "bounce" : ""}`}
            style={styles.addBtn}
            onClick={handleAdd}
          >
            {showAdded ? "Added!" : "Add to Cart"}
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: {
    padding: "40px 0",
  },

  pageTitle: {
    fontSize: "2.5rem",
    marginBottom: "30px",
  },

  controls: {
    display: "flex",
    gap: "16px",
    marginBottom: "30px",
    flexWrap: "wrap",
    alignItems: "center",
  },

  searchForm: {
    flex: 1,
    minWidth: "250px",
  },

  searchInput: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    padding: "0 16px",
  },

  searchField: {
    flex: 1,
    border: "none",
    background: "transparent",
    padding: "12px 0",
    outline: "none",
  },

  categoryFilter: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    padding: "0 16px",
  },

  select: {
    background: "var(--surface)",
    border: "none",
    color: "var(--text-primary)",
    padding: "12px 0",
    cursor: "pointer",
    outline: "none",
  },

  addBookBtn: {
    background: "var(--accent)",
    color: "white",
    border: "none",
    padding: "12px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  loading: {
    textAlign: "center",
    padding: "60px",
    color: "var(--text-secondary)",
  },

  empty: {
    textAlign: "center",
    padding: "60px",
    color: "var(--text-secondary)",
  },

  booksGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "24px",
  },

  bookCard: {
    display: "flex",
    flexDirection: "column",
  },

  bookLink: {
    display: "block",
  },

  bookCover: {
    height: "200px",
    overflow: "hidden",
  },

  bookImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.3s ease",
  },

  bookInfo: {
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    flex: 1,
  },

  bookTitleLink: {
    textDecoration: "none",
  },

  bookTitle: {
    fontSize: "1rem",
    color: "var(--text-primary)",
    lineHeight: 1.3,
  },

  bookAuthor: {
    fontSize: "0.85rem",
    color: "var(--text-secondary)",
  },

  bookCategory: {
    fontSize: "0.7rem",
    color: "var(--accent)",
    background: "rgba(233, 69, 96, 0.1)",
    padding: "4px 8px",
    borderRadius: "4px",
    width: "fit-content",
  },

  bookMeta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "auto",
  },

  bookPrice: {
    fontSize: "1.1rem",
    fontWeight: "700",
    color: "var(--accent)",
  },

  bookRating: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "0.85rem",
    color: "var(--text-secondary)",
  },

  addBtn: {
    marginTop: "12px",
    width: "100%",
  },

  adminActions: {
    display: "flex",
    gap: "10px",
    marginTop: "12px",
  },

  editBtn: {
    flex: 1,
    background: "#4f46e5",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  deleteBtn: {
    flex: 1,
    background: "#dc2626",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    marginTop: "40px",
  },

  pageBtn: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    color: "var(--text-primary)",
    padding: "10px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.9rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "40px",
  },

  pageBtnActive: {
    background: "var(--accent)",
    borderColor: "var(--accent)",
    color: "white",
  },

  ellipsis: {
    color: "var(--text-secondary)",
    padding: "0 8px",
  },
};

export default Books;
