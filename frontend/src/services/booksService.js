// Books Service
import api from "./api";

export const booksService = {
  getAll: async (params = {}) => {
    const response = await api.get("/books", { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  getByCategory: async (category) => {
    const response = await api.get("/books", { params: { category } });
    return response.data;
  },

  search: async (query) => {
    const response = await api.get("/books", { params: { search: query } });
    return response.data;
  },

  // Admin functions
  create: async (bookData) => {
    const formData = new FormData();
    Object.keys(bookData).forEach((key) => {
      formData.append(key, bookData[key]);
    });
    const response = await api.post("/books", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  update: async (id, bookData) => {
    const formData = new FormData();
    Object.keys(bookData).forEach((key) => {
      formData.append(key, bookData[key]);
    });
    const response = await api.put(`/books/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/books/${id}`);
    return response.data;
  },
};

export default booksService;
