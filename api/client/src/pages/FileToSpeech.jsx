import React from "react";
import Button from "../components/ui/Button";

function FileToSpeech() {
  return (
      <div className="p-4 md:p-6 lg:p-8 w-full pt-16">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
          File to Speech
        </h2>
        <div className="border-2 border-dashed border-gray-400 dark:border-gray-600 rounded p-6 md:p-8 lg:p-10 flex flex-col justify-center items-center">
          <div className="text-center mb-4">
            <svg
                className="mx-auto h-10 w-10 md:h-12 md:w-12 text-gray-400 dark:text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
            >
              <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.8-6.75m12.6 0a4.5 4.5 0 01-1.8 6.75M7.5 7.5h12m-12 0a3 3 0 11-6 0 3 3 0 016 0zm12 0a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
            </svg>
            <span className="block text-gray-700 dark:text-gray-300">
            Click to Upload or drag and drop
          </span>
            <span className="block text-gray-500 dark:text-gray-400 text-sm">
            Supported formats: PDF, TXT, DOCX
          </span>
            <span className="block text-gray-500 dark:text-gray-400 text-sm">
            Maximum file size: 50MB
          </span>
          </div>
          <Button className="w-full md:w-auto" size="large" variant="primary">
            Extract Text
          </Button>
        </div>
      </div>
  );
}

export default FileToSpeech;