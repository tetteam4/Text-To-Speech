// client/src/store/speechSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  voices: [],
  currentVoice: null,
  currentLanguage: null,
  text: "",
  audioUrl: null,
  loading: false,
  error: null,
};

export const fetchVoices = createAsyncThunk(
  "speech/fetchVoices",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/speech/google-voices`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Error fetching voices");
    }
  }
);

export const generateSpeech = createAsyncThunk(
  "speech/generateSpeech",
  async ({ text, currentVoice }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/speech/generate-google`,
        {
          text,
          voiceSettings: currentVoice,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data.audioFileUrl;
    } catch (error) {
      return rejectWithValue(error.message || "Error generating speech");
    }
  }
);

const SpeechSlice = createSlice({
  name: "speech",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setAudioUrl: (state, action) => {
      state.audioUrl = action.payload;
    },
    setCurrentVoice: (state, action) => {
      state.currentVoice = action.payload;
    },
    setCurrentLanguage: (state, action) => {
      state.currentLanguage = action.payload;
    },
    setText: (state, action) => {
      state.text = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVoices.fulfilled, (state, action) => {
        state.loading = false;
        state.voices = action.payload;
        state.currentLanguage = action.payload[0]
          ? action.payload[0].languageCode
          : null;
        state.currentVoice = action.payload[0] ? action.payload[0] : null;
      })
      .addCase(fetchVoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(generateSpeech.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateSpeech.fulfilled, (state, action) => {
        state.loading = false;
        state.audioUrl = action.payload;
      })
      .addCase(generateSpeech.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setAudioUrl,
  setCurrentVoice,
  setCurrentLanguage,
  setText,
  setLoading,
  setError,
} = SpeechSlice.actions;
export default SpeechSlice.reducer;
