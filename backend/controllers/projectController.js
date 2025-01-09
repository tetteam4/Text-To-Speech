import asyncHandler from "express-async-handler";
import Project from "../models/project.js";

const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ userId: req.user._id });
  res.status(200).json(projects);
});

const createProject = asyncHandler(async (req, res) => {
  const { projectName, text, voiceSettings } = req.body;
  if (!projectName || !text) {
    res.status(400);
    throw new Error("Project name and text are required");
  }
  const project = await Project.create({
    userId: req.user._id,
    projectName,
    text,
    voiceSettings,
  });
  res.status(201).json(project);
});
const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (project) {
    res.status(200).json(project);
  } else {
    res.status(404);
    throw new Error("Project not found");
  }
});

const updateProject = asyncHandler(async (req, res) => {
  const { projectName, text, voiceSettings } = req.body;
  const project = await Project.findById(req.params.id);

  if (project) {
    project.projectName = projectName || project.projectName;
    project.text = text || project.text;
    project.voiceSettings = voiceSettings || project.voiceSettings;

    const updatedProject = await project.save();

    res.status(200).json(updatedProject);
  } else {
    res.status(404);
    throw new Error("Project not found");
  }
});

const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (project) {
    await project.remove();
    res.status(200).json({ message: "Project removed" });
  } else {
    res.status(404);
    throw new Error("Project not found");
  }
});

export {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
};