import React from "react";
import { motion } from "framer-motion";

const HomePage = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center py-12">
      <div className="container mx-auto px-4 text-center">
        {/* Hero Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Transform Text into Voice with Ease
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            Our platform offers seamless text-to-speech conversion, unlocking
            new possibilities for communication and accessibility.
          </p>
        </motion.div>

        {/* Animated Buttons */}
        <motion.div
          className="flex justify-center space-x-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300"
          >
            Get Started Now
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-full transition-all duration-300"
          >
            Learn More
          </motion.button>
        </motion.div>
        {/* Animated Wave SVG*/}
        <motion.div
          className="mt-12 md:mt-16 lg:mt-20 w-full"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            fill="currentColor"
          >
            <path
              fill-opacity="1"
              d="M0,32L48,53.3C96,75,192,117,288,112C384,107,480,53,576,48C672,43,768,85,864,106.7C960,128,1056,128,1152,128C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;
