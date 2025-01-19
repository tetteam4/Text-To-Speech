import React from "react";

const Slider = ({ value, onChange, min, max, step }) => {
  const handleChange = (e) => {
    onChange(parseFloat(e.target.value));
  };

  return (
    <div className="relative">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        style={{
          background: `linear-gradient(to right, #007bff ${
            ((value - min) / (max - min)) * 100
          }%, #d3d3d3 ${((value - min) / (max - min)) * 100}%)`,
        }}
      />
      <div
        className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-sm text-gray-500 dark:text-gray-300"
        style={{
          left: `${((value - min) / (max - min)) * 100}%`,
        }}
      >
        {value}
      </div>
    </div>
  );
};

export default Slider;
