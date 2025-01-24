import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaMinus } from "react-icons/fa";

function FAQSection() {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqItems = [
    {
      question: "How can I add pauses in the text?",
      answer:
        "For logged-in users, you can use the Pauses button in the toolbar to insert pauses of different durations (0.5s to 5s). Simply place your cursor where you want the pause, then select the desired duration from the Pauses menu. This gives you precise control over the timing and pacing of the speech.",
    },
    {
      question: "How do I convert text to speech?",
      answer:
        "Start by entering or uploading your text in the text box, selecting your preferred voice and format. Next you press the generate button, after the audio is created you can download or share.",
    },
    {
      question: "How many characters can I convert with the free plan?",
      answer:
        "You can convert up to 2,000 characters at once for the free plan.",
    },
    {
      question: "What are the applications of Luvvoice audio tools?",
      answer:
        "Luvvoice provides audio solutions for many applications, including voice overs, educational material creation, accessibility tools, audio advertising, social media content and much more.",
    },
    {
      question: "Can I use the generated audio for commercial purposes?",
      answer: "Yes, all generated audio is available for commercial use.",
    },
    {
      question: "What formats can I download the audio in?",
      answer: "You can download the audio in mp3 and wav format.",
    },
    {
      question: "What makes Luvvoice AI Voice Generator special?",
      answer:
        "Luvvoice utilizes the latest AI technologies to produce speech that is very close to human sound. We also have many great features for all of our users",
    },
    {
      question: `Why do I get 'Something went wrong' error when clicking the generate button?`,
      answer:
        "If you are getting this error please try again later, there might have been an issue with the servers, and it will resolve itself soon",
    },
    {
      question: `Why can't my PDF file extract text?`,
      answer:
        "This might be because of the document itself, the pdf parser might not be able to extract the text. Please check your PDF document, or try uploading a text or a docx file.",
    },
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto mb-10">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 text-center">
        Frequently Asked Questions
      </h2>
      {faqItems.map((item, index) => (
        <motion.div
          key={index}
          className="border-b border-gray-200 dark:border-gray-700"
          initial={false}
        >
          <motion.button
            className="w-full flex items-center justify-between py-4 px-2 text-gray-700 dark:text-gray-300 text-left font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none"
            onClick={() => toggleAccordion(index)}
            whileTap={{ scale: 0.98 }}
          >
            {item.question}
            <motion.span
              className="text-gray-500"
              animate={{ rotate: activeIndex === index ? 45 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {activeIndex === index ? <FaMinus /> : <FaPlus />}
            </motion.span>
          </motion.button>
          <AnimatePresence initial={false}>
            {activeIndex === index && (
              <motion.div
                className="px-4 py-2 text-gray-600 dark:text-gray-400"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {item.answer}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}
export default FAQSection;
