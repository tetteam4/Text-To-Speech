import React, { useState } from "react";

function InputText({ initialText = "", onTextChange, maxLength = 20000 }) {
  const [text, setText] = useState(initialText);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    if (newText.length <= maxLength) {
      setText(newText);
      onTextChange(newText);
    }
  };

  const handleClearText = () => {
    setText("");
    onTextChange("");
  };

  return (
    <div className="relative">
      <textarea
        className="w-full h-60 border p-2 dark:text-black rounded focus:outline-none focus:ring-2 focus:ring-primary"
        value={text}
        onChange={handleTextChange}
        placeholder="Enter your text here..."
      />
      <div className="absolute bottom-2 right-2 text-sm ">
        {text.length}/{maxLength}
      </div>
      <button
        onClick={handleClearText}
        className="absolute top-2 right-2 text-gray-800 hover:text-gray-700"
      >
        Clear Text
      </button>
    </div>
  );
}

export default InputText;
