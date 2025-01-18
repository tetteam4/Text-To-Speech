import React, { useState } from "react";
import "./styles.css";

const Text = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      className="button"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="actual-text">webguild webguild</span>
      <span
        aria-hidden="true"
        className="front-text"
        style={{
          "--ani-color": hovered
            ? "rgba(3, 154, 244, 1)"
            : "rgba(3, 154, 244, 0)",
        }}
      >
        webguild webguild
      </span>
    </button>
  );
};

export default Text;
