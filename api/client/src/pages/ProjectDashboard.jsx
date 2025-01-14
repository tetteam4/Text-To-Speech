import React, { useEffect, useState } from "react";
import ProjectList from "../components/project/ProjectList";
import ProjectForm from "../components/project/ProjectForm";
import { useDispatch } from "react-redux";
import { fetchProjects } from "../redux/user/projectSlice";

function ProjectDashboard() {
  const [showForm, setShowForm] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleCreateProject = () => {
    setShowForm(true);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 w-full pt-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
          My Projects
        </h2>
        <button
          onClick={handleCreateProject}
          className="bg-primary text-white px-3 py-2 rounded font-medium hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-all duration-200"
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
