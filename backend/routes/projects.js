import express from "express";
import {
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  updateProject,
} from "../controllers/projectController.js";
import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();

router.route("/").get(protect, getProjects).post(protect, createProject);
router
  .route("/:id")
  .get(protect, getProjectById)
  .put(protect, updateProject)
  .delete(protect, deleteProject);
export default router;
