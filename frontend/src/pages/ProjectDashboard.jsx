// client/src/pages/ProjectDashboard.jsx
import React, { useEffect, useState } from "react";
import ProjectList from "../components/project/ProjectList";
import ProjectForm from "../components/project/ProjectForm";
import useStore from "../store/store";

function ProjectDashboard() {
  const [showForm, setShowForm] = useState(false);
  const { user, projects, setLoading, setError, fetchVoices } = useStore();
  useEffect(() => {
    fetchVoices();
  }, [fetchVoices]);
  const handleCreateProject = () => {
    setShowForm(true);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">My Projects</h2>
        <button
          onClick={handleCreateProject}
          className="bg-primary text-white px-4 py-2 rounded font-medium hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-all duration-200"
        >
          Create Project
        </button>
      </div>
      {showForm ? (
        <ProjectForm closeForm={() => setShowForm(false)} />
      ) : (
        <ProjectList />
      )}
    </div>
  );
}

export default ProjectDashboard;
