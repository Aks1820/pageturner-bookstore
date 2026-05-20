import api from "./api";

export const authService = {
  login: async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    return response.data;
  },

  register: async (name, email, password) => {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
    });

    return response.data;
  },

  logout: async () => {
    try {
      const response = await api.get("/auth/logout");
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        return { success: true };
      }

      throw error;
    }
  },

  getCurrentUser: async () => {
    const response = await api.get("/auth/profile");
    return response.data;
  },

  // With httpOnly cookies, frontend cannot directly check cookies
  // So always return true and let backend verify auth
  isAuthenticated: () => {
    return true;
  },
};

export default authService;
