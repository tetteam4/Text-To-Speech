// client/src/components/FeaturesSection.jsx
import React from "react";
import { MdOutlineSpeaker, MdLanguage } from "react-icons/md";
import { AiOutlineFileText, AiOutlineClockCircle } from "react-icons/ai";
import { PiTextT, PiGearDuotone } from "react-icons/pi";
import { Button } from "flowbite-react";

function FeaturesSection() {
  const features = [
    {
      title: "Real AI Voice",
      icon: (
        <MdOutlineSpeaker className="h-10 w-10 mx-auto text-primary dark:text-fave" />
      ),
      description:
        "Built on deep learning and AI breakthrough research to generate sounds that are extremely close to the quality of real human voices.",
    },
    {
      title: "Lots of Languages and AI Voices",
      icon: (
        <MdLanguage className="h-10 w-10 mx-auto text-primary dark:text-fave" />
      ),
      description:
        "As a professional AI Voice Generator, A large number of high-quality voices, 200 voices in more than 70 languages, your best text reader.",
    },
    {
      title: "Easily Convert Text to Audio",
      icon: (
        <AiOutlineFileText className="h-10 w-10 mx-auto text-primary dark:text-fave" />
      ),
      description:
        "Copy-paste an existing script or type in the text for your script or text editor. Choose an AI voice of your choice from Luvvoice's library of voices.",
    },
    {
      title: "Document to Voice",
      icon: (
        <AiOutlineFileText className="h-10 w-10 mx-auto text-primary dark:text-fave" />
      ),
      description:
        "Support common formats like PDF and TXT. Upload documents with hundreds of thousands of characters and convert them to AI voice.",
    },
    {
      title: "Extended Character Limit",
      icon: (
        <PiTextT className="h-10 w-10 mx-auto text-primary dark:text-fave" />
      ),
      description:
        "Logged-in and paid users can generate up to 20,000 characters at once, greatly improving efficiency.",
    },
    {
      title: "Adjustable Speech",
      icon: (
        <PiGearDuotone className="h-10 w-10 mx-auto text-primary dark:text-fave" />
      ),
      description:
        "Adjust the speech rate and pitch by clicking the settings button. Generated audio can be saved for 72 hours.",
    },
  ];

  const languages = [
    "English",
    "Spanish",
    "Chinese",
    "German",
    "French",
    "Italian",
    "Japanese",
    "Korean",
    "Portuguese",
    "Russian",
    "Thai",
    "Turkish",
    "Vietnamese",
    "Arabic",
    "Hindi",
    "Bengali",
    "Catalan",
    "Czech",
    "Danish",
    "Dutch",
  ];
  return (
    <div className="mt-24">
      <div className="max-w-6xl mx-auto text-center mb-10 mt-4">
        <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-6">
          <span className="text-gray-500 dark:text-white text-sm block uppercase">
            Everything You Need
          </span>
          What are the features of TET TTS APP ?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col justify-center items-center gap-2 p-4"
            >
              {feature.icon}
              <h3 className="text-md font-bold text-gray-800 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-500  dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="max-w-4xl mx-auto text-center mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
          <span className="text-gray-500 dark:text-white da text-sm block uppercase">
            BEST TTS TOOL
          </span>
          The most powerful creative and business tts tool
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
          TET TTS is a great tts tool,TET TTS can generate a variety of
          character voices that you can use in marketing , and social media such
          as YouTube and Tiktok, you can use to learn new languages and read
          books aloud!
        </p>

        <div className="flex items-center justify-center">
          <img src="../public/Service-PNG.png" className="max-w-md " />
        </div>
      </div>
      <div className="max-w-6xl mx-auto text-center mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
          <span className="text-gray-500 dark:text-white text-sm block uppercase">
            MOST POPULAR LANGUAGES AND TTS AI VOICES WE SUPPORT
          </span>
          Easily convert text to speech, choose your favorite language and
          voice:
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mt-6">
          {languages.map((language) => (
            <Button key={language} variant="primary" size="small">
              {language}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
export default FeaturesSection;
