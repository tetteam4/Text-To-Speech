// client/src/components/project/ProjectCard.jsx
import React from "react";
import Button from "../ui/Button";
import { useDispatch } from "react-redux";
import { deleteProject } from "../../redux/user/projectSlice";

function ProjectCard({ project }) {
  const dispatch = useDispatch();
  const handleDelete = async () => {
    try {
      await dispatch(deleteProject(project._id));
    } catch (error) {
      console.log("Error on delete", error);
    }
  };

  return (
    <div className="bg-white rounded p-4 border border-gray-200 flex flex-col">
      <h3 className="text-lg font-medium text-gray-700 mb-2">
        {project.projectName}
      </h3>
      <p className="text-gray-500 mb-4 text-sm">
        {project.text.length > 100
          ? project.text.slice(0, 100) + "..."
          : project.text}
      </p>
      <div className="mt-auto flex justify-between">
        <Button size="small">Download</Button>
        <Button variant="secondary" size="small" onClick={handleDelete}>
          Delete
        </Button>
      </div>
    </div>
  );
}

export default ProjectCard;
