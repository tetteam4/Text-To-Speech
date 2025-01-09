import { create } from "zustand";
import api from "../services/api";

const useStore = create((set) => ({
  voices: [],
  currentVoice: null,
  currentLanguage: null,
  text: "",
  audioUrl: null,
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  currentProject: null,
  projects: [],
  allUsers: [],
  setLoading: (loading) => set({ loading: loading }),
  setError: (error) => set({ error: error }),
  fetchVoices: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("speech/google-voices");
      const voices = response.data;
      set({
        voices,
        currentLanguage: voices && voices[0] ? voices[0].languageCode : null,
        currentVoice: voices && voices[0] ? voices[0] : null,
        loading: false,
      });
    } catch (error) {
      set({ error: "Error Fetching voices", loading: false });
    }
  },
  setAudioUrl: (url) => set({ audioUrl: url }),
  setCurrentVoice: (voice) => set({ currentVoice: voice }),
  setCurrentLanguage: (language) => set({ currentLanguage: language }),
  setText: (text) => set({ text: text }),
  generateSpeech: async (
    text,
    currentVoice,
    setLoading,
    setError,
    setAudioUrl
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("speech/generate-google", {
        text,
        voiceSettings: currentVoice,
      });
      setAudioUrl(response.data.audioFileUrl);
    } catch (error) {
      setError(error.message || "Error generating speech");
    } finally {
      setLoading(false);
    }
  },
  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post("auth/login", credentials);
      const user = response.data;
      const token = response.headers.get("Set-Cookie")?.split("=")[1];
      if (token) {
        localStorage.setItem("token", token.split(";")[0]);
      }
      set({ user, isAuthenticated: true, loading: false });
      return user;
    } catch (error) {
      set({ error: "Error login", loading: false, isAuthenticated: false });
      throw error;
    }
  },
  signup: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post("auth/signup", credentials);
      const user = response.data;
      const token = response.headers.get("Set-Cookie")?.split("=")[1];
      if (token) {
        localStorage.setItem("token", token.split(";")[0]);
      }
      set({ user, isAuthenticated: true, loading: false });
      return user;
    } catch (error) {
      set({ error: "Error signup", loading: false, isAuthenticated: false });
      throw error;
    }
  },
  logout: async () => {
    set({ loading: true, error: null });
    try {
      await api.post("auth/logout");
      localStorage.removeItem("token");
      set({ user: null, isAuthenticated: false, loading: false, projects: [] });
      return;
    } catch (error) {
      set({ error: "Error logout", loading: false, isAuthenticated: false });
      throw error;
    }
  },
  fetchProjects: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/projects");
      set({ projects: response.data, loading: false });
    } catch (error) {
      set({ error: "Error fetching projects", loading: false });
    }
  },
  createProject: async (projectData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post("/projects", projectData);
      set({ projects: [...(projects || []), response.data], loading: false });
    } catch (error) {
      set({ error: "Error creating project", loading: false });
      throw error;
    }
  },
  deleteProject: async (projectId) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/projects/${projectId}`);
      set({
        projects: projects.filter((project) => project._id !== projectId),
        loading: false,
      });
    } catch (error) {
      set({ error: "Error deleting project", loading: false });
      throw error;
    }
  },
  fetchAllUsers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/users");
      set({ allUsers: response.data, loading: false });
    } catch (error) {
      set({ error: "Error fetching users", loading: false });
      throw error;
    }
  },
  updateUser: async (userId, role) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/users/${userId}`, { role });
      set({
        allUsers: allUsers.map((user) =>
          user._id === response.data._id ? { ...response.data } : user
        ),
        loading: false,
      });
    } catch (error) {
      set({ error: "Error updating user", loading: false });
      throw error;
    }
  },
  deleteUser: async (userId) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/users/${userId}`);
      set({
        allUsers: allUsers.filter((user) => user._id !== userId),
        loading: false,
      });
    } catch (error) {
      set({ error: "Error deleting user", loading: false });
      throw error;
    }
  },
  updateProfile: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put("auth/profile", userData);
      set({ user: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ error: "Error updating profile", loading: false });
      throw error;
    }
  },
  hydrateStore: async () => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const response = await api.get("/auth/profile", {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        set({
          user: response.data,
          isAuthenticated: true,
        });
      } catch (error) {
        localStorage.removeItem("token");
        set({
          user: null,
          isAuthenticated: false,
        });
      }
    }
  },
}));

export default useStore;
