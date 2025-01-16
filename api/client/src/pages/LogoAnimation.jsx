// client/src/components/ui/LogoAnimation.jsx
import React from "react";
import "./LogoAnimation.css"; // Import the CSS file

function LogoAnimation() {
  return (
    <div className="logo-animation-container">
      <div className="logo-animation">
        <div className="semi-transparent-circle"></div>
        <div className="ribbon-shape"></div>
        <div className="solid-circle"></div>
      </div>
    </div>
  );
}

export default LogoAnimation;
