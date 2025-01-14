import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashProfile from "../components/DashProfile";
import DashSidebar from "../components/DasSidebar";
import DashUsers from "../components/DashUsers";
import History from "./History";
import TextToSpeech from "./TextToSpeech";
import FileToSpeech from "./FileToSpeech";
import ProjectDashboard from "./ProjectDashboard";
import DashboardComp from "../components/DashboardComp";

export default function Dashboard() {
    const location = useLocation();
    const [tab, setTab] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    useEffect(() => {
        const urlPrams = new URLSearchParams(location.search);
        const tabFromUrl = urlPrams.get("tab");
        if (tabFromUrl) {
            setTab(tabFromUrl);
        }
    }, [location.search]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    return (
        <div
            className={`min-h-screen grid  md:grid-cols-[auto_1fr] ${
                isSidebarOpen ? "lg:grid-cols-[auto_1fr]" : "grid-cols-[auto_1fr]"
            }`}
        >
            {/* Sidebar */}
            <div
                className={`relative md:block  transition-all duration-300 pt-8
                        ${isSidebarOpen ? "md:w-56 lg:w-56" : "md:w-16 lg:w-16"}
                          dark:bg-gray-900/100
                     `}
            >
                <DashSidebar  toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
            </div>
            {/* Main Content */}
            <div onClick={() => setIsSidebarOpen(false)} className="flex-grow p-4 md:p-6 lg:p-8 w-full pt-16   ">
                {/* Profile */}
                {tab === "profile" && <DashProfile />}
                {/* Post  */}
                {tab === "history" && <History />}
                {/* users */}
                {tab === "users" && <DashUsers />}
                {/* member */}
                {tab === "text-to-speech" && <TextToSpeech />}
                {tab === "dash" && <DashboardComp />}
                {/* table */}
                {/* commensts dash */}
                {tab === "file-to-speech" && <FileToSpeech />}
                {/* dashboard commponent */}
                {tab === "projects" && <ProjectDashboard />}
            </div>
        </div>
    );
}