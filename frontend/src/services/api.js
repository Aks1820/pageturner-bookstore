import axios from "axios";

// Backend API URL
const API_BASE_URL = "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,

  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});

// Handle API errors
api.interceptors.response.use(
  (response) => response,

  (error) => {
    console.error("API Error:", error.message);

    // Handle unauthorized access
    if (error.response?.status === 401) {
      console.log("Unauthorized - Please login again");
    }

    return Promise.reject(error);
  },
);

export default api;
