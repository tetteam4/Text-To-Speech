import React, { useState, useEffect } from "react";

function ClearButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="absolute top-2 right-2 text-gray-800 hover:text-gray-700"
    >
      Clear Text
    </button>
  );
}

function InputText({ initialText = "", onTextChange, maxLength = 20000 }) {
  const [text, setText] = useState(initialText);

  const handleTextLimitChange = (e) => {
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


  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  
  return (
    <div className="relative">
      <textarea
        className="w-full h-60 border p-2 dark:text-black rounded focus:outline-none focus:ring-2 focus:ring-primary"
        value={text}
        onChange={handleTextLimitChange}
        placeholder="Enter your text here..."
        aria-label="Text Input Area"
      />
      <div className="absolute bottom-2 right-2 text-sm " aria-live="polite">
        {text.length}/{maxLength}
      </div>
      <ClearButton onClick={handleClearText} />
    </div>
  );
}

export default InputText;
