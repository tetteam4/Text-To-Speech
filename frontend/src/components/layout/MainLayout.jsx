// client/src/components/layout/MainLayout.jsx
import React from "react";
import Navbar from "./Navbar";

function MainLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-light-grey">{children}</main>
    </div>
  );
}

export default MainLayout;
