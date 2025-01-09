// client/src/pages/UserDashboard.jsx
import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import Sidebar from "../components/layout/DashSidebar";
import Profile from "./Profile";
import ProjectDashboard from "./ProjectDashboard";
import History from "./History";
import FileToSpeech from "./FileToSpeech";
import { useLocation } from "react-router-dom";
import TextToSpeech from "./TextToSpeech";

function UserDashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlPrams = new URLSearchParams(location.search);
    const tabFromUrl = urlPrams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <Layout>
      <div className="min-h-screen w-full">
        <div>
          <Sidebar />
        </div>

        {/* Profile */}
        {tab === "profile" && <Profile />}

        {/* Post  */}
        {tab === "text-to-speech" && <TextToSpeech />}

        {/* users */}

        {tab === "projects" && <ProjectDashboard />}

        {/* member */}

        {tab === "history" && <History />}

        {/* commensts dash */}
        {tab === "file-to-speech" && <FileToSpeech />}
      </div>
    </Layout>
  );
}

export default UserDashboard;
