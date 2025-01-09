// client/src/components/ui/Slider.jsx
import React, { useState, useCallback, useRef, useEffect } from "react";

function Slider({ min = 0, max = 100, value = 0, onChange }) {
  const [sliderValue, setSliderValue] = useState(value);
  const sliderRef = useRef(null);
  const handleRef = useRef(null);

  const handleDragStart = useCallback((event) => {
    event.preventDefault();
  }, []);

  const handleSliderChange = useCallback(
    (event) => {
      if (!sliderRef.current) return;
      const sliderRect = sliderRef.current.getBoundingClientRect();
      const handleWidth = handleRef.current ? handleRef.current.offsetWidth : 0;

      const clickX = event.clientX;
      const x = Math.max(
        0,
        Math.min(
          clickX - sliderRect.left - handleWidth / 2,
          sliderRect.width - handleWidth
        )
      );
      const newValue =
        (x / (sliderRect.width - handleWidth)) * (max - min) + min;
      setSliderValue(newValue);
      onChange(newValue);
    },
    [min, max, onChange]
  );

  useEffect(() => {
    function handleMousemove(event) {
      if (!sliderRef.current || !handleRef.current) return;
      const sliderRect = sliderRef.current.getBoundingClientRect();
      const handleWidth = handleRef.current.offsetWidth;

      const clickX = event.clientX;
      const x = Math.max(
        0,
        Math.min(
          clickX - sliderRect.left - handleWidth / 2,
          sliderRect.width - handleWidth
        )
      );
      const newValue =
        (x / (sliderRect.width - handleWidth)) * (max - min) + min;
      setSliderValue(newValue);
      onChange(newValue);
    }

    function handleMouseUp() {
      document.removeEventListener("mousemove", handleMousemove);
    }

    if (handleRef.current) {
      handleRef.current.addEventListener("mousedown", handleDragStart);

      handleRef.current.addEventListener("mousedown", () => {
        document.addEventListener("mousemove", handleMousemove);
        document.addEventListener("mouseup", handleMouseUp);
      });
    }
    return () => {
      if (handleRef.current) {
        handleRef.current.removeEventListener("mousedown", handleDragStart);
      }
      document.removeEventListener("mousemove", handleMousemove);
    };
  }, [handleDragStart, min, max, onChange]);

  const sliderWidth = ((sliderValue - min) / (max - min)) * 100;

  return (
    <div className="relative w-full">
      <div
        ref={sliderRef}
        className="h-1 bg-gray-300 rounded-full cursor-pointer"
        onClick={handleSliderChange}
      >
        <div
          style={{ width: `${sliderWidth}%` }}
          className="h-full bg-primary rounded-full "
        ></div>

        <div
          ref={handleRef}
          className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-primary rounded-full  -ml-2 cursor-grab focus:outline-none"
          style={{ left: `${sliderWidth}%` }}
        />
      </div>

      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

export default Slider;
