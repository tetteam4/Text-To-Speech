import React, { useState, useRef, useEffect, useCallback } from "react";
import * as d3 from "d3";
import Button from "../components/ui/Button";
import InputText from "../components/ui/InputText";
import Dropdown from "../components/ui/Dropdown";
import FeaturesSection from "../components/FeaturesSection";
import TestimonialsSection from "../components/TestimonialsSection";
import FAQSection from "../components/FAQSection";
import { motion } from "framer-motion";
import AudioPlayer from "../components/ui/AudioPlayer";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchVoices,
  setCurrentLanguage,
  generateSpeech,
  setText,
  setAudioUrl,
  setIsPlaying,
} from "../redux/user/speechSlice.js";

function Home() {
  const [localText, setLocalText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const dispatch = useDispatch();
  const {
    voices,
    currentLanguage,
    loading: voicesLoading,
    error,
    audioUrl,
    text,
    isPlaying,
  } = useSelector((state) => {
    console.log("Redux state:", state.speech);
    return state.speech;
  });
  useEffect(() => {
    setLocalText(text);
  }, [text]);

  useEffect(() => {
    dispatch(fetchVoices());
  }, [dispatch]);

  const handleTextChange = (newText) => {
    dispatch(setText(newText));
    setLocalText(newText);
    dispatch(setAudioUrl(null)); //remove the audio if the text is changing
    dispatch(setIsPlaying(false));
  };

  const handleLanguageSelect = useCallback(
    (language) => {
      dispatch(setCurrentLanguage(language));
    },
    [dispatch]
  );

  const handleGenerateSpeech = async () => {
    setIsGenerating(true);
    try {
      if (
        currentLanguage &&
        currentLanguage.languageCode &&
        currentLanguage.option
      ) {
        const generatedAudioUrl = await dispatch(
          generateSpeech({
            text: localText,
            lang: currentLanguage.languageCode,
            option: currentLanguage.option,
            rate: 0,
            pitch: 0,
            volume: 1,
            format: "mp3",
          })
        ).unwrap();
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

  const headingRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const headingText = "Instantly Convert Text to Voice with AI";
    const svg = d3
      .select(headingRef.current)
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .style("overflow", "visible");

    const textElement = svg
      .append("text")
      .attr("x", 0)
      .attr("y", "50%")
      .attr("dy", "0.35em")
      .attr("font-size", "2rem")
      .attr("font-weight", "bold")
      .attr("fill", "currentColor")
      .style("opacity", 0)
      .text(headingText);

    const textLength = textElement.node().getComputedTextLength();

    textElement
      .style("opacity", 1)
      .attr("stroke", "currentColor")
      .attr("stroke-width", 2)
      .attr("fill", "transparent")
      .transition()
      .duration(3000)
      .attr("fill", "currentColor")
      .tween("text-draw", function () {
        const i = d3.interpolate(0, textLength);
        return (t) => {
          const pos = i(t);
          this.setAttribute("stroke-dasharray", `${pos} ${textLength}`);
          this.setAttribute("stroke-dashoffset", `${textLength - pos}`);
        };
      });

    return () => {
      svg.remove();
    };
  }, []);

  useEffect(() => {
    if (buttonRef.current) {
      const button = d3.select(buttonRef.current);
      button
        .on("mouseover", function () {
          d3.select(this)
            .transition()
            .duration(200)
            .style("transform", "scale(1.1)");
        })
        .on("mouseout", function () {
          d3.select(this)
            .transition()
            .duration(200)
            .style("transform", "scale(1)");
        });
    }
  }, []);

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };
  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5 },
  };

  return (
    <motion.div
      className="p-6 mt-20"
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      <motion.div
        className="max-w-3xl mx-auto text-center mb-10"
        variants={fadeIn}
      >
        <div
          className="relative"
          ref={headingRef}
          style={{ height: "80px", marginBottom: "1.5rem" }}
        ></div>
        <motion.p
          className="text-gray-600 dark:text-gray-300 mb-6"
          variants={fadeIn}
        >
          TET TTS App is a free online text-to-speech (TTS) tool that turns your
          text into natural-sounding speech. We offer a wide range of AI Voices.
          Simply input your text, choose a voice, and either download the
          resulting mp3 file or listen to it directly. Perfect for content
          creators, students, or anyone needing text read aloud.
        </motion.p>
        <motion.div className="flex items-center justify-center gap-4">
          <Button
            ref={buttonRef}
            variant="primary"
            className="dark:text-white dark:bg-fave dark:hover:bg-[#6c20f3] text-white hover:bg-[#08a8db]"
            size="large"
          >
            Try TTS
          </Button>
          <Button variant="secondary" size="large">
            Learn More
          </Button>
        </motion.div>
      </motion.div>
      <motion.div
        className="max-w-4xl mx-auto border rounded p-4 bg-white"
        variants={fadeIn}
      >
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
          initialText={localText}
          placeholder="Enter your text here..."
        />
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
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
              <p>No voices available</p>
            )}
          </div>
          <Button
            onClick={handleGenerateSpeech}
            className="dark:text-white dark:bg-fave dark:hover:bg-[#6c20f3] text-white hover:bg-[#08a8db]"
            size="medium"
            variant="primary"
            disabled={isGenerating}
          >
            {isGenerating ? "Generating..." : "Generate"}
          </Button>
        </div>
      </motion.div>
      {error && <p className="dark:text-red-300">Error: {error}</p>}
      {audioUrl && <AudioPlayer audioUrl={audioUrl} />}
      <FeaturesSection />
      <TestimonialsSection />
      <FAQSection />
    </motion.div>
  );
}

export default Home;
