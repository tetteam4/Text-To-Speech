// client/src/pages/TextToSpeech.jsx
import React, { useEffect, useState } from "react";
import InputText from "../components/ui/InputText";
import Dropdown from "../components/ui/Dropdown";
import Slider from "../components/ui/Slider";
import Button from "../components/ui/Button";
import AudioPlayer from "../components/ui/AudioPlayer";
import useStore from "../store/store";

function TextToSpeech() {
  const [text, setText] = useState("");
  const {
    voices,
    currentLanguage,
    currentVoice,
    fetchVoices,
    setCurrentLanguage,
    setCurrentVoice,
    generateSpeech,
    setAudioUrl,
    loading,
    error,
    audioUrl,
    setLoading,
    setError,
  } = useStore();

  useEffect(() => {
    fetchVoices();
  }, [fetchVoices]);

  const handleTextChange = (newText) => {
    setText(newText);
  };

  const handleLanguageSelect = (language) => {
    setCurrentLanguage(language);
  };

  const handleVoiceSelect = (voice) => {
    setCurrentVoice(voice);
  };
  const [rate, setRate] = useState(0);
  const [volume, setVolume] = useState(0);
  const [pitch, setPitch] = useState(0);

  const handleGenerateSpeech = () => {
    generateSpeech(text, currentVoice, setLoading, setError, setAudioUrl);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">Text to Speech</h2>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="small">
            Pauses
          </Button>
          <Button variant="secondary" size="small">
            Clear Text
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <InputText
            onTextChange={handleTextChange}
            initialText={text}
            placeholder="Enter your text here..."
          />
        </div>
        <div className="md:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-700">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Voice
            </label>
            <Dropdown
              options={voices}
              selected={currentVoice}
              onSelect={handleVoiceSelect}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rate
            </label>
            <Slider value={rate} onChange={setRate} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Volume
            </label>
            <Slider value={volume} onChange={setVolume} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pitch
            </label>
            <Slider value={pitch} onChange={setPitch} />
          </div>
          <Button
            onClick={handleGenerateSpeech}
            className="w-full"
            size="large"
          >
            Generate Speech
          </Button>
        </div>
      </div>
      <div className="mt-6">
        {loading && <p>Loading</p>}
        {error && <p>Error: {error}</p>}
        {audioUrl && <AudioPlayer audioUrl={audioUrl} />}
      </div>
    </div>
  );
}

export default TextToSpeech;
