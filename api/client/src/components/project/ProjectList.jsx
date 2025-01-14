// client/src/components/project/ProjectList.jsx
import React from "react";
import ProjectCard from "./ProjectCard";
import { useSelector } from "react-redux";
function ProjectList() {
  const { projects, loading, error } = useSelector((state) => state.project);

  return (
    <div>
      {loading && <p>Loading projects...</p>}
      {error && <p>Error: {error}</p>}
      {projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No projects found</p>
      )}
    </div>
  );
}
export default ProjectList;
