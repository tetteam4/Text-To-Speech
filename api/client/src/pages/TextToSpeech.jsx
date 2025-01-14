import React, { useEffect, useState } from "react";
import InputText from "../components/ui/InputText";
import Dropdown from "../components/ui/Dropdown";
import Slider from "../components/ui/Slider";
import Button from "../components/ui/Button";
import AudioPlayer from "../components/ui/AudioPlayer";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchVoices,
  setCurrentLanguage,
  setCurrentVoice,
  generateSpeech,
  setText,
} from "../redux/user/speechSlice.js";

function TextToSpeech() {
  const [text, setTextState] = useState("");
  const dispatch = useDispatch();
  const { voices, currentLanguage, currentVoice, loading, error, audioUrl } =
      useSelector((state) => state.speech);

  useEffect(() => {
    dispatch(fetchVoices());
  }, [dispatch]);

  const handleTextChange = (newText) => {
    dispatch(setText(newText));
    setTextState(newText);
  };

  const handleLanguageSelect = (language) => {
    dispatch(setCurrentLanguage(language));
  };

  const handleVoiceSelect = (voice) => {
    dispatch(setCurrentVoice(voice));
  };
  const [rate, setRate] = useState(0);
  const [volume, setVolume] = useState(0);
  const [pitch, setPitch] = useState(0);

  const handleGenerateSpeech = async () => {
    dispatch(generateSpeech({ text, currentVoice }));
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
              <Dropdown
                  options={voices.map((voice) => ({
                    id: voice.languageCode,
                    name: voice.languageCode,
                  }))}
                  selected={currentLanguage}
                  onSelect={handleLanguageSelect}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Select Voice
              </label>
              <Dropdown
                  options={voices}
                  selected={currentVoice}
                  onSelect={handleVoiceSelect}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Rate
              </label>
              <Slider value={rate} onChange={setRate} />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Volume
              </label>
              <Slider value={volume} onChange={setVolume} />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Pitch
              </label>
              <Slider value={pitch} onChange={setPitch} />
            </div>
            <Button
                onClick={handleGenerateSpeech}
                className="w-full dark:text-white dark:bg-fave dark:hover:bg-[#6c20f3] text-white hover:bg-[#08a8db]"
                size="large"
                variant='primary'
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