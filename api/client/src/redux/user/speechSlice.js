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
  "speech",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/speech/speechify-voices`,
        {
          withCredentials: true,
        }
      );
      console.log("fetchVoices API Response:", response.data); // log for debug
      return response.data;
    } catch (error) {
      console.error("fetchVoices API Error:", error); // log for debug
      return rejectWithValue(error.message || "Error fetching voices");
    }
  }
);

export const generateSpeech = createAsyncThunk(
  "speech/generateSpeech",
  async ({ text, voiceSettings }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/speech/generate-speechify`,
        {
          text,
          voiceSettings,
        },
        {
          withCredentials: true,
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
    setCurrentLanguage: (state, action) => {
      state.currentLanguage = action.payload;
      console.log("setCurrentLanguage Payload:", action.payload); // log for debug
      localStorage.setItem("currentLanguage", JSON.stringify(action.payload));
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
        console.log("fetchVoices.fulfilled action payload:", action.payload); // log for debug
        state.voices = action.payload;
        const storedLanguage = localStorage.getItem("currentLanguage");
        console.log("storedLanguage :", storedLanguage); // log for debug
        const parsedLanguage = storedLanguage
          ? JSON.parse(storedLanguage)
          : null;

        let storedVoice = null;
        if (parsedLanguage && action.payload.length > 0) {
          storedVoice = action.payload.find(
            (voice) => voice.languageCode === parsedLanguage?.id
          );
        }

        state.currentLanguage =
          parsedLanguage ||
          (action.payload && action.payload[0]
            ? {
                name: action.payload[0].language,
                id: action.payload[0].languageCode,
              }
            : null);

        state.currentVoice =
          storedVoice ||
          (action.payload && action.payload[0] ? action.payload[0] : null);

        console.log("fetchVoices.fulfilled payload:", action.payload);
        console.log("fetchVoices.fulfilled voices:", state.voices);
        console.log("fetchVoices.fulfilled currentVoice:", state.currentVoice);
        console.log(
          "fetchVoices.fulfilled currentLanguage:",
          state.currentLanguage
        );
      })
      .addCase(fetchVoices.rejected, (state, action) => {
        state.loading = false;
        console.error("fetchVoices.rejected error:", action.payload); // log for debug
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
  setCurrentLanguage,
  setText,
  setLoading,
  setError,
} = SpeechSlice.actions;
export default SpeechSlice.reducer;
