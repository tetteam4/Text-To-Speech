// client/src/store/historySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  history: [],
  loading: false,
  error: null,
};

export const fetchHistory = createAsyncThunk(
  "history/fetchProjects",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/projects`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Error fetching projects");
    }
  }
);

export const generateDownloadUrl = createAsyncThunk(
  "history/generateDownloadUrl",
  async (filename, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/storage/get-download-url/${filename}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data.url;
    } catch (error) {
      return rejectWithValue(error.message || "Error generating download URL");
    }
  }
);

const HistorySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(generateDownloadUrl.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateDownloadUrl.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(generateDownloadUrl.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setLoading, setError } = HistorySlice.actions;
export default HistorySlice.reducer;
