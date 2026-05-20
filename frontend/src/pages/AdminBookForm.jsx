import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import booksService from "../services/booksService";

const AdminBookForm = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    category: "",
    price: "",
    cover: "",
    rating: "",
  });

  useEffect(() => {
    if (isEdit) {
      loadBook();
    }
  }, []);

  const loadBook = async () => {
    try {
      const response = await booksService.getById(id);

      const book = response.book;

      setFormData({
        title: book.title || "",
        author: book.author || "",
        description: book.description || "",
        category: book.category || "",
        price: book.price || "",
        cover: book.cover || "",
        rating: book.rating || "",
      });
    } catch (error) {
      console.error("Error loading book:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEdit) {
        await booksService.update(id, formData);
      } else {
        await booksService.create(formData);
      }

      navigate("/books");
    } catch (error) {
      console.error("Error saving book:", error);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>{isEdit ? "Edit Book" : "Add New Book"}</h1>

          <p style={styles.subtitle}>Manage your bookstore inventory</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.grid}>
            <input
              name="title"
              placeholder="Book Title"
              value={formData.title}
              onChange={handleChange}
              style={styles.input}
              required
            />

            <input
              name="author"
              placeholder="Author"
              value={formData.author}
              onChange={handleChange}
              style={styles.input}
              required
            />

            <input
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
              style={styles.input}
              required
            />

            <input
              name="price"
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              style={styles.input}
              required
            />

            <input
              name="cover"
              placeholder="Cover Image URL"
              value={formData.cover}
              onChange={handleChange}
              style={styles.input}
              required
            />

            <input
              name="rating"
              type="number"
              step="0.1"
              placeholder="Rating"
              value={formData.rating}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <textarea
            name="description"
            placeholder="Book Description"
            value={formData.description}
            onChange={handleChange}
            style={styles.textarea}
            required
          />

          {formData.cover && (
            <div style={styles.previewContainer}>
              <img src={formData.cover} alt="Preview" style={styles.preview} />
            </div>
          )}

          <button type="submit" style={styles.button}>
            {isEdit ? "Update Book" : "Add Book"}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    padding: "40px 20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },

  card: {
    width: "100%",
    maxWidth: "900px",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "20px",
    padding: "40px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
  },

  header: {
    marginBottom: "30px",
  },

  title: {
    fontSize: "2.2rem",
    marginBottom: "8px",
  },

  subtitle: {
    color: "var(--text-secondary)",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "18px",
  },

  input: {
    background: "var(--primary)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    padding: "14px 16px",
    color: "var(--text-primary)",
    outline: "none",
    fontSize: "1rem",
  },

  textarea: {
    minHeight: "140px",
    resize: "vertical",
    background: "var(--primary)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    padding: "16px",
    color: "var(--text-primary)",
    outline: "none",
    fontSize: "1rem",
  },

  previewContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "10px",
  },

  preview: {
    width: "180px",
    height: "260px",
    objectFit: "cover",
    borderRadius: "14px",
    border: "1px solid var(--border)",
  },

  button: {
    background: "var(--accent)",
    color: "white",
    border: "none",
    padding: "16px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "1rem",
    transition: "0.2s ease",
  },
};

export default AdminBookForm;
