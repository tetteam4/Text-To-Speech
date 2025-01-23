import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  history: [],
  loading: false,
  error: null,
};

export const fetchHistory = createAsyncThunk(
  "history/fetchHistory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `/api/audio/history`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Error fetching history");
    }
  }
);
// console.log("VITE_BASE_URL:", import.meta.env.VITE_BASE_URL);

export const saveHistory = createAsyncThunk(
  "history/saveHistory",
  async (audioData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/audio/save`, audioData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Error saving audio history");
    }
  }
);

export const generateDownloadUrl = createAsyncThunk(
  "history/generateDownloadUrl",
  async (filename, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/storage/get-download-url/${filename}`,
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
      .addCase(saveHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveHistory.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(saveHistory.rejected, (state, action) => {
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
