// frontend/src/redux/user/audioMessageSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import socket from "../../socket";

const initialState = {
  messages: [],
  loading: false,
  error: null,
};

export const fetchAudioMessages = createAsyncThunk(
  "audioMessage/fetchAudioMessages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/audioMessage/getmessages", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Error fetching audio messages");
    }
  }
);

export const createAudioMessage = createAsyncThunk(
  "audioMessage/createAudioMessage",
  async (messageData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "/api/audioMessage/create",
        messageData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Error sending audio message");
    }
  }
);

export const markMessageAsRead = createAsyncThunk(
  "audioMessage/markMessageAsRead",
  async (messageId, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `/api/audioMessage/mark-read/${messageId}`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Error reading message");
    }
  }
);
export const deliveredMessage = createAsyncThunk(
  "audioMessage/deliveredMessage",
  async (messageId, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `/api/audioMessage/delivered/${messageId}`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Error reading message");
    }
  }
);

const audioMessageSlice = createSlice({
  name: "audioMessage",
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.messages = [];
    },
    updateMessageState: (state, action) => {
      const updatedMessage = action.payload;
      state.messages = state.messages.map((message) =>
        message._id === updatedMessage._id
          ? { ...message, ...updatedMessage }
          : message
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAudioMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAudioMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchAudioMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createAudioMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAudioMessage.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createAudioMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markMessageAsRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markMessageAsRead.fulfilled, (state, action) => {
        state.loading = false;
        const updatedMessage = action.payload.updatedMessage;
        state.messages = state.messages.map((message) =>
          message._id === updatedMessage._id
            ? { ...message, ...updatedMessage }
            : message
        );
      })
      .addCase(markMessageAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deliveredMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deliveredMessage.fulfilled, (state, action) => {
        state.loading = false;
        const updatedMessage = action.payload.updatedMessage;
        state.messages = state.messages.map((message) =>
          message._id === updatedMessage._id
            ? { ...message, ...updatedMessage }
            : message
        );
      })
      .addCase(deliveredMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { clearMessages, updateMessageState } = audioMessageSlice.actions;
export default audioMessageSlice.reducer;
