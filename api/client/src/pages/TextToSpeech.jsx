import React, { useEffect, useState, useCallback, useRef } from "react";
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
  setAudioUrl,
} from "../redux/user/speechSlice.js";
import { CloudArrowUpIcon } from "@heroicons/react/24/solid";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import mammoth from "mammoth";
import axios from "axios";
import { saveHistory } from "../redux/user/historySlice.js";

function TextToSpeech() {
  const [localText, setLocalText] = useState("");
  const [rate, setRate] = useState(0);
  const [pitch, setPitch] = useState(0);
  const [volume, setVolume] = useState(0);
  const [format, setFormat] = useState("mp3");
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [voiceType, setVoiceType] = useState("standard");
  const [pauseDropdownOpen, setPauseDropdownOpen] = useState(false);
  const [selectedPause, setSelectedPause] = useState("0.5s");
  const pdfjsLibRef = useRef(null); // Create a ref for the pdfjsLib

  const pauseOptions = ["0.5s", "1s", "2s", "3s", "4s", "5s"];

  useEffect(() => {
    // Set workerSrc as the component mounts
    pdfjsLibRef.current = pdfjsLib;
    pdfjsLibRef.current.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
    console.log(pdfjsLibRef.current.GlobalWorkerOptions.workerSrc);
  }, []);

  const dispatch = useDispatch();

  const {
    voices,
    currentLanguage,
    loading: voicesLoading,
    error,
    audioUrl,
  } = useSelector((state) => {
    console.log("Redux state:", state.speech);
    return state.speech;
  });

  useEffect(() => {
    dispatch(fetchVoices());
  }, [dispatch]);

  const handleTextChange = (newText) => {
    dispatch(setText(newText));
    setLocalText(newText);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      let extractedText = "";
      if (file.type === "text/plain" || file.name.endsWith(".txt")) {
        extractedText = await readTextFile(file);
      } else if (
        file.type === "application/pdf" ||
        file.name.endsWith(".pdf")
      ) {
        extractedText = await readPdfFile(file);
      } else if (
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.name.endsWith(".docx")
      ) {
        extractedText = await readDocxFile(file);
      } else {
        alert(
          "Unsupported file format. Please upload a TXT, PDF, or DOCX file."
        );
        return;
      }
      dispatch(setText(extractedText)); // Update Redux state
      setLocalText(extractedText); // Update local state
    } catch (error) {
      console.error("Error extracting text:", error);
    }
  };

  const readTextFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };

  const readPdfFile = (file) => {
    return new Promise(async (resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target.result;
          const pdf = await pdfjsLibRef.current.getDocument(arrayBuffer)
            .promise;
          let text = "";
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const pageTextContent = await page.getTextContent();
            text += pageTextContent.items
              .map((s) => s.str)
              .join("")
              .concat("\n");
          }
          resolve(text);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  const readDocxFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const buffer = e.target.result;
          const result = await mammoth.extractRawText({ buffer: buffer });
          resolve(result.value);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  const handleLanguageSelect = useCallback(
    (language) => {
      console.log("Selected language:", language);
      dispatch(setCurrentLanguage(language));
    },
    [dispatch, setCurrentLanguage]
  );

  const togglePauseDropdown = () => {
    setPauseDropdownOpen(!pauseDropdownOpen);
  };

  const handlePauseSelect = (pause) => {
    setSelectedPause(pause);
    setPauseDropdownOpen(false);
  };

  const handleVoiceTypeSelect = (type) => {
    setVoiceType(type);
  };

  // const handleGenerateSpeech = async () => {
  //   setIsGenerating(true);
  //   try {
  //     if (
  //       currentLanguage &&
  //       currentLanguage.languageCode &&
  //       currentLanguage.option
  //     ) {
  //       let processedText = localText;
  //       if (selectedPause !== "0s") {
  //         const sentences = localText.split(/[\n\r]+|\.\s+/).filter(Boolean);
  //         processedText = sentences.join(` <break time="${selectedPause}"/> `);
  //       }
  //       const generatedAudioUrl = await dispatch(
  //         generateSpeech({
  //           text: processedText,
  //           lang: currentLanguage.languageCode,
  //           option: currentLanguage.option,
  //           rate: rate / 100,
  //           pitch,
  //           volume: volume / 100,
  //           format,
  //         })
  //       ).unwrap();
  //       if (generatedAudioUrl) {
  //         await axios.post("http://localhost:5000/api/history/save", {
  //           text: localText,
  //           audioUrl: generatedAudioUrl,
  //         });
  //       }
  //     } else {
  //       console.error(
  //         "Error: currentLanguage is undefined or does not have all the necessary data"
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error generating speech:", error);
  //   } finally {
  //     setIsGenerating(false);
  //   }
  // };
  const handleGenerateSpeech = async () => {
    setIsGenerating(true);
    try {
      if (
        currentLanguage &&
        currentLanguage.languageCode &&
        currentLanguage.option
      ) {
        let processedText = localText;
        if (selectedPause !== "0s") {
          const sentences = localText.split(/[\n\r]+|\.\s+/).filter(Boolean);
          processedText = sentences.join(` <break time="${selectedPause}"/> `);
        }
        const generatedAudioUrl = await dispatch(
          generateSpeech({
            text: processedText,
            lang: currentLanguage.languageCode,
            option: currentLanguage.option,
            rate: rate / 100,
            pitch,
            volume: volume / 100,
            format,
          })
        ).unwrap();
        if (generatedAudioUrl) {
          const audioData = {
            text: localText,
            audioUrl: generatedAudioUrl,
            voiceSettings: currentLanguage,
          };
          await dispatch(saveHistory(audioData)).unwrap();
     
        }
      } else {
        console.error(
          "Error: currentLanguage is undefined or does not have all the necessary data"
        );
      }
    } catch (error) {
      console.error("Error generating speech:", error);
    } finally {
      setIsGenerating(false);
    }
  };
  const handleDownloadAudio = () => {
    if (audioUrl) {
      setIsDownloading(true);
      const link = document.createElement("a");
      link.href = audioUrl;
      link.download = `audio.${format}`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => {
        setIsDownloading(false);
      }, 1000);
    }
  };

  const handleClearText = () => {
    dispatch(setText(""));
    setLocalText("");
    setFileInputKey(Date.now());
    dispatch(setAudioUrl(null));
  };
  
  const resetVoiceSettings = () => {
    setRate(0);
    setPitch(0);
    setVolume(0);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 w-full pt-16">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Text to Speech
        </h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Button
              onClick={togglePauseDropdown}
              variant="secondary"
              size="small"
            >
              Pauses
            </Button>
            {pauseDropdownOpen && (
              <div className="absolute z-10 mt-1 bg-white border border-gray-300 rounded shadow-md dark:bg-gray-800 dark:border-gray-700">
                {pauseOptions.map((pause) => (
                  <div
                    key={pause}
                    onClick={() => handlePauseSelect(pause)}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    {pause}
                  </div>
                ))}
              </div>
            )}
          </div>
          <Button onClick={handleClearText} variant="secondary" size="small">
            Clear Text
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
        <div className="md:col-span-1">
          <div className="mb-4 flex items-center gap-2">
            <label
              htmlFor="file-upload"
              className="cursor-pointer text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
            >
              <CloudArrowUpIcon className="h-6 w-6 inline-block mr-1" />
              Upload File
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".txt, .pdf, .docx"
              key={fileInputKey}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          <InputText
            onTextChange={handleTextChange}
            initialText={localText}
            placeholder="Enter your text here..."
          />
        </div>
        <div className="md:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Voice Settings
            </h3>
            <Button onClick={resetVoiceSettings} variant="white" size="small">
              Reset to Default
            </Button>
          </div>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <Button
                variant={voiceType === "standard" ? "primary" : "white"}
                size="small"
                onClick={() => handleVoiceTypeSelect("standard")}
              >
                Standard Voice
              </Button>
              <Button
                variant={voiceType === "cloned" ? "primary" : "secondary"}
                size="small"
                onClick={() => handleVoiceTypeSelect("cloned")}
              >
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
              min={0}
              max={200}
              step={1}
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
              max={100}
              step={1}
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
            disabled={isGenerating}
          >
            {isGenerating ? "Generating..." : "Generate Speech"}
          </Button>
        </div>
      </div>
      <div className="mt-6">
        {error && <p className="dark:text-red-300">Error: {error}</p>}
        {audioUrl && <AudioPlayer audioUrl={audioUrl} />}
        {audioUrl && (
          <div className="mt-4">
            <Button
              onClick={handleDownloadAudio}
              className="dark:text-white dark:bg-fave dark:hover:bg-[#6c20f3] text-white hover:bg-[#08a8db]"
              size="medium"
              variant="primary"
              disabled={isDownloading}
            >
              {isDownloading ? "Downloading..." : "Download Audio"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TextToSpeech;
