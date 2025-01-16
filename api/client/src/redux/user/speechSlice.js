// client/src/redux/user/speechSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  voices: [],
  currentLanguage: null,
  text: "",
  audioUrl: null,
  loading: false,
  error: null,
};

const edenApiKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjkwYjUxMTctZWU0ZS00ZjI5LWJkMGQtMmRjYmYwN2FlYmRmIiwidHlwZSI6ImFwaV90b2tlbiJ9.mxfwBW74jVtbu0Lw21R8kPs520EVyGozqfQAruJHg2g";

// Hardcoded list of supported languages and voices (Eden AI specific)
const supportedLanguages = [
  { language: "English", languageCode: "en", option: "FEMALE" },
  { language: "English", languageCode: "en", option: "MALE" },
  { language: "Spanish", languageCode: "es", option: "FEMALE" },
  { language: "Spanish", languageCode: "es", option: "MALE" },
  { language: "French", languageCode: "fr", option: "FEMALE" },
  { language: "French", languageCode: "fr", option: "MALE" },
  { language: "German", languageCode: "de", option: "FEMALE" },
  { language: "German", languageCode: "de", option: "MALE" },
  { language: "Italian", languageCode: "it", option: "FEMALE" },
  { language: "Italian", languageCode: "it", option: "MALE" },
  { language: "Portuguese", languageCode: "pt", option: "FEMALE" },
  { language: "Portuguese", languageCode: "pt", option: "MALE" },
  { language: "Dutch", languageCode: "nl", option: "FEMALE" },
  { language: "Dutch", languageCode: "nl", option: "MALE" },
  { language: "Russian", languageCode: "ru", option: "FEMALE" },
  { language: "Russian", languageCode: "ru", option: "MALE" },
  { language: "Arabic", languageCode: "ar", option: "FEMALE" },
  { language: "Arabic", languageCode: "ar", option: "MALE" },
  { language: "Chinese", languageCode: "zh", option: "FEMALE" },
  { language: "Chinese", languageCode: "zh", option: "MALE" },
  { language: "Japanese", languageCode: "ja", option: "FEMALE" },
  { language: "Japanese", languageCode: "ja", option: "MALE" },
  { language: "Korean", languageCode: "ko", option: "FEMALE" },
  { language: "Korean", languageCode: "ko", option: "MALE" },
];

export const fetchVoices = createAsyncThunk(
  "speech/fetchVoices",
  async (_, { rejectWithValue }) => {
    try {
      return supportedLanguages;
    } catch (error) {
      console.error("fetchVoices API Error:", error);
      return rejectWithValue(error.message || "Error fetching voices");
    }
  }
);

export const generateSpeech = createAsyncThunk(
  "speech/generateSpeech",
  async (
    { text, lang, option, rate, pitch, volume, format },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        "https://api.edenai.run/v2/audio/text_to_speech",
        {
          providers: "amazon,google,ibm,microsoft",
          language: lang,
          text: text,
          option: option,
          audio_rate: rate,
          audio_pitch: pitch,
          audio_volume: volume,
          audio_format: format,
        },
        {
          headers: {
            authorization: `Bearer ${edenApiKey}`,
          },
        }
      );
      if (
        response.data &&
        response.data.amazon &&
        response.data.amazon.audio_resource_url
      ) {
        return response.data.amazon.audio_resource_url;
      } else if (
        response.data &&
        response.data.google &&
        response.data.google.audio_resource_url
      ) {
        return response.data.google.audio_resource_url;
      } else if (
        response.data &&
        response.data.ibm &&
        response.data.ibm.audio_resource_url
      ) {
        return response.data.ibm.audio_resource_url;
      } else if (
        response.data &&
        response.data.microsoft &&
        response.data.microsoft.audio_resource_url
      ) {
        return response.data.microsoft.audio_resource_url;
      } else {
        throw new Error("Invalid audio URL received from the API");
      }
    } catch (error) {
      console.error("Error generating speech:", error);
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
      console.log("setCurrentLanguage Payload:", action.payload);
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
        console.log("fetchVoices.fulfilled action payload:", action.payload);
        state.voices = action.payload;
        const storedLanguage = localStorage.getItem("currentLanguage");
        console.log("storedLanguage :", storedLanguage);
        const parsedLanguage = storedLanguage
          ? JSON.parse(storedLanguage)
          : null;

        state.currentLanguage =
          parsedLanguage ||
          (action.payload && action.payload[0] ? action.payload[0] : null);

        console.log("fetchVoices.fulfilled voices:", state.voices);
        console.log(
          "fetchVoices.fulfilled currentLanguage:",
          state.currentLanguage
        );
      })
      .addCase(fetchVoices.rejected, (state, action) => {
        state.loading = false;
        console.error("fetchVoices.rejected error:", action.payload);
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
