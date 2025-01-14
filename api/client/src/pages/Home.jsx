// client/src/pages/Home.jsx
import { useState } from "react";
import Button from "../components/ui/Button";
import InputText from "../components/ui/InputText";
import Dropdown from "../components/ui/Dropdown";
import FeaturesSection from "../components/FeaturesSection";
function Home() {
  const [text, setText] = useState("");
  const handleTextChange = (newText) => {
    setText(newText);
  };

  const languages = [
    { id: 1, name: "English (United States)" },
    { id: 2, name: "Spanish" },
    { id: 3, name: "French" },
  ];

  const voices = [
    { id: 1, name: "Jenny (Female)" },
    { id: 2, name: "John (Male)" },
  ];

  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [selectedVoice, setSelectedVoice] = useState(voices[0]);

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
  };

  const handleVoiceSelect = (voice) => {
    setSelectedVoice(voice);
  };
  const handleGenerateSpeech = () => {
    // implement generate speech logic
  };
  return (
    <div className="p-6 mt-20">
      {/*  action */}
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-4">
          Free{" "}
          <span className="text-primary dark:text-fave">text to speech</span>{" "}
          over 200 voices and 70 languages
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          TET TTS App is a free online text-to-speech (TTS) tool that turns your
          text into natural-sounding speech. We offer a wide range of AI Voices.
          Simply input your text, choose a voice, and either download the
          resulting mp3 file or listen to it directly. Perfect for content
          creators, students, or anyone needing text read aloud.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="primary"
            className="dark:text-white dark:bg-fave dark:hover:bg-[#6c20f3] text-white hover:bg-[#08a8db]"
            size="large"
          >
            Try TTS
          </Button>
          <Button variant="secondary" size="large">
            Learn More
          </Button>
        </div>
      </div>
      <div className="max-w-4xl mx-auto border rounded p-4 bg-white">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="white" size="small">
            Text to Speech
          </Button>
          <Button variant="secondary" size="small">
            File to Speech
          </Button>
        </div>
        <InputText
          onTextChange={handleTextChange}
          initialText={text}
          placeholder="Enter your text here..."
        />
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <Dropdown
              options={languages}
              selected={selectedLanguage}
              onSelect={handleLanguageSelect}
            />
            <Dropdown
              options={voices}
              selected={selectedVoice}
              onSelect={handleVoiceSelect}
            />
          </div>
          <Button
            onClick={handleGenerateSpeech}
            className="dark:text-white dark:bg-fave dark:hover:bg-[#6c20f3] text-white hover:bg-[#08a8db]"
            size="medium"
            variant="primary"
          >
            Generate
          </Button>
        </div>
      </div>
      <FeaturesSection />
    </div>
  );
}

export default Home;
