// client/src/components/layout/Layout.jsx
import React from "react";
import Sidebar from "./DashSidebar";

function Layout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* <Sidebar /> */}
      <main className="flex-1 p-8 bg-light-grey">{children}</main>
    </div>
  );
}

export default Layout;
