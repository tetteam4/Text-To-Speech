// client/src/components/TextToSpeech.jsx
import React, { useEffect, useState, useCallback } from "react";
import InputText from "../components/ui/InputText";
import Dropdown from "../components/ui/Dropdown";
import Slider from "../components/ui/Slider";
import Button from "../components/ui/Button";
import AudioPlayer from "../components/ui/AudioPlayer";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchVoices,
  setCurrentLanguage,
  generateSpeech,
  setText,
} from "../redux/user/speechSlice.js";

function TextToSpeech() {
  const [text, setTextState] = useState("");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(0);
  const [volume, setVolume] = useState(1);
  const [format, setFormat] = useState("mp3");
  const dispatch = useDispatch();
  const { voices, currentLanguage, loading, error, audioUrl } = useSelector(
    (state) => {
      console.log("Redux state:", state.speech);
      return state.speech;
    }
  );

  useEffect(() => {
    dispatch(fetchVoices());
  }, [dispatch]);

  useEffect(() => {
    console.log("TextToSpeech - voices:", voices);
    console.log("TextToSpeech - currentLanguage:", currentLanguage);
  }, [voices, currentLanguage]);

  const handleTextChange = (newText) => {
    dispatch(setText(newText));
    setTextState(newText);
  };

  const handleLanguageSelect = useCallback(
    (language) => {
      console.log("Selected language:", language);
      dispatch(setCurrentLanguage(language));
    },
    [dispatch, setCurrentLanguage]
  );

  const handleGenerateSpeech = async () => {
    try {
      if (
        currentLanguage &&
        currentLanguage.languageCode &&
        currentLanguage.option
      ) {
        dispatch(
          generateSpeech({
            text,
            lang: currentLanguage.languageCode,
            option: currentLanguage.option,
            rate,
            pitch,
            volume,
            format,
          })
        );
      } else {
        console.error(
          "Error: currentLanguage is undefined or does not have all the necessary data"
        );
      }
    } catch (error) {
      console.error("Error generating speech:", error);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 w-full pt-16">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Text to Speech
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="small">
            Pauses
          </Button>
          <Button variant="secondary" size="small">
            Clear Text
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
        <div className="md:col-span-2">
          <InputText
            onTextChange={handleTextChange}
            initialText={text}
            placeholder="Enter your text here..."
          />
        </div>
        <div className="md:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Voice Settings
            </h3>
            <Button variant="white" size="small">
              Reset
            </Button>
          </div>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <Button variant="white" size="small">
                Standard Voice
              </Button>
              <Button variant="secondary" size="small">
                Cloned Voice
              </Button>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Select Language
            </label>

            {voices && voices.length > 0 ? (
              <Dropdown
                options={voices.map((voice) => ({
                  id: `${voice.languageCode}-${voice.option}`,
                  name: `${voice.language} (${voice.option})`,
                  ...voice,
                }))}
                selected={currentLanguage}
                onSelect={handleLanguageSelect}
              />
            ) : (
              <p className="dark:text-gray-300">No voices available.</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Rate
            </label>
            <Slider
              value={rate}
              onChange={setRate}
              min={0.5}
              max={2}
              step={0.1}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Volume
            </label>
            <Slider
              value={volume}
              onChange={setVolume}
              min={0}
              max={1}
              step={0.1}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Pitch
            </label>
            <Slider
              value={pitch}
              onChange={setPitch}
              min={-10}
              max={10}
              step={1}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Audio Format
            </label>
            <Dropdown
              options={[
                { name: "mp3", id: "mp3" },
                { name: "wav", id: "wav" },
              ]}
              selected={format}
              onSelect={setFormat}
            />
          </div>
          <Button
            onClick={handleGenerateSpeech}
            className="w-full dark:text-white dark:bg-fave dark:hover:bg-[#6c20f3] text-white hover:bg-[#08a8db]"
            size="large"
            variant="primary"
          >
            Generate Speech
          </Button>
        </div>
      </div>
      <div className="mt-6">
        {loading && <p className="dark:text-gray-300">Loading</p>}
        {error && <p className="dark:text-red-300">Error: {error}</p>}
        {audioUrl && <AudioPlayer audioUrl={audioUrl} />}
      </div>
    </div>
  );
}

export default TextToSpeech;
