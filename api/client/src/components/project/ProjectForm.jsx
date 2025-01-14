// client/src/components/project/ProjectForm.jsx
import React, { useState } from "react";
import Button from "../ui/Button";
import InputText from "../ui/InputText";
import { useDispatch, useSelector } from "react-redux";
import { createProject } from "../../redux/user/projectSlice";

function ProjectForm({ closeForm }) {
  const [projectName, setProjectName] = useState("");
  const [text, setText] = useState("");
  const { loading } = useSelector((state) => state.project);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createProject({ projectName, text }));
      closeForm();
    } catch (error) {
      console.error("Error on submit form", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-gray-700">
        Create New Project
      </h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <InputText
          placeholder="Enter your text here..."
          onTextChange={setText}
          initialText={text}
        />
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={closeForm} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Loading..." : "Create Project"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ProjectForm;
