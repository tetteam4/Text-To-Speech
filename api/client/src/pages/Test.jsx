import React from 'react'

function Test() {
  return (
    <div className="container">
      <div className="astronaut">
        {/* <img src={astronautImage} alt="Astronaut lost in space" /> */}
        <div className="bubble"></div>
      </div>
      <div className="content">
        <h1>404</h1>
        <h2>Oops! The page you're looking for has drifted into the void.</h2>
        <p>
          Perhaps try navigating back to <a href="/">the home planet</a>?
        </p>
        <p className="small-text">Or check your coordinates.</p>
      </div>
    </div>
  );
}

export default Test