import express from 'express';
import {
  createNewProject,
  deleteProject,
  getAllProjects,
  getAssignedProjects,
  getMyProjects,
  getProject,
  updateProject,
} from '../Controllers/projectController.js';
import { protectRoute } from '../Controllers/authController.js';
import taskRouter from './taskRoutes.js';

const router = express.Router();

router.use(protectRoute);

// Nested route for accessing tasks of a project
router.use('/:projectId/tasks', taskRouter);

router.route('/').get(getAllProjects).post(createNewProject);

// For getting assigned projects
router.get('/assigned', getAssignedProjects);

router.route('/:id').get(getProject).patch(updateProject).delete(deleteProject);

router.get('/my_projects', getMyProjects);

export default router;
