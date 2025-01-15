import React, { useEffect } from "react";
import astronautImage from "../assets/logo.png"; // Import the image

const NotFoundPage = () => {
  useEffect(() => {
    createStars();
  }, []); // Run this only once, after the component mounts

  const createStars = () => {
    const starsContainer = document.querySelector(".container");

    for (let i = 0; i < 50; i++) {
      const star = document.createElement("div");
      star.classList.add("star");
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.animationDelay = `${Math.random() * 5}s`;
      starsContainer.appendChild(star);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen overflow-hidden  text-gray-50 font-spacegrotesk">
      <div className="container flex items-center justify-center gap-12 p-8 bg-black/30 rounded-xl shadow-xl backdrop-blur-sm border border-white/20 relative">
        <div className="astronaut relative">
          <img
            src={astronautImage}
            alt="Astronaut lost in space"
            className="max-w-[250px] animate-floating"
          />
          <div className="bubble absolute -top-6 -right-6 w-24 h-24 bg-zinc-600/20 rounded-full shadow-inner animate-bubbleMovement"></div>
        </div>
        <div className="content text-left">
          <h1 className="text-6xl mb-2">404</h1>
          <h2 className="text-xl mb-4">
            Oops! The page you're looking for has drifted into the void.
          </h2>
          <p>
            Perhaps try navigating back to{" "}
            <a href="/" className="text-sky-400 hover:underline">
              the home planet
            </a>
            ?
          </p>
          <p className="text-sm text-gray-400 mt-8">
            Or check your coordinates.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
