import React, { useEffect, useState } from "react";
import { Sidebar } from "flowbite-react";
import { motion } from "framer-motion";
import {
  HiUser,
  HiChartPie,
  HiDocumentText,
  HiArchive,
  HiAnnotation,
  HiArrowSmRight,
} from "react-icons/hi";
import { useLocation, Link } from "react-router-dom";
import useStore from "../../store/store";
import Profile from "../../pages/Profile";
import TextToSpeech from "../../pages/TextToSpeech";
import FileToSpeech from "../../pages/FileToSpeech";
import Home from "../../pages/Home";

function DashSidebar() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("");
  const { user } = useStore();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [location.search]);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };


   const welcomeVariants = {
     initial: { opacity: 0, y: 20 },
     animate: {
       opacity: 1,
       y: 0,
       transition: { duration: 0.5, ease: "easeOut" },
     },
     exit: {
       opacity: 0,
       y: -20,
       transition: { duration: 0.3, ease: "easeIn" },
     },
   };
  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    fontSize: "1.5em",
    fontWeight: "bold",
    color: "#333", // Adjust color as needed
  }; 
  return (
    <div className="flex">
      <Sidebar
        className="bg-gray-800 text-balance w-64 min-h-screen fixed top-16 left-0" // Fixed sidebar
      >
        <Sidebar.Items>
          <div className="mb-8 px-4">
            <h2 className="font-bold text-2xl text-black">TET TTS</h2>
          </div>
          <Sidebar.ItemGroup>
            <Sidebar.Item
              active={activeTab === "profile"}
              icon={HiUser}
              onClick={() => handleTabClick("profile")}
            >
              Profile
            </Sidebar.Item>
            <Sidebar.Item
              active={activeTab === "text-to-speech"}
              icon={HiChartPie}
              onClick={() => handleTabClick("text-to-speech")}
            >
              Text to Speech
            </Sidebar.Item>
            <Sidebar.Item
              active={activeTab === "file-to-speech"}
              icon={HiDocumentText}
              onClick={() => handleTabClick("file-to-speech")}
            >
              File to Speech
            </Sidebar.Item>
            <Sidebar.Item
              active={activeTab === "history"}
              icon={HiArchive}
              onClick={() => handleTabClick("history")}
            >
              History
            </Sidebar.Item>
            <Sidebar.Item
              active={activeTab === "/"}
              icon={HiAnnotation}
              onClick={() => handleTabClick("/")}
            >
              Home
            </Sidebar.Item>
            <Sidebar.Item
              icon={HiArrowSmRight}
              className="cursor-pointer"
              // onClick={handleSignout}
            >
              Logout
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>

      {/* Content area */}
      <div className="flex-1 ml-40 p-8 mt-16">
        {" "}
        {/* Adjusted margin */}
        {activeTab === "profile" && (
          <div>
            <Profile />
          </div>
        )}
        {activeTab === "text-to-speech" && (
          <div>
            <TextToSpeech />
          </div>
        )}
        {activeTab === "file-to-speech" && (
          <div>
            <FileToSpeech />
          </div>
        )}
        {activeTab === "history" && (
          <div>
            <History />
          </div>
        )}
        {activeTab === "home" && (
          <div>
            <Home/>
          </div>
        )}
        {!activeTab && (
          <motion.div
            style={containerStyle}
            variants={welcomeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            Welcome to your Dashboard!
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default DashSidebar;
