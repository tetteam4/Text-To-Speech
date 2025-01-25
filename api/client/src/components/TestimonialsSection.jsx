import React from "react";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";

function TestimonialsSection() {
  const testimonials = [
    {
      name: "Olivia Walker",
      image: "./public/Service-PNG.png", // Placeholder for user image
      text: "This is a very good text reader and tts tool! It generates realistic ai voice. If you aren't sure, always go for Luvvoice. Believe me, you won't regret it.",
    },
    {
      name: "Ashley Taylor",
      image: "./public/IMG_8802.JPG", // Placeholder for user image
      text: "Really good. Luvvoice is by far the most valuable business resource we have ever purchased. I love this TTS tool.",
    },
    {
      name: "Emma Rodriguez",
      image: "./public/IMG_8802.JPG", // Placeholder for user image
      text: "The quality of the AI-generated voices is impressive. It's been incredibly helpful for creating accessible content for visually impaired users of my website.",
    },
    {
      name: "Olivia Walker",
      image: "./public/Service-PNG.png", // Placeholder for user image
      text: "This is a very good text reader and tts tool! It generates realistic ai voice. If you aren't sure, always go for Luvvoice. Believe me, you won't regret it.",
    },
    {
      name: "Ashley Taylor",
      image: "./public/IMG_8802.JPG", // Placeholder for user image
      text: "Really good. Luvvoice is by far the most valuable business resource we have ever purchased. I love this TTS tool.",
    },
    {
      name: "Emma Rodriguez",
      image: "./public/IMG_8802.JPG", // Placeholder for user image
      text: "The quality of the AI-generated voices is impressive. It's been incredibly helpful for creating accessible content for visually impaired users of my website.",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto text-center mb-10">
      <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-6 gap-5 py-6 my-4">
        <span className="text-gray-500 dark:text-white text-sm block uppercase">
          See what our customers have to say about us
        </span>
        What Our Users Say
      </h2>
      <div className="flex gap-4 overflow-x-auto p-4 scrollbar-hide">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            className="flex-shrink-0 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-80 md:w-96 text-left"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            
          >
            <div className="flex items-center mb-4">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  {testimonial.name}
                </h3>
                <div className="flex text-yellow-400">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                </div>
              </div>
            </div>

            <p className="text-gray-700 dark:text-gray-300 text-sm">
              {testimonial.text}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default TestimonialsSection;
