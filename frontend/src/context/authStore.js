import { create } from "zustand";
import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

const useAuthStore = create((set, get) => ({
  token: localStorage.getItem("token") || null,
  user: JSON.parse(localStorage.getItem("user")) || null,
  isAuthenticated: !!localStorage.getItem("token"),
  isAdmin: JSON.parse(localStorage.getItem("user"))?.role === "admin",

  signup: async (username, email, password, phoneNumber) => {
    try {
      const response = await axios.post(`${baseURL}/api/auth/signup`, {
        username,
        email,
        password,
        phoneNumber,
      });
      set({ token: response.data.token });
      localStorage.setItem("token", response.data.token);
      const user = { username, email, role: "user" };
      set({ user: user });
      localStorage.setItem("user", JSON.stringify(user));
      set({ isAuthenticated: true });
      return response.data;
    } catch (err) {
      set({ token: null });
      set({ user: null });
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      set({ isAuthenticated: false });
      throw new Error(err?.response?.data?.message || err?.message);
    }
  },
  login: async (email, password) => {
    try {
      const response = await axios.post(`${baseURL}/api/auth/login`, {
        email,
        password,
      });
      set({ token: response.data.token });
      localStorage.setItem("token", response.data.token);
      const user = { email, role: "user" };
      set({ user: user });
      localStorage.setItem("user", JSON.stringify(user));
      set({ isAuthenticated: true });
      return response.data;
    } catch (err) {
      set({ token: null });
      set({ user: null });
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      set({ isAuthenticated: false });
      throw new Error(err?.response?.data?.message || err?.message);
    }
  },
  logout: () => {
    set({ token: null });
    set({ user: null });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ isAuthenticated: false });
  },
}));

export default useAuthStore;
